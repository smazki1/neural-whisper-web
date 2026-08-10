// One-release cleanup worker: removes stale Workbox caches that can serve an
// outdated app shell, then unregisters itself. Home-screen metadata remains.
function isAppWorkboxCache(name) {
  const isWorkboxCache = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name);
  return isWorkboxCache && name.endsWith(self.registration.scope);
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      const staleAppCaches = cacheNames.filter(isAppWorkboxCache);
      await Promise.allSettled(staleAppCaches.map((name) => caches.delete(name)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: 'window' });
      await Promise.allSettled(clients.map((client) => client.navigate(client.url)));
    } finally {
      await self.registration.unregister();
    }
  })());
});