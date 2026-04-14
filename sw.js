const CACHE_NAME = 'kvadratny-anchor-v3';

// Список файлов для кэширования
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Событие установки
self.addEventListener('install', function(event) {
  console.log('[SW] Установка Service Worker...');
 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Открыт кэш:', CACHE_NAME);
        console.log('[SW] Кэшируем файлы:', urlsToCache);
       
        // Кэшируем каждый файл отдельно с логами
        return Promise.all(
          urlsToCache.map(function(url) {
            return cache.add(url)
              .then(function() {
                console.log('[SW] ✅ Закэшировано:', url);
              })
              .catch(function(error) {
                console.error('[SW] ❌ Ошибка кэширования:', url, error);
              });
          })
        );
      })
      .then(function() {
        console.log('[SW] ✅ Все файлы закэшированы!');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('[SW] ❌ Ошибка открытия кэша:', error);
      })
  );
});

// Событие активации
self.addEventListener('activate', function(event) {
  console.log('[SW] Активация Service Worker...');
 
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Удаляем старый кэш:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        console.log('[SW] ✅ Service Worker активирован!');
        return self.clients.claim();
      })
  );
});

// Событие fetch - стратегия "Cache First"
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
 
  // Игнорируем запросы к другим доменам
  if (requestUrl.origin !== location.origin) {
    return;
  }
 
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        if (cachedResponse) {
          console.log('[SW] 📦 Из кэша:', event.request.url);
          return cachedResponse;
        }
       
        console.log('[SW] 🌐 Из сети:', event.request.url);
       
        return fetch(event.request)
          .then(function(networkResponse) {
            // Кэшируем успешные ответы
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
             
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                  console.log('[SW] 💾 Добавлено в кэш:', event.request.url);
                });
            }
           
            return networkResponse;
          })
          .catch(function(error) {
            console.log('[SW] ⚠️ Ошибка сети:', event.request.url);
           
            // Если оффлайн и запрос на HTML - возвращаем index.html из кэша
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
           
            return caches.match(event.request);
          });
      })
  );
});

// Дополнительное событие - сообщения от страницы
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Получена команда SKIP_WAITING');
    self.skipWaiting();
  }
});

console.log('[SW] 🚀 Service Worker файл загружен');
