import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

// Clean up any outdated caches
cleanupOutdatedCaches();

// Take control of all clients immediately
clientsClaim();
skipWaiting();

// Cache strategies for different types of resources
const CACHE_NAME = 'ai-master-v1';
const API_CACHE_NAME = 'ai-master-api-v1';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/products',
        '/blog',
        '/about',
        '/manifest.json'
      ]);
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API responses with network first strategy
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          const cachedResponse = await cache.match(request);
          return cachedResponse || new Response('אין חיבור לאינטרנט', { status: 503 });
        }
      })
    );
    return;
  }

  // Cache static assets with cache first strategy
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // For navigation requests, try network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/') || caches.match(request);
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Background sync triggered');
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png',
      badge: '/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'פתח',
          icon: '/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});