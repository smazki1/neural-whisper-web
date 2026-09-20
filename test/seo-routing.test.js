import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createServer, request } from 'node:http';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const config = JSON.parse(await read('vercel.json'));
const app = await read('src/App.tsx');
const paths = [...app.matchAll(/<Route path="(\/[^"*]*)"/g)].map(match => match[1]);
const knownPaths = [...paths, '/admin/*'];
const reactRouteMatches = path => knownPaths.some(route => new RegExp(
  `^${route.replace(/:[^/]+/g, '[^/]+').replace('*', '.*')}/?$`, 'i',
).test(path));

// Execute the actual Edge Function, replacing only the network/database boundary.
async function edgeHandler(fixtures = {}) {
  const source = (await read('supabase/functions/generate-sitemap/index.ts'))
    .replace(/^import .*;\n/gm, '');
  let handler;
  const queries = [];
  runInNewContext(ts.transpileModule(source, {}).outputText, {
    Response, console: { log() {}, error() {} },
    Deno: { env: { get: () => 'local-fixture' } },
    serve: fn => { handler = fn; },
    createClient: () => ({ from(table) {
      const query = { table, filters: [] };
      queries.push(query);
      const builder = {
        select() { return builder; },
        eq(...filter) { query.filters.push(filter); return builder; },
        order() { return builder; },
        then(resolve) { return Promise.resolve({ data: fixtures[table] || [], error: null }).then(resolve); },
      };
      return builder;
    } }),
  });
  return { handler, queries };
}

// Exercise the checked-in routing rules over HTTP. This is a local contract
// harness, not the Vercel edge runtime; deployment smoke remains a release check.
function routeRequest(path, host = 'ai-master.co.il') {
  // High-level rewrites already give existing filesystem assets precedence.
  if (!config.routes && ['/robots.txt', '/assets/existing.js'].includes(path)) return { status: 200, dest: path };
  for (const route of config.routes || config.rewrites.map(r => ({ src: r.source, dest: r.destination }))) {
    if (route.handle === 'filesystem') {
      if (path === '/robots.txt' || path === '/assets/existing.js') return { status: 200, dest: path };
      continue;
    }
    const pattern = new RegExp(`^(?:${route.src})$`, 'i');
    if (!pattern.test(path)) continue;
    if (route.has?.some(condition => condition.type !== 'host' || condition.value !== host)) continue;
    return {
      status: route.status || 200,
      dest: route.dest && path.replace(pattern, route.dest),
      headers: Object.fromEntries(Object.entries(route.headers || {}).map(([key, value]) => [key, path.replace(pattern, value)])),
    };
  }
  return { status: 404 };
}

const { handler } = await edgeHandler();
const server = createServer(async (req, res) => {
  const route = routeRequest(new URL(req.url, 'http://localhost').pathname, req.headers.host);
  res.statusCode = route.status;
  for (const [key, value] of Object.entries(route.headers || {})) res.setHeader(key, value);
  if (route.dest?.endsWith('/functions/v1/generate-sitemap')) {
    const response = await handler(new Request('http://localhost/sitemap.xml'));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => { if (!res.hasHeader(key)) res.setHeader(key, value); });
    res.end(await response.text());
  } else if (route.dest === '/robots.txt') {
    res.setHeader('Content-Type', 'text/plain');
    res.end(await read('public/robots.txt'));
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end(await read('index.html'));
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
test.after(() => new Promise(resolve => server.close(resolve)));

function parseSitemap(xml) {
  const dom = new JSDOM(xml, { contentType: 'application/xml' });
  assert.equal(dom.window.document.documentElement.localName, 'urlset');
  const locations = [...dom.window.document.querySelectorAll('loc')].map(el => el.textContent);
  dom.window.close();
  return locations;
}

test('/sitemap.xml returns valid XML with XML Content-Type over HTTP', async () => {
  const response = await fetch(`${origin}/sitemap.xml`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/xml(?:;|$)/);
  assert.ok(parseSitemap(await response.text()).length > 0);
});

test('robots.txt advertises the primary domain', async () => {
  assert.match(await read('public/robots.txt'), /^Sitemap: https:\/\/ai-master.co.il\/sitemap.xml$/m);
});

test('Edge sitemap uses only primary-domain URLs and existing routes', async () => {
  const { handler, queries } = await edgeHandler({
    blog_posts: [{ slug: 'real-post', updated_at: '2026-09-05' }],
    categories: [{ slug: 'category', created_at: '2026-09-05' }],
    blog_tags: [{ slug: 'tag', created_at: '2026-09-05' }],
  });
  const response = await handler(new Request('http://localhost/sitemap.xml'));
  assert.equal(response.status, 200);
  const urls = parseSitemap(await response.text());
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, 'https://ai-master.co.il');
    assert.ok(reactRouteMatches(url.pathname), `missing React route: ${url.pathname}`);
  }
  assert.ok(urls.includes('https://ai-master.co.il/blog/real-post'));
  assert.ok(queries.find(q => q.table === 'blog_posts').filters.some(([key, value]) => key === 'is_published' && value === true));
});

