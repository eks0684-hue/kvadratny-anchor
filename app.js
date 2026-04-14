```javascript
// ============================================
// ДАННЫЕ: 16 квадратов с 4 фразами каждый
// ============================================

const squaresData = [
    { id: 1, phrases: ["Я здесь", "Дыши", "Все будет", "Сделай сейчас"] },
    { id: 2, phrases: ["Здесь и сейчас", "Вдох-выдох", "Это временно", "Просто начни"] },
    { id: 3, phrases: ["Это момент", "Что я вижу?", "Все проходит", "Шаг за шагом"] },
    { id: 4, phrases: ["Осознаю", "Прикоснись", "Это не конец", "Делай"] },
    { id: 5, phrases: ["Я есть", "Что вокруг?", "Как есть", "Продолжай"] },
    { id: 6, phrases: ["Наблюдай", "Один вдох", "Прими", "Выбери"] },
    { id: 7, phrases: ["Что сейчас?", "Почувствуй вес", "Это опыт", "Иди"] },
    { id: 8, phrases: ["Настоящее", "Стоп", "Прошлое ушло", "Смелее"] },
    { id: 9, phrases: ["Я могу", "Дыши спокойно", "Все хорошо", "Двигайся"] },
    { id: 10, phrases: ["Я способен", "Вдох", "Завтра будет завтра", "Решайся"] },
    { id: 11, phrases: ["Я верю", "Тело здесь", "Все меняется", "Сделай это"] },
    { id: 12, phrases: ["Моя сила", "Выдохни", "Будущее закрыто", "Начни"] },
    { id: 13, phrases: ["Смелость", "Что я чувствую", "Подумаем потом", "Действуй"] },
    { id: 14, phrases: ["Твой путь", "Переключись", "Время лечит", "Позволь себе"] },
    { id: 15, phrases: ["Живи", "Это лишь миг", "Спасибо", "Радость"] },
    { id: 16, phrases: ["Покой", "Все верно", "И это пройдет", "Ты - это ты"] }
];

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initApp();
    registerServiceWorker();
    checkOnlineStatus();
});

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
// ============================================

function initApp() {
    const grid = document.getElementById('grid');
    const resetBtn = document.getElementById('resetBtn');
   
    // Загружаем сохраненные состояния из localStorage
    const savedStates = loadStates();
   
    // Создаем все 16 квадратов
    squaresData.forEach(function(square) {
        const currentSide = savedStates[square.id] || 0;
        const squareElement = createSquareElement(square, currentSide);
        grid.appendChild(squareElement);
    });
   
    // Обработчик кнопки сброса
    resetBtn.addEventListener('click', resetAllSquares);
}

// ============================================
// СОЗДАНИЕ ЭЛЕМЕНТА КВАДРАТА
// ============================================

function createSquareElement(square, currentSide) {
    // Контейнер квадрата
    const squareDiv = document.createElement('div');
    squareDiv.className = 'square';
    squareDiv.dataset.id = square.id;
    squareDiv.dataset.currentSide = currentSide;
   
    // Внутренний контейнер для 3D flip
    const innerDiv = document.createElement('div');
    innerDiv.className = 'square-inner';
   
    // Передняя сторона (текущая фраза)
    const frontFace = document.createElement('div');
    frontFace.className = 'square-face front';
    frontFace.textContent = square.phrases[currentSide];
   
    // Задняя сторона (следующая фраза)
    const nextSide = (currentSide + 1) % 4;
    const backFace = document.createElement('div');
    backFace.className = 'square-face back';
    backFace.textContent = square.phrases[nextSide];
   
    // Собираем структуру
    innerDiv.appendChild(frontFace);
    innerDiv.appendChild(backFace);
    squareDiv.appendChild(innerDiv);
   
    // Обработчик клика для переворота
    squareDiv.addEventListener('click', function() {
        handleSquareClick(squareDiv, square);
    });
   
    return squareDiv;
}

// ============================================
// ОБРАБОТКА КЛИКА НА КВАДРАТ (FLIP АНИМАЦИЯ)
// ============================================

function handleSquareClick(squareElement, squareData) {
    // Предотвращаем множественные клики во время анимации
    if (squareElement.classList.contains('flipping')) {
        return;
    }
   
    // Добавляем класс для запуска анимации
    squareElement.classList.add('flipping');
   
    // Получаем текущую и следующую сторону
    let currentSide = parseInt(squareElement.dataset.currentSide);
    const nextSide = (currentSide + 1) % 4;
   
    // Ждем половину анимации (момент переворота)
    setTimeout(function() {
        // Обновляем текст на передней стороне
        const frontFace = squareElement.querySelector('.square-face.front');
        frontFace.textContent = squareData.phrases[nextSide];
       
        // Обновляем текст на задней стороне (следующая фраза после nextSide)
        const backFace = squareElement.querySelector('.square-face.back');
        const afterNextSide = (nextSide + 1) % 4;
        backFace.textContent = squareData.phrases[afterNextSide];
       
        // Обновляем текущую сторону
        squareElement.dataset.currentSide = nextSide;
       
        // Сохраняем состояние
        saveState(squareData.id, nextSide);
    }, 300);
   
    // Убираем класс анимации после завершения
    setTimeout(function() {
        squareElement.classList.remove('flipping');
    }, 600);
}

// ============================================
// СБРОС ВСЕХ КВАДРАТОВ
// ============================================

function resetAllSquares() {
    // Подтверждение действия
    if (!confirm('Вы уверены, что хотите сбросить все кубики?')) {
        return;
    }
   
    // Очищаем localStorage
    localStorage.removeItem('squareStates');
   
    // Перезагружаем все квадраты
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
   
    squaresData.forEach(function(square) {
        const squareElement = createSquareElement(square, 0);
        grid.appendChild(squareElement);
    });
   
    // Показываем уведомление
    showNotification('Все кубики сброшены');
}

// ============================================
// РАБОТА С LOCALSTORAGE
// ============================================

function saveState(squareId, side) {
    const states = loadStates();
    states[squareId] = side;
    localStorage.setItem('squareStates', JSON.stringify(states));
}

function loadStates() {
    const saved = localStorage.getItem('squareStates');
    return saved ? JSON.parse(saved) : {};
}

// ============================================
// УВЕДОМЛЕНИЯ
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(45, 95, 79, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
   
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 2000);
}

// ============================================
// РЕГИСТРАЦИЯ SERVICE WORKER (ДЛЯ ОФФЛАЙН)
// ============================================

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
                    console.log('⏳ Service Worker ожидает активации...');
                    // Принудительно активируем новый SW
                    registration.waiting.postMessage({type: 'SKIP_WAITING'});
                } else if (registration.active) {
                    console.log('✅ Service Worker уже активен');
                }
               
                // Слушаем обновления
                registration.addEventListener('updatefound', function() {
                    console.log('🔄 Найдено обновление Service Worker');
                    const newWorker = registration.installing;
                   
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('✨ Новая версия доступна! Обновите страницу.');
                        }
                    });
                });
            })
            .catch(function(error) {
                console.error('❌ SW registration failed:', error);
            });
    } else {
        console.error('❌ Service Workers не поддерживаются этим браузером');
    }
}

// ============================================
// ПРОВЕРКА СТАТУСА ПОДКЛЮЧЕНИЯ
// ============================================

function checkOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
   
    function updateStatus() {
        if (!navigator.onLine) {
            console.log('📴 ОФФЛАЙН режим');
            if (indicator) {
                indicator.classList.add('show');
            }
        } else {
            console.log('🌐 ОНЛАЙН режим');
            if (indicator) {
                indicator.classList.remove('show');
            }
        }
    }
   
    // Проверяем при загрузке
    updateStatus();
   
    // Слушаем изменения статуса
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}

// ============================================
// КНОПКА УСТАНОВКИ PWA
// ============================================

let deferredPrompt;
let installButton;

// Перехватываем событие установки
window.addEventListener('beforeinstallprompt', function(e) {
    console.log('✅ Событие beforeinstallprompt перехвачено');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Показываем кнопку установки
function showInstallButton() {
    const container = document.querySelector('.container');
   
    // Проверяем что кнопка ещё не создана
    if (document.getElementById('installBtn')) {
        return;
    }
   
    console.log('📱 Показываем кнопку установки');
   
    installButton = document.createElement('button');
    installButton.id = 'installBtn';
    installButton.className = 'reset-btn';
    installButton.textContent = '📱 Установить приложение';
    installButton.style.marginTop = '20px';
    installButton.style.background = 'linear-gradient(135deg, #4a6fa5, #2d5f4f)';
   
    installButton.addEventListener('click', async function() {
        console.log('👆 Нажата кнопка установки');
       
        if (!deferredPrompt) {
            console.log('❌ deferredPrompt не доступен');
            alert('Установка недоступна. Попробуйте через меню браузера: ⋮ → "Установить приложение"');
            return;
        }
       
        // Показываем диалог установки
        deferredPrompt.prompt();
       
        // Ждём ответа пользователя
        const result = await deferredPrompt.userChoice;
       
        console.log('Результат установки:', result.outcome);
       
        if (result.outcome === 'accepted') {
            console.log('✅ Пользователь установил приложение');
        } else {
            console.log('❌ Пользователь отказался от установки');
        }
       
        // Очищаем
        deferredPrompt = null;
        installButton.style.display = 'none';
    });
   
    container.appendChild(installButton);
}

// Скрываем кнопку если приложение установлено
window.addEventListener('appinstalled', function() {
    console.log('✅ Приложение установлено');
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Проверяем запущено ли приложение в standalone режиме
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ Приложение открыто в standalone режиме (установлено)');
} else {
    console.log('ℹ️ Приложение открыто в браузере');
}

// ============================================
// ИНФОРМАЦИЯ О SERVICE WORKER В КОНСОЛИ
// ============================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
        console.log('✅ Service Worker готов:', registration);
        console.log('📍 Scope:', registration.scope);
       
        if (registration.active) {
            console.log('✅ Service Worker активен');
        }
    });
}

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ ЛОГИ ДЛЯ ОТЛАДКИ
// ============================================

console.log('🚀 Приложение "Квадратный Якорь" запущено');
console.log('📦 Загружено квадратов:', squaresData.length);
console.log('💾 LocalStorage доступен:', typeof(Storage) !== "undefined");

// Проверка всех необходимых API
if ('serviceWorker' in navigator) {
    console.log('✅ Service Worker API поддерживается');
} else {
    console.log('❌ Service Worker API НЕ поддерживается');
}

if (window.caches) {
    console.log('✅ Cache API поддерживается');
} else {
    console.log('❌ Cache API НЕ поддерживается');
}

if ('localStorage' in window) {
    console.log('✅ LocalStorage поддерживается');
} else {
    console.log('❌ LocalStorage НЕ поддерживается');
}
```

