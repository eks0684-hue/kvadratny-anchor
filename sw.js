const CACHE_NAME = 'kvadratny-anchor-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('[SW] Установка завершена');
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', function(event) {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('[SW] Активация завершена');
      return self.clients.claim();
    })
  );
});

// Перехват запросов (стратегия Cache First)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Если есть в кэше - возвращаем из кэша
        if (response) {
          console.log('[SW] Из кэша:', event.request.url);
          return response;
        }
       
        // Иначе делаем сетевой запрос
        console.log('[SW] Из сети:', event.request.url);
        return fetch(event.request)
          .then(function(response) {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
           
            // Клонируем ответ для кэширования
            const responseToCache = response.clone();
           
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
           
            return response;
          })
          .catch(function(error) {
            console.log('[SW] Ошибка загрузки:', error);
            // Если оффлайн и нет в кэше - возвращаем index.html
            return caches.match('./index.html');
          });
      })
  );
});
