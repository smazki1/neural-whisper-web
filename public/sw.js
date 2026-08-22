// One-release cleanup worker: removes every cache created for this origin so
// an outdated app shell can never override the current deployment.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.allSettled(cacheNames.map((name) => caches.delete(name)));
      await self.clients.claim();
    } finally {
      await self.registration.unregister();
    }
  })());
});
