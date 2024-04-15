// Define the cache name and the URLs to cache
const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles.css',
  '/src/app.js',
  '/src/dynamicSearch.js',
  '/src/dynamicRadius.js',
  '/src/savedLocation.js',
  '/leaflet/leaflet-src.js',
  '/leaflet/leaflet.css',
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
];

// Event listener for the 'install' event, triggered when the service worker is first installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for the 'fetch' event, triggered when a resource is requested
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.startsWith('https://{s}.tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
  }
});
