function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log('🔧 Регистрация Service Worker...');
       
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('✅ SW registration successful. Scope:', registration.scope);
               
                // Проверяем статус
                if (registration.installing) {
                    console.log('📦 Service Worker устанавливается...');
                } else if (registration.waiting) {
                    console.log('⏳ Service Worker ожидает...');
                    // Принудительно активируем новый SW
                    registration.waiting.postMessage({type: 'SKIP_WAITING'});
                } else if (registration.active) {
                    console.log('✅ Service Worker уже активен');
                }
               
                // Слушаем обновления
                registration.addEventListener('updatefound', function() {
                    console.log('🔄 Найдено обновление Service Worker');
                });
            })
            .catch(function(error) {
                console.error('❌ SW registration failed:', error);
            });
    } else {
        console.error('❌ Service Workers не поддерживаются');
    }
}
