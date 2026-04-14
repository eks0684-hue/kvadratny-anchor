const CACHE_NAME = 'kvadratny-anchor-v5';

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './click.mp3'
];

self.addEventListener('install', function(event) {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('[SW] Все файлы закэшированы');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[SW] Ошибка кэширования:', error);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Удаление старого кэша:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        console.log('[SW] Service Worker активирован');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }
       
        return fetch(event.request)
          .then(function(networkResponse) {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
           
            const responseToCache = networkResponse.clone();
           
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
           
            return networkResponse;
          })
          .catch(function(error) {
            console.log('[SW] Ошибка загрузки:', error);
            return caches.match('./index.html');
          });
      })
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
