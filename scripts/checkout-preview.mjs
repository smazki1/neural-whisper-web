/** Local review only: reads the vault preview's in-memory products, never Supabase. */
import { createServer } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = 5292;
const origin = `http://127.0.0.1:${port}`;
const vaultOrigin = 'http://127.0.0.1:5291';
let failProducts = false;
const json = (res, body, status = 200) => {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};

const server = await createServer({
  root, configFile: false, envFile: false,
  resolve: { alias: { '@': `${root}src` } },
  server: { host: '127.0.0.1', port, strictPort: true },
  plugins: [react(), {
    name: 'local-checkout-review', enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/src/integrations/supabase/client.ts')) return;
      return source
        .replace(/const SUPABASE_URL = .*;/, `const SUPABASE_URL = ${JSON.stringify(origin)};`)
        .replace(/const SUPABASE_PUBLISHABLE_KEY = .*;/, 'const SUPABASE_PUBLISHABLE_KEY = "local-preview-only";');
    },
    transformIndexHtml() {
      return [{ tag: 'div', injectTo: 'body', attrs: { style: 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#fff4be;color:#162e52;padding:8px;text-align:center;font:14px Arial', dir: 'rtl' }, children: 'בדיקה מקומית בלבד. נתוני המוצר מגיעים מהדמיית האדמין. <button id="fail-checkout">הדמיית כשל בטעינה</button>' },
      { tag: 'script', injectTo: 'body', children: `document.getElementById('fail-checkout').onclick = async () => { await fetch('/__checkout-preview/toggle-error', {method:'POST'}); location.reload(); };` }];
    },
    configureServer(vite) {
      vite.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url, origin).pathname;
        if (path === '/__checkout-preview/toggle-error' && req.method === 'POST') {
          failProducts = !failProducts;
          return json(res, { failProducts });
        }
        if (!/^\/(rest|auth|storage|functions)\/v1\//.test(path)) return next();
        // No forwarding of writes, and the only upstream is another loopback mock.
        if (req.method !== 'GET') return json(res, []);
        if (path === '/auth/v1/user') return json(res, null);
        if (path !== '/rest/v1/products') return json(res, []);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (failProducts) return json(res, { message: 'Simulated product read failure' }, 503);
        try {
          const response = await fetch(`${vaultOrigin}${req.url}`, { headers: { accept: req.headers.accept || 'application/json' } });
          return json(res, await response.json(), response.status);
        } catch {
          return json(res, { message: 'Start the vault product preview on port 5291 first.' }, 503);
        }
      });
    },
  }],
});
await server.listen();
console.log(`Checkout review: ${origin}/idea-to-business`);
console.log('In the vault preview, publish the demo product with landing URL https://ai-master.co.il/idea-to-business.');
