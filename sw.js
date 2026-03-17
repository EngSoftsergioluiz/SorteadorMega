/* ===================================================
   Service Worker – Studio Kellen Cristina Estoque
   Caches the app shell for offline use.
=================================================== */

const CACHE_NAME = 'kc-estoque-v1';

const APP_SHELL = [
  '/estoque.html',
  '/manifest.json'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (CDN libraries, fonts, etc.)
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses from our own origin
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, cloned))
            .catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
