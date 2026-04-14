// Временный sw.js для теста

self.addEventListener('install', event => {
  console.log('SW Test: Установка (install) прошла!');
});

self.addEventListener('activate', event => {
  console.log('SW Test: Активация (activate) прошла!');
});

self.addEventListener('fetch', event => {
  // Пока ничего не делаем с запросами, просто пропускаем их в сеть
  return;
});
