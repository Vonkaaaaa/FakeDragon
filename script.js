// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    // Save theme preference
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Smooth Scroll Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle Card Function
function toggleCard(card) {
    card.classList.toggle('active');
}

// Fixed Dragon Animations
const fixedDragon = document.querySelector('.fixed-dragon');
const animations = ['jumping', 'spinning', 'shaking'];
let currentAnimationIndex = 0;

function playDragonAnimation() {
    if (!fixedDragon) return;
    
    // Remove all animation classes
    animations.forEach(anim => fixedDragon.classList.remove(anim));
    
    // Add random animation
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    fixedDragon.classList.add(randomAnimation);
    
    // Remove animation class after it completes
    setTimeout(() => {
        fixedDragon.classList.remove(randomAnimation);
    }, 1000);
}

// Play animation every 5 seconds
setInterval(playDragonAnimation, 5000);

// Click on dragon for instant animation
if (fixedDragon) {
    fixedDragon.parentElement.addEventListener('click', playDragonAnimation);
}


// Quiz Data
const quizData = [
    {
        question: "Ти побачив шокуючу новину в соцмережах. Що робити першим?",
        options: [
            { text: "Одразу поділитися з друзями", correct: false },
            { text: "Перевірити джерело та знайти підтвердження", correct: true },
            { text: "Написати обурений коментар", correct: false },
            { text: "Проігнорувати", correct: false }
        ],
        explanation: "Завжди перевіряй інформацію перед тим, як ділитися нею!"
    },
    {
        question: "Як перевірити, чи справжнє фото в новині?",
        options: [
            { text: "Повірити, якщо воно виглядає реалістично", correct: false },
            { text: "Використати пошук Google за зображенням", correct: true },
            { text: "Запитати друзів в коментарях", correct: false },
            { text: "Перевірити кількість лайків", correct: false }
        ],
        explanation: "Пошук за зображенням допоможе знайти оригінал фото та його контекст."
    },
    {
        question: "Що є ознакою фейкової новини?",
        options: [
            { text: "Сенсаційний заголовок ВЕЛИКИМИ ЛІТЕРАМИ!!!", correct: true },
            { text: "Посилання на офіційні джерела", correct: false },
            { text: "Вказаний автор та дата публікації", correct: false },
            { text: "Нейтральний тон викладу", correct: false }
        ],
        explanation: "Фейки часто використовують емоційні заголовки для привернення уваги."
    },
    {
        question: "Друг надіслав тобі 'термінове повідомлення' з проханням переслати всім. Твої дії?",
        options: [
            { text: "Одразу переслати всім контактам", correct: false },
            { text: "Перевірити інформацію на фактчекінгових сайтах", correct: true },
            { text: "Видалити та заблокувати друга", correct: false },
            { text: "Додати ще більше емоцій та переслати", correct: false }
        ],
        explanation: "Ланцюгові повідомлення часто містять фейки. Завжди перевіряй!"
    },
    {
        question: "Чому фейки поширюються швидше за правду?",
        options: [
            { text: "Вони більш правдиві", correct: false },
            { text: "Вони викликають сильні емоції", correct: true },
            { text: "Їх створюють професіонали", correct: false },
            { text: "Вони коротші", correct: false }
        ],
        explanation: "Фейки грають на емоціях: страху, гніві, здивуванні - тому поширюються швидко."
    },
    {
        question: "Що робити, якщо ти випадково поширив фейк?",
        options: [
            { text: "Нічого, нехай залишається", correct: false },
            { text: "Видалити пост та опублікувати спростування", correct: true },
            { text: "Видалити акаунт", correct: false },
            { text: "Звинуватити того, хто надіслав", correct: false }
        ],
        explanation: "Визнати помилку та виправити її - це ознака відповідальності!"
    },
    {
        question: "Яке джерело найбільш надійне?",
        options: [
            { text: "Анонімний телеграм-канал з 100К підписників", correct: false },
            { text: "Перевірене медіа з фактчекінгом", correct: true },
            { text: "Пост знайомого в Facebook", correct: false },
            { text: "Меми в Instagram", correct: false }
        ],
        explanation: "Довіряй перевіреним медіа, які дотримуються журналістських стандартів."
    },
    {
        question: "Що таке 'deepfake'?",
        options: [
            { text: "Глибоке занурення у фейки", correct: false },
            { text: "Відео/аудіо, створене за допомогою AI", correct: true },
            { text: "Дуже очевидний фейк", correct: false },
            { text: "Фейк про глибоководних істот", correct: false }
        ],
        explanation: "Deepfake - це реалістичні підробки, створені штучним інтелектом."
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// Initialize Quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    showQuestion();
}

// Show Question
function showQuestion() {
    const quizContent = document.getElementById('quizContent');
    const question = quizData[currentQuestion];
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        optionsHTML += `
            <div class="quiz-option" onclick="selectOption(${index})">
                <div class="option-letter">${letter}</div>
                <div class="option-text">${option.text}</div>
            </div>
        `;
    });
    
    quizContent.innerHTML = `
        <div class="quiz-question">
            <h3>Питання ${currentQuestion + 1} з ${quizData.length}</h3>
            <p style="font-size: 1.2rem; margin: 1rem 0;">${question.question}</p>
        </div>
        <div class="quiz-options">
            ${optionsHTML}
        </div>
        <div class="quiz-navigation">
            <button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestion === 0 ? 'disabled' : ''}>
                ← Назад
            </button>
            <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" disabled>
                ${currentQuestion === quizData.length - 1 ? 'Завершити' : 'Далі →'}
            </button>
        </div>
        <div class="quiz-progress">
            Прогрес: ${currentQuestion + 1}/${quizData.length}
        </div>
    `;
}

