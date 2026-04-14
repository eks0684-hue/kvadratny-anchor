// ============================================
// 🔊 ЗВУК ЧЕРЕЗ <audio>
// ============================================

let clickSound;

document.addEventListener('DOMContentLoaded', () => {
    clickSound = document.getElementById('clickSound');
    initApp();
});

// функция звука
function playClickSound() {
    if (!clickSound) return;

    clickSound.currentTime = 0;

    const playPromise = clickSound.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {});
    }
}

// ============================================
// ДАННЫЕ
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
// ИНИЦИАЛИЗАЦИЯ
// ============================================

function initApp() {
    const grid = document.getElementById('grid');
    const resetBtn = document.getElementById('resetBtn');

    squaresData.forEach(square => {
        grid.appendChild(createSquareElement(square, 0));
    });

    resetBtn.addEventListener('click', resetAllSquares);
}

// ============================================
// СОЗДАНИЕ КВАДРАТА
// ============================================

function createSquareElement(square, currentSide) {
    const squareDiv = document.createElement('div');
    squareDiv.className = 'square';
    squareDiv.dataset.currentSide = currentSide;

    const innerDiv = document.createElement('div');
    innerDiv.className = 'square-inner';

    const front = document.createElement('div');
    front.className = 'square-face front';
    front.textContent = square.phrases[currentSide];

    const back = document.createElement('div');
    back.className = 'square-face back';
    back.textContent = square.phrases[(currentSide + 1) % 4];

    innerDiv.appendChild(front);
    innerDiv.appendChild(back);
    squareDiv.appendChild(innerDiv);

    squareDiv.addEventListener('click', () => handleClick(squareDiv, square));

    return squareDiv;
}

// ============================================
// КЛИК
// ============================================

function handleClick(square, data) {
    if (square.classList.contains('flipping')) return;

    playClickSound(); // 🔊 звук

    square.classList.add('flipping');

    let current = parseInt(square.dataset.currentSide);
    let next = (current + 1) % 4;

    setTimeout(() => {
        square.querySelector('.front').textContent = data.phrases[next];
        square.querySelector('.back').textContent = data.phrases[(next + 1) % 4];

        square.dataset.currentSide = next;
    }, 300);

    setTimeout(() => {
        square.classList.remove('flipping');
    }, 600);
}

// ============================================
// СБРОС
// ============================================

function resetAllSquares() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    squaresData.forEach(square => {
        grid.appendChild(createSquareElement(square, 0));
    });
}
// ============================================
// КНОПКА УСТАНОВКИ PWA
// ============================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const container = document.querySelector('.container');
   
    // Проверяем что кнопка ещё не создана
    if (document.getElementById('installBtn')) {
        return;
    }
   
    const installBtn = document.createElement('button');
    installBtn.id = 'installBtn';
    installBtn.className = 'reset-btn';
    installBtn.textContent = '📱 Установить приложение';
    installBtn.style.marginTop = '20px';
    installBtn.style.background = 'linear-gradient(135deg, #4a6fa5, #2d5f4f)';
   
    installBtn.addEventListener('click', async function() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
           
            if (result.outcome === 'accepted') {
                console.log('Приложение установлено');
                installBtn.style.display = 'none';
            }
           
            deferredPrompt = null;
        }
    });
   
    container.appendChild(installBtn);
}

// Скрываем кнопку если приложение уже установлено
window.addEventListener('appinstalled', function() {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});
