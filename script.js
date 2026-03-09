/**
 * Скіл Хаб — Single Page Navigation + Inline Quizzes
 */

// --- Стан ---
let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
// per-quiz active state
const quizState = {};

// --- Quiz Data ---
const contentData = {
    'fakedragon': {
        title: "ФейкоДракончик",
        icon: "🐲",
        quiz: [
            { q: "Яка головна відмінність фейку від звичайної журналістської помилки?", options: ["Фейк завжди коротший", "Фейк має на меті навмисно обманути", "Помилки бувають тільки на ТБ", "У фейків немає картинок"], correct: 1, exp: "Фейк створюється цілеспрямовано для маніпуляції." },
            { q: "Ти побачив сенсаційну новину з дуже емоційним заголовком. Твої дії?", options: ["Швидше переслати друзям", "Написати гнівний коментар", "Зупинитися і перевірити в надійних джерелах", "Повірити, бо заголовок правдивий"], correct: 2, exp: "Емоції — перший сигнал, що тобою намагаються маніпулювати." },
            { q: "Що таке 'зворотний пошук зображень'?", options: ["Пошук по всьому інтернету за допомогою фото", "Зміна кольору фото", "Видалення фону", "Друк фото на папері"], correct: 0, exp: "Це допомагає знайти оригінал фото та дату його першої появи." },
            { q: "Хто зазвичай є першоджерелом надійної інформації?", options: ["Анонімний Telegram-канал", "Пост сусіда у Facebook", "Офіційні прес-релізи або перевірені інформагенції", "Скріншот без дати"], correct: 2, exp: "Офіційні джерела несуть відповідальність за інформацію." },
            { q: "Яка ознака може вказувати на діпфейк?", options: ["Людина занадто часто моргає", "Погане освітлення в кімнаті", "Незбіг міміки та звуку", "Чорно-білий колір"], correct: 2, exp: "Штучний інтелект часто допускає помилки в синхронізації губ і міміки." },
            { q: "Сайт новин не має розділу 'Про нас' та контактів редакції. Чи можна йому довіряти?", options: ["Так, головне новини", "Ні, прозорість — ознака якості", "Тільки якщо там багато реклами", "Тільки якщо він на першому місці в Google"], correct: 1, exp: "Відсутність контактів — ознака 'сміттярки', що поширює фейки." },
            { q: "Чи може старе відео бути частиною фейку?", options: ["Ні, воно ж справжнє", "Так, якщо йому приписали інший опис", "Ні, відео неможливо підробити", "Тільки якщо воно в 4К"], correct: 1, exp: "Виривання контексту — частий метод маніпуляції." },
            { q: "Тобі прислали повідомлення про 'терміновий збір грошей' від знайомого, але текст виглядає підозріло. Твої дії?", options: ["Швидко скинути гроші", "Перевірити, чи не зламали акаунт знайомого", "Проігнорувати і заблокувати", "Скинути пост у групу будинку"], correct: 1, exp: "Шахраї часто використовують фейкові приводи для збору коштів." }
        ]
    },
    'critical': {
        title: "Критичне мислення",
        icon: "🧠",
        quiz: [
            { q: "Що таке когнітивне упередження?", options: ["Хвороба мозку", "Систематична помилка в мисленні", "Здатність швидко читати", "Хороша пам'ять"], correct: 1, exp: "Це природна властивість мозку економити зусилля, що призводить до помилок." },
            { q: "Як називається пошук лише тієї інформації, що нам подобається?", options: ["Ерудиція", "Упередження підтвердження", "Оптимізм", "Критичний аналіз"], correct: 1, exp: "Ми схильні 'фільтрувати' світ під свою думку." },
            { q: "Вираз 'Всі так роблять, значить це правильно' — це...", options: ["Сильний аргумент", "Логічна хиба", "Демократія", "Факт"], correct: 1, exp: "Більшість не завжди права — це апеляція до популярності." },
            { q: "Що є основою критичного мислення?", options: ["Завжди сперечатися", "Ставити запитання та перевіряти факти", "Нікому не вірити", "Знати все на світі"], correct: 1, exp: "Допитливість і перевірка — ключі до істини." },
            { q: "Як називається перехід на особистості замість обговорення аргументів?", options: ["Дискусія", "Ad Hominem", "Комплімент", "Сильний хід"], correct: 1, exp: "Напади на людину — ознака слабких аргументів." },
            { q: "Чи можна критично мислити, будучи дуже емоційним?", options: ["Так, емоції допомагають", "Ні, емоції звужують увагу", "Тільки якщо ти в гніві", "Тільки якщо ти щасливий"], correct: 1, exp: "Холодний розум необхідний для аналізу." },
            { q: "Що таке 'солом'яне опудало' в дискусії?", options: ["Опудало на полі", "Викривлення позиції опонента, щоб її легше було розкритикувати", "Подарунок другу", "Мовчання під час спору"], correct: 1, exp: "Спрощення чужої думки до абсурду — це маніпуляція." },
            { q: "Навіщо нам критичне мислення в щоденному житті?", options: ["Щоб здаватися розумнішими", "Щоб приймати кращі рішення та не дати себе обманути", "Щоб виграти всі суперечки", "Немає потреби"], correct: 1, exp: "Це інструмент для виживання в інформаційному шумі." }
        ]
    },
    'security': {
        title: "Цифрова безпека",
        icon: "🔒",
        quiz: [
            { q: "Який пароль є найнадійнішим?", options: ["admin123", "Дата народження", "Комбінація випадкових букв, цифр і символів", "Пароль123"], correct: 2, exp: "Складність — ворог хакерів." },
            { q: "Що таке двофакторна автентифікація (2FA)?", options: ["Два однакових пароля", "Додатковий код підтвердження (наприклад, з SMS або додатку)", "Вхід через Facebook", "Використання двох браузерів"], correct: 1, exp: "Це другий замок на твоїх дверях." },
            { q: "Тобі прийшов лист від 'банку' з проханням терміново ввести пароль на сайті. Це...", options: ["Сервіс", "Фішинг", "Удача", "Подарунок"], correct: 1, exp: "Банки ніколи не просять паролі таким чином." },
            { q: "Що в адресі сайту вказує на зашифроване з'єднання?", options: ["Яскравий логотип", "https:// та замок у браузері", "Велика кількість реклами", "Закінчення на .com"], correct: 1, exp: "HTTPS — S означає Secure." },
            { q: "Чи безпечно використовувати відкритий Wi-Fi у кафе для входу в банк?", options: ["Так, якщо там немає людей", "Ні, трафік можуть перехопити", "Так, це зручно", "Тільки з телефону"], correct: 1, exp: "Публічні мережі часто не захищені." },
            { q: "Де найкраще зберігати складні паролі?", options: ["У блокноті на столі", "В менеджері паролів", "В текстовому файлі на робочому столі", "Не треба їх зберігати"], correct: 1, exp: "Менеджери паролів надійно шифрують твої дані." },
            { q: "Як називається крадіжка особистих даних в інтернеті?", options: ["Хобі", "Кіберзлочинність", "Анонімність", "Серфінг"], correct: 1, exp: "Це серйозне правопорушення." },
            { q: "Що робити, якщо ти підозрюєш злом свого акаунта?", options: ["Нічого", "Негайно змінити пароль та вийти з усіх пристроїв", "Видалити акаунт", "Написати пост про це"], correct: 1, exp: "Швидка реакція рятує дані." }
        ]
    },
    'social': {
        title: "Соціальні мережі",
        icon: "📱",
        quiz: [
            { q: "Що таке 'інформаційна бульбашка'?", options: ["Спеціальний чат", "Ситуація, коли алгоритми показують нам тільки близькі нам погляди", "Сенсаційна новина", "Фільтр у Instagram"], correct: 1, exp: "Ми перестаємо бачити альтернативні думки." },
            { q: "Для чого існують 'ферми ботів'?", options: ["Для гри у ферму", "Для імітації масової підтримки певної думки", "Для вирощування AI", "Для допомоги користувачам"], correct: 1, exp: "Боти створюють ілюзію більшості." },
            { q: "Що таке 'цифровий слід'?", options: ["Відбиток пальця на екрані", "Вся інформація про тебе, що є в мережі", "Швидкість інтернету", "Марка мобільного телефону"], correct: 1, exp: "Все, що ти лайкав, писав або постив." },
            { q: "Хто такий 'інтернет-троль'?", options: ["Казковий персонаж", "Користувач, який навмисно провокує конфлікти та агресію", "Програміст", "Власник сайту"], correct: 1, exp: "Мета троля — вивести тебе з рівноваги." },
            { q: "Яка головна мета алгоритмів TikTok або Instagram?", options: ["Навчати нас", "Утримувати нашу увагу якомога довше", "Робити нас щасливими", "Економити заряд батареї"], correct: 1, exp: "Твоя увага — це товар для рекламодавців." },
            { q: "Чи варто постити фото посадкового талона на літак?", options: ["Так, всі мають знати про відпочинок", "Ні, там є штрих-код з твоїми особистими даними", "Тільки якщо літак красивий", "Тільки в сторіз"], correct: 1, exp: "Коди на квитках містять паспортні дані та деталі бронювання." },
            { q: "Як перевірити, чи акаунт популярного блогера справжній?", options: ["Подивитися на кількість лайків", "Перевірити синю галочку та дату створення", "Повірити на слово", "Запитати в коментарях"], correct: 1, exp: "Верифікація допомагає відрізнити оригінал від фейку." },
            { q: "Чому не варто вступати в суперечки з тролями?", options: ["Ти програєш", "Це лише дає їм енергію (Feeding the troll)", "Вони знають, де ти живеш", "Це заборонено правилами"], correct: 1, exp: "Ігнорування — найкраща зброя проти тролінгу." }
        ]
    }
};

