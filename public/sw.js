const CACHE_NAME = 'warrior-journal-v1';
const urlsToCache = [
  '/',
  '/warriors-journal.png',
  '/manifest.json'
];

// Skip service worker in development
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  self.addEventListener('install', () => {
    self.skipWaiting();
  });
  
  self.addEventListener('activate', () => {
    self.clients.claim();
  });
  
  // Don't cache anything in development
  self.addEventListener('fetch', (event) => {
    // Let all requests pass through normally
    return;
  });
} else {
  // Production service worker logic
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(urlsToCache);
        })
        .catch((error) => {
          console.log('Cache addAll failed:', error);
        })
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
}