test('Edge sitemap handles reserved characters in post slugs as valid XML and one URL segment', async () => {
  const slug = 'שלום & AI/<guide>';
  const { handler } = await edgeHandler({ blog_posts: [{ slug, updated_at: '2026-09-05' }] });
  const response = await handler(new Request('http://localhost/sitemap.xml'));
  assert.ok(parseSitemap(await response.text()).includes(`https://ai-master.co.il/blog/${encodeURIComponent(slug)}`));
});

async function browserSitemap() {
  const source = ts.transpileModule(await read('src/utils/sitemap.ts'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  runInNewContext(source, { exports, window: { location: { origin: 'https://preview.example' } } });
  return exports;
}

test('downloaded sitemap and robots use primary domain and existing routes', async () => {
  const sitemap = await browserSitemap();
  const urls = parseSitemap(sitemap.generateSitemap());
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, 'https://ai-master.co.il');
    assert.ok(reactRouteMatches(url.pathname), `missing React route: ${url.pathname}`);
  }
  assert.match(sitemap.generateRobotsTxt(), /^Sitemap: https:\/\/ai-master.co.il\/sitemap.xml$/m);
});

test('downloaded sitemap safely encodes dynamic slugs and XML values', async () => {
  const sitemap = await browserSitemap();
  const slug = 'AI & <tools>/guide';
  const urls = parseSitemap(sitemap.generateSitemap({ posts: [{ slug }], products: [{ slug }] }));
  assert.ok(urls.includes(`https://ai-master.co.il/blog/${encodeURIComponent(slug)}`));
  assert.ok(urls.includes(`https://ai-master.co.il/products/${encodeURIComponent(slug)}`));
});

test('BlogPost renders canonical and og:url on the primary domain', async () => {
  const source = await read('src/pages/BlogPost.tsx');
  const ast = ts.createSourceFile('BlogPost.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const tags = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && /rel="canonical"|property="og:url"/.test(node.getText(ast))) tags.push(node.getText(ast));
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(tags.length, 2);
  for (const jsx of tags) {
    const compiled = ts.transpileModule(`(${jsx})`, { compilerOptions: { jsx: ts.JsxEmit.React } }).outputText;
    const markup = renderToStaticMarkup(runInNewContext(compiled, { React, post: { slug: 'test-post' } }));
    assert.match(markup, /(?:href|content)="https:\/\/ai-master.co.il\/blog\/test-post"/);
  }
});

test('www redirects permanently and preserves a deep path', async () => {
  const response = await new Promise((resolve, reject) => {
    const req = request(`${origin}/blog/test-post`, { headers: { host: 'www.ai-master.co.il' } }, res => { res.resume(); resolve(res); });
    req.on('error', reject);
    req.end();
  });
  assert.equal(response.statusCode, 308);
  assert.equal(response.headers.location, 'https://ai-master.co.il/blog/test-post');
  assert.equal(routeRequest('/blog/test-post', 'ai-master.co.il').status, 200);
  assert.equal(routeRequest('/blog/test-post', 'preview.vercel.app').status, 200);
});

test('unknown paths return real HTTP 404 while keeping the SPA error page', async () => {
  for (const path of ['/seo-missing-random-52d8', '/blog/tag/no-tag', '/blog/category/no-category', '/products/test/extra']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /id="root"/);
  }
});

test('every registered SPA route including dynamic and nested admin paths still loads', async () => {
  const samples = paths.map(path => path.replace(/:[^/]+/g, 'fixture-id'));
  samples.push('/admin', '/admin/content/blog', '/admin/products/new', '/admin/leads');
  for (const path of samples) {
    for (const variant of new Set([path, `${path.replace(/\/$/, '')}/`])) {
      const response = await fetch(origin + variant);
      assert.equal(response.status, 200, variant);
      assert.match(await response.text(), /id="root"/);
    }
  }
});

test('static files bypass SPA routing', () => {
  assert.equal(routeRequest('/robots.txt').dest, '/robots.txt');
  assert.equal(routeRequest('/assets/existing.js').dest, '/assets/existing.js');
});

test('all WhatsApp links use the approved number', async () => {
  const files = await readdir(new URL('../src', import.meta.url), { recursive: true });
  let count = 0;
  for (const file of files.filter(file => /\.(tsx?|jsx?)$/.test(file))) {
    for (const match of (await read(`src/${file}`)).matchAll(/https:\/\/wa\.me\/(\d+)/g)) {
      count++;
      assert.equal(match[1], '972527772807', file);
    }
  }
  assert.ok(count >= 2);
});

test('SEOProvider keeps the blog canonical on the primary domain even on preview hosts', async () => {
  const source = await read('src/components/SEO/SEOProvider.tsx');
  const expression = source.match(/const currentUrl = (.*);/)[1];
  const url = runInNewContext(expression, { window: { location: { origin: 'https://preview.example' } }, location: { pathname: '/blog/test-post' } });
  assert.equal(url, 'https://ai-master.co.il/blog/test-post');
});