// --- DOM ---
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('themeToggle');
const progCount = document.getElementById('progCount');
const sidebarProgressFill = document.getElementById('sidebarProgressFill');
const badgeNum = document.getElementById('badgeNum');

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    checkSavedTheme();
    updateGlobalProgress();

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 840 && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
            sidebar.classList.remove('open');
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    // Intersection Observer for sidebar highlights
    setupScrollSpy();
});

// --- Scroll helpers ---

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 840) sidebar.classList.remove('open');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth <= 840) sidebar.classList.remove('open');
}

function scrollToLeaf(branchId, leafIndex) {
    const el = document.getElementById(`leaf-${branchId}-${leafIndex}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth <= 840) sidebar.classList.remove('open');
}

function scrollToQuiz(branchId) {
    const el = document.getElementById(`quiz-${branchId}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth <= 840) sidebar.classList.remove('open');
}

// --- Scroll Spy (highlight active section in sidebar) ---
function setupScrollSpy() {
    const sections = ['fakedragon', 'critical', 'security', 'social', 'guides'];
    const observers = [];

    sections.forEach(id => {
        const el = document.getElementById(`section-${id}`);
        if (!el) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navItem = document.querySelector(`#nav-${id} .branch-item`);
                if (!navItem) return;
                if (entry.isIntersecting) {
                    // Remove active from all
                    document.querySelectorAll('.branch-item').forEach(b => b.classList.remove('active-section'));
                    navItem.classList.add('active-section');
                }
            });
        }, {
            rootMargin: `-${56 + 60}px 0px -50% 0px`,
            threshold: 0
        });

        observer.observe(el);
        observers.push(observer);
    });
}

