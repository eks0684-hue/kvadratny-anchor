// Данные квадратов
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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    registerServiceWorker();
});

// Основная функция
function initApp() {
    const grid = document.getElementById('grid');
    const resetBtn = document.getElementById('resetBtn');
   
    if (!grid) {
        console.error('Grid не найден!');
        return;
    }
   
    const savedStates = loadStates();
   
    squaresData.forEach(function(square) {
        const currentSide = savedStates[square.id] || 0;
        const squareElement = createSquareElement(square, currentSide);
        grid.appendChild(squareElement);
    });
   
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllSquares);
    }
}

// Создание квадрата
function createSquareElement(square, currentSide) {
    const squareDiv = document.createElement('div');
    squareDiv.className = 'square';
    squareDiv.dataset.id = square.id;
    squareDiv.dataset.currentSide = currentSide;
   
    const innerDiv = document.createElement('div');
    innerDiv.className = 'square-inner';
   
    const frontFace = document.createElement('div');
    frontFace.className = 'square-face front';
    frontFace.textContent = square.phrases[currentSide];
   
    const nextSide = (currentSide + 1) % 4;
    const backFace = document.createElement('div');
    backFace.className = 'square-face back';
    backFace.textContent = square.phrases[nextSide];
   
    innerDiv.appendChild(frontFace);
    innerDiv.appendChild(backFace);
    squareDiv.appendChild(innerDiv);
   
    squareDiv.addEventListener('click', function() {
        handleSquareClick(squareDiv, square);
    });
   
    return squareDiv;
}

// Обработка клика (со звуком)
function handleSquareClick(squareElement, squareData) {
    if (squareElement.classList.contains('flipping')) {
        return;
    }
   
    // Воспроизводим звук
    playClickSound();
   
    squareElement.classList.add('flipping');
   
    let currentSide = parseInt(squareElement.dataset.currentSide);
    const nextSide = (currentSide + 1) % 4;
   
    setTimeout(function() {
        const frontFace = squareElement.querySelector('.square-face.front');
        frontFace.textContent = squareData.phrases[nextSide];
       
        const backFace = squareElement.querySelector('.square-face.back');
        const afterNextSide = (nextSide + 1) % 4;
        backFace.textContent = squareData.phrases[afterNextSide];
       
        squareElement.dataset.currentSide = nextSide;
        saveState(squareData.id, nextSide);
    }, 300);
   
    setTimeout(function() {
        squareElement.classList.remove('flipping');
    }, 600);
}

// Воспроизведение звука
function playClickSound() {
    try {
        const audio = new Audio('./click.mp3');
        audio.volume = 0.3;
        audio.play().catch(function(error) {
            console.log('Звук не воспроизведен:', error);
        });
    } catch (error) {
        console.log('Ошибка звука:', error);
    }
}

// Сброс квадратов
function resetAllSquares() {
    if (!confirm('Сбросить все кубики?')) {
        return;
    }
   
    localStorage.removeItem('squareStates');
   
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
   
    squaresData.forEach(function(square) {
        const squareElement = createSquareElement(square, 0);
        grid.appendChild(squareElement);
    });
}

// LocalStorage
function saveState(squareId, side) {
    const states = loadStates();
    states[squareId] = side;
    localStorage.setItem('squareStates', JSON.stringify(states));
}

function loadStates() {
    const saved = localStorage.getItem('squareStates');
    return saved ? JSON.parse(saved) : {};
}

// Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(function(reg) {
                console.log('Service Worker OK');
            })
            .catch(function(err) {
                console.log('SW Error:', err);
            });
    }
}
