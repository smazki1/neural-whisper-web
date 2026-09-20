import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Run each page's actual content JSX, without fetching or writing any records.
// jsdom loads no external resources; only the synthetic inline markers execute.
const dom = new JSDOM('', { runScripts: 'dangerously', url: 'https://example.test' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
test.after(() => {
  dom.window.close();
  delete globalThis.window;
  delete globalThis.document;
});

async function contentRenderer(page) {
  const source = await readFile(new URL(`../src/pages/${page}.tsx`, import.meta.url), 'utf8');
  const ast = ts.createSourceFile(`${page}.tsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const sinks = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && node.attributes.properties.some(
      (attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === 'dangerouslySetInnerHTML',
    )) sinks.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(sinks.length, 1, `${page} content sink must be covered`);

  // Resolve the real local helper imports, if present. Before the fix the page
  // has no sanitizer import and its unmodified JSX renders the unsafe content.
  const bindings = { React };
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const path = statement.moduleSpecifier.text;
    if (!path.startsWith('@/lib/')) continue;
    const imported = await import(new URL(`../src/${path.slice(2)}`, import.meta.url));
    const names = statement.importClause?.namedBindings;
    if (names && ts.isNamedImports(names)) {
      for (const name of names.elements) {
        bindings[name.name.text] = imported[name.propertyName?.text ?? name.name.text];
      }
    }
  }
  const compiled = ts.transpileModule(`(${sinks[0].getText(ast)})`, {
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS },
  }).outputText;

  return (content) => {
    dom.window.__xss = 0;
    const element = runInNewContext(compiled, {
      ...bindings, post: { content }, lesson: { content },
    });
    const container = dom.window.document.createElement('main');
    container.innerHTML = renderToStaticMarkup(element);
    dom.window.document.body.replaceChildren(container);
    return container;
  };
}

const attacks = {
  'img/onerror': '<p>טקסט</p><img src="missing.png" onerror="window.__xss++">',
  'SVG/onload': '<svg onload="window.__xss++"><circle r="10" /></svg>',
  'javascript URLs': '<a href="javascript:window.__xss++">click</a><a href="java&#x73;cript:window.__xss++">encoded</a>',
  'attribute breakout': '<img alt="" onerror="window.__xss++" src="missing.png"><a title=""><svg onload="window.__xss++"></svg>">link</a>',
  script: '<p>טקסט</p><script>window.__xss++</script>',
};

const pages = ['BlogPost', 'Lesson'];
const renderers = await Promise.all(pages.map(contentRenderer));
for (const [index, page] of pages.entries()) {
  const render = renderers[index];
  for (const [name, payload] of Object.entries(attacks)) {
    test(`${page} blocks ${name} after loading stored content`, () => {
      const container = render(payload);
      for (const element of container.querySelectorAll('*')) {
        element.dispatchEvent(new dom.window.Event('error'));
        element.dispatchEvent(new dom.window.Event('load'));
      }
      assert.equal(dom.window.__xss, 0, 'stored content must not execute event handlers');
      assert.equal(container.querySelector('script'), null);
      for (const element of container.querySelectorAll('*')) {
        for (const attribute of element.attributes) {
          assert.ok(!/^on/i.test(attribute.name), `unsafe event attribute: ${attribute.name}`);
          if (['href', 'src', 'xlink:href'].includes(attribute.name)) {
            assert.ok(!/^javascript:/i.test(attribute.value.replace(/[\s\u0000-\u001f]/g, '')), 'unsafe URL');
          }
        }
      }
    });
  }

  test(`${page} preserves rich HTML, RTL, HTTPS links, images and tables`, () => {
    const container = render(`<section dir="rtl" lang="he" class="ql-align-right" style="text-align: right;">
      <h2>כותרת בעברית</h2><p><strong>מודגש</strong> <em>נטוי</em></p>
      <ul><li>פריט</li></ul><ol><li>שלב</li></ol><blockquote>ציטוט</blockquote>
      <a href="https://example.test/article?q=1&amp;lang=he">קישור</a>
      <img src="https://example.test/image.png" alt="תמונה" width="320" height="180">
      <table><thead><tr><th>שם</th></tr></thead><tbody><tr><td colspan="2">ערך</td></tr></tbody></table>
      <pre><code>&lt;img src=x onerror=alert(1)&gt;</code></pre>
    </section>`);
    assert.equal(container.querySelector('section').getAttribute('dir'), 'rtl');
    assert.equal(container.querySelector('section').lang, 'he');
    assert.equal(container.querySelector('section').className, 'ql-align-right');
    assert.equal(container.querySelector('section').style.textAlign, 'right');
    for (const [selector, text] of Object.entries({
      h2: 'כותרת בעברית', strong: 'מודגש', em: 'נטוי', 'ul li': 'פריט',
      'ol li': 'שלב', blockquote: 'ציטוט', th: 'שם', td: 'ערך',
      'pre code': '<img src=x onerror=alert(1)>',
    })) assert.equal(container.querySelector(selector)?.textContent, text);
    assert.equal(container.querySelector('a').href, 'https://example.test/article?q=1&lang=he');
    assert.equal(container.querySelector('img').src, 'https://example.test/image.png');
    assert.equal(container.querySelector('img').alt, 'תמונה');
    assert.equal(container.querySelector('img').width, 320);
    assert.equal(container.querySelector('img').height, 180);
    assert.equal(container.querySelector('td').colSpan, 2);
    assert.equal(dom.window.__xss, 0);
  });
}