// --- Sidebar toggle (mobile) ---
function toggleSidebar() {
    sidebar.classList.toggle('open');
}

// --- Inline Quiz Logic ---

function initQuiz(branchId) {
    const area = document.getElementById(`quiz-area-${branchId}`);
    const startBtn = document.getElementById(`start-btn-${branchId}`);

    // Initialize state
    quizState[branchId] = {
        currentIndex: 0,
        answers: [],
        finished: false
    };

    area.classList.remove('hidden');
    startBtn.style.display = 'none';

    renderInlineQuestion(branchId);
    // Scroll to quiz area
    setTimeout(() => area.scrollIntoView({ behavior: 'smooth' }), 100);
}

function renderInlineQuestion(branchId) {
    const state = quizState[branchId];
    const quiz = contentData[branchId].quiz;
    const qData = quiz[state.currentIndex];
    const area = document.getElementById(`quiz-area-${branchId}`);

    let optionsHtml = '';
    qData.options.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = state.answers[state.currentIndex] === idx;
        optionsHtml += `
            <div class="q-option ${isSelected ? 'selected' : ''}" onclick="selectInlineOption('${branchId}', ${idx})">
                <div class="opt-letter">${letter}</div>
                <div class="opt-text">${opt}</div>
            </div>
        `;
    });

    const isLast = state.currentIndex === quiz.length - 1;
    const hasAnswer = state.answers[state.currentIndex] !== undefined;

    area.innerHTML = `
        <div class="quiz-progress-bar-wrap">
            <div class="quiz-progress-fill" style="width: ${((state.currentIndex + 1) / quiz.length) * 100}%"></div>
        </div>
        <div class="quiz-counter">Питання ${state.currentIndex + 1} з ${quiz.length}</div>
        <div class="quiz-card">
            <p class="quiz-question">${qData.q}</p>
            <div class="quiz-options">${optionsHtml}</div>
        </div>
        <div class="quiz-actions">
            <button class="qbtn ghost" onclick="navInlineQuiz('${branchId}', -1)" ${state.currentIndex === 0 ? 'disabled' : ''}>← Назад</button>
            <button class="qbtn primary" id="q-next-${branchId}" onclick="navInlineQuiz('${branchId}', 1)" ${!hasAnswer ? 'disabled' : ''}>
                ${isLast ? 'Завершити' : 'Далі →'}
            </button>
        </div>
        <div class="explanation-box hidden" id="exp-box-${branchId}">
            <span class="exp-label">Пояснення</span>
            <p id="exp-text-${branchId}"></p>
        </div>
    `;
}

