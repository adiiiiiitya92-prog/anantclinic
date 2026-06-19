const CACHE_NAME = 'anant-clinic-v1';
const ASSETS_TO_CACHE = [
  '/login',
  '/assets/logo anant.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle standard local requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Use a network-first strategy, falling back to cache when offline
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful and request is static asset, cache it
        if (response.ok && event.request.method === 'GET') {
          const urlPath = new URL(event.request.url).pathname;
          if (urlPath.startsWith('/assets/') || urlPath === '/favicon.ico') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If offline and request is an HTML page (like /login or /), return the cached login page
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/login');
          }
        });
      })
  );
});