---

## 📝 Как загрузить этот код на GitHub:

1. Откройте GitHub → ваш репозиторий `kvadratny-anchor`
2. Найдите файл **app.js**
3. Если файл **существует**:
   - Кликните на него
   - Нажмите **карандаш** ✏️ (Edit)
   - Нажмите **Ctrl+A** (выделить всё)
   - Нажмите **Delete**
   - Скопируйте весь код выше
   - Вставьте в пустой файл
   - Нажмите **"Commit changes"**

4. Если файл **НЕ существует** (удалили):
   - Нажмите **"Add file"** → **"Create new file"**
   - Назовите файл: `app.js`
   - Скопируйте весь код выше
   - Вставьте
   - Нажмите **"Commit changes"**

---

## ✅ После загрузки проверьте:

1. Подождите **2-3 минуты**
2. Откройте приложение в браузере
3. Нажмите **Ctrl+Shift+R** (жёсткое обновление)
4. Откройте консоль (F12 → Console)

**Вы должны увидеть:**
```
🚀 Приложение "Квадратный Якорь" запущено
📦 Загружено квадратов: 16
💾 LocalStorage доступен: true
✅ Service Worker API поддерживается
✅ Cache API поддерживается
✅ LocalStorage поддерживается
🔧 Регистрация Service Worker...
🌐 ОНЛАЙН режим
✅ SW registration successful. Scope: ...
```