function selectInlineOption(branchId, idx) {
    const state = quizState[branchId];
    state.answers[state.currentIndex] = idx;

    // Re-render to reflect selection
    renderInlineQuestion(branchId);
}

function navInlineQuiz(branchId, dir) {
    const state = quizState[branchId];
    const quiz = contentData[branchId].quiz;

    if (dir === 1 && state.currentIndex === quiz.length - 1) {
        finishInlineQuiz(branchId);
        return;
    }

    state.currentIndex += dir;
    if (state.currentIndex < 0) state.currentIndex = 0;
    renderInlineQuestion(branchId);
}

function finishInlineQuiz(branchId) {
    const state = quizState[branchId];
    const quiz = contentData[branchId].quiz;
    const area = document.getElementById(`quiz-area-${branchId}`);

    let score = 0;
    let breakdownHtml = '';

    state.answers.forEach((ans, idx) => {
        const isCorrect = ans === quiz[idx].correct;
        if (isCorrect) score++;
        breakdownHtml += `
            <div class="breakdown-item">
                <div class="bd-num ${isCorrect ? 'correct' : 'wrong'}">${idx + 1}</div>
                <div class="bd-text">${quiz[idx].q}</div>
            </div>
        `;
    });

    const percent = (score / quiz.length) * 100;
    let emoji = "🥉", title = "Непогано!", msg = "Варто ще раз переглянути матеріали цієї теми.";
    if (percent === 100) { emoji = "🏆"; title = "Ідеально!"; msg = "Ти справжній експерт у цій темі!"; }
    else if (percent >= 75) { emoji = "🥇"; title = "Відмінно!"; msg = "Чудовий результат, ти добре засвоїв матеріал."; }
    else if (percent >= 50) { emoji = "🥈"; title = "Добре!"; msg = "Ти орієнтуєшся в темі, але є куди рости."; }

    area.innerHTML = `
        <div class="result-card">
            <div class="result-emoji">${emoji}</div>
            <h2 class="result-title">${title}</h2>
            <div class="result-score">${score} / ${quiz.length}</div>
            <p class="result-msg">${msg}</p>
            <div class="result-breakdown">${breakdownHtml}</div>
            <div class="result-actions">
                <button class="qbtn ghost" onclick="initQuiz('${branchId}')">Пройти ще раз</button>
            </div>
        </div>
    `;

    if (percent >= 70) {
        saveQuizProgress(branchId);
    }
}

// --- Progress ---
function saveQuizProgress(branchId) {
    completedQuizzes[branchId] = true;
    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    updateGlobalProgress();
}

function updateGlobalProgress() {
    const total = Object.keys(contentData).length;
    const done = Object.keys(completedQuizzes).length;

    progCount.textContent = `${done} / ${total}`;
    sidebarProgressFill.style.width = `${(done / total) * 100}%`;
    badgeNum.textContent = done;

    // Mark quiz leaves as done in sidebar
    for (let branchId in contentData) {
        const leaf = document.querySelector(`#nav-${branchId} .quiz-leaf`);
        if (leaf && completedQuizzes[branchId]) {
            leaf.classList.add('done');
            leaf.textContent = "🏆 Тест пройдено";
        }
        // Also update quiz start button
        const startBtn = document.getElementById(`start-btn-${branchId}`);
        if (startBtn && completedQuizzes[branchId]) {
            startBtn.classList.add('done');
            startBtn.textContent = "Пройти ще раз";
        }
    }
}

// --- Theme ---
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('hubTheme', isDark ? 'dark' : 'light');
}

function checkSavedTheme() {
    if (localStorage.getItem('hubTheme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}