// Select Option
function selectOption(index) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    
    userAnswers[currentQuestion] = index;
    document.getElementById('nextBtn').disabled = false;
}

// Next Question
function nextQuestion() {
    if (userAnswers[currentQuestion] === undefined) {
        return;
    }
    
    const question = quizData[currentQuestion];
    const userAnswer = userAnswers[currentQuestion];
    
    if (question.options[userAnswer].correct) {
        score++;
    }
    
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Previous Question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        
        // Restore previous selection
        if (userAnswers[currentQuestion] !== undefined) {
            const options = document.querySelectorAll('.quiz-option');
            options[userAnswers[currentQuestion]].classList.add('selected');
            document.getElementById('nextBtn').disabled = false;
        }
    }
}

// Show Result
function showResult() {
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const resultDragon = document.getElementById('resultDragon');
    
    quizContent.classList.add('hidden');
    quizResult.classList.remove('hidden');
    
    const percentage = (score / quizData.length) * 100;
    
    let title, text, dragon;
    
    if (percentage >= 80) {
        title = "🎉 Вітаємо! Ти - справжній борець з фейками!";
        text = `Ти правильно відповів на ${score} з ${quizData.length} питань (${percentage.toFixed(0)}%). Ти чудово розумієш, як розпізнавати фейки та перевіряти інформацію. Продовжуй у тому ж дусі!`;
        dragon = "🐲✨";
    } else if (percentage >= 60) {
        title = "👍 Добре! Ти на правильному шляху!";
        text = `Ти правильно відповів на ${score} з ${quizData.length} питань (${percentage.toFixed(0)}%). У тебе є базові навички розпізнавання фейків, але є куди рости. Перечитай поради на сайті!`;
        dragon = "🐲📚";
    } else if (percentage >= 40) {
        title = "🤔 Потрібно попрацювати!";
        text = `Ти правильно відповів на ${score} з ${quizData.length} питань (${percentage.toFixed(0)}%). Тобі варто більше дізнатися про те, як розпізнавати фейки. Вивчи матеріали на цьому сайті!`;
        dragon = "🐲📖";
    } else {
        title = "⚠️ Обережно! Ти в зоні ризику!";
        text = `Ти правильно відповів лише на ${score} з ${quizData.length} питань (${percentage.toFixed(0)}%). Тобі дуже важливо навчитися розпізнавати фейки, щоб не стати їх жертвою. Почни з порад на цьому сайті!`;
        dragon = "🐲⚠️";
    }
    
    resultTitle.textContent = title;
    resultText.textContent = text;
    resultDragon.textContent = dragon;
}

// Restart Quiz
function restartQuiz() {
    document.getElementById('quizContent').classList.remove('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    initQuiz();
}

// Share Website
function shareWebsite() {
    const shareData = {
        title: 'Фейкодракончик - Борьба з фейками',
        text: 'Навчися розпізнавати фейки в інтернеті!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Посилання скопійовано в буфер обміну!');
            })
            .catch(err => {
                console.log('Error copying:', err);
                alert('Не вдалося скопіювати посилання');
            });
    }
}


// Initialize Quiz on page load
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const body = document.body;
    body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        body.style.animation = '';
        alert('🐲 Секретний дракон активований! Ти знайшов пасхалку!');
    }, 2000);
}

// Prevent context menu on dragon (fun feature)
const dragonContainer = document.getElementById('dragonContainer');
if (dragonContainer) {
    dragonContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert('🐲 Дракончик каже: не намагайся мене скопіювати! Я унікальний!');
    });
}

// Console Easter Egg
console.log('%c🐲 Привіт, дослідник коду!', 'font-size: 20px; color: #4CAF50; font-weight: bold;');
console.log('%cТи знайшов консоль розробника! Це означає, що ти цікавишся, як працюють речі - це чудово!', 'font-size: 14px; color: #2196F3;');
console.log('%cПам\'ятай: завжди перевіряй інформацію, навіть якщо вона виглядає правдоподібно!', 'font-size: 14px; color: #FF9800;');
console.log('%c- Фейкодракончик 🐲', 'font-size: 14px; color: #4CAF50; font-style: italic;');
