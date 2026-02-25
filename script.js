/**
 * Скіл Хаб 157 — Навчальний портал
 * Логіка навігації, контент та тести
 */

// --- Стан додатку ---
let currentBranch = null;
let currentLeafIndex = 0;
let currentQuizQuestionIndex = 0;
let userQuizAnswers = []; // Зберігає індекси обраних відповідей
let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');

// --- Дані контенту (Гілки та Теми) ---
const contentData = {
    'fakedragon': {
        title: "ФейкоДракончик",
        icon: "🐲",
        leaves: [
            {
                title: "Що таке фейк?",
                content: `
                    <p><strong>Фейк</strong> (англ. fake — підробка) — це навмисно створена неправдива інформація, яка подається як справжня новина. На відміну від помилки журналіста, фейк завжди має <strong>мету</strong>: обманути, залякати, посіяти паніку або змінити ставлення до певної події.</p>
                    <div class="callout">Головна зброя фейку — твої емоції. Якщо новина викликає у тебе гнів, сильний страх або ейфорію — зупинись і перевір її.</div>
                    <h3>Чому фейки так швидко поширюються?</h3>
                    <ul>
                        <li>Вони <strong>прості</strong> і дають легкі відповіді на складні питання.</li>
                        <li>Вони використовують <strong>емоції</strong> (клікбейтні заголовки).</li>
                        <li>Ми схильні вірити тому, що підтверджує нашу точку зору (когнітивне упередження).</li>
                    </ul>
                `
            },
            {
                title: "Як перевірити джерело",
                content: `
                    <p>Перед тим як поширити пост або повірити новині, зроби три кроки перевірки:</p>
                    <ol>
                        <li><strong>Хто автор?</strong> Перевір профіль у соцмережі або сайт. Якщо сайт називається "Super-News-24" і не має розділу "Про нас" — це підозріло.</li>
                        <li><strong>Першоджерело.</strong> Звідки взяли інформацію? Якщо посилаються на "кума знайомого депутата" — це не джерело. Шукай посилання на офіційні органи або великі міжнародні агенції (Reuters, BBC тощо).</li>
                        <li><strong>Дата.</strong> Фейкороби часто використовують старі відео або фото, видаючи їх за сьогоднішні події.</li>
                    </ol>
                    <div class="example-box">
                        <div class="ex-label">Лайфхак</div>
                        <p>Використовуй <strong>зворотний пошук зображень</strong> у Google. Це допоможе дізнатися, коли насправді було зроблено фото.</p>
                    </div>
                `
            },
            {
                title: "Deepfake та маніпуляції",
                content: `
                    <p>Технології не стоять на місці. Сьогодні за допомогою штучного інтелекту можна створити відео, де відома людина каже те, чого ніколи не говорила. Це і є <strong>Діпфейк (Deepfake)</strong>.</p>
                    <h3>Ознаки діпфейку:</h3>
                    <ul>
                        <li>Дивне кліпання очима (або його відсутність).</li>
                        <li>Незбіг рухів губ із промовою.</li>
                        <li>"Мильне" зображення навколо обличчя.</li>
                    </ul>
                    <p>Пам'ятай: навіть відео сьогодні не є 100% доказом. Завжди шукай інший підтверджений ракурс або офіційний коментар.</p>
                `
            }
        ],
        quiz: [
            {
                q: "Яка головна відмінність фейку від звичайної журналістської помилки?",
                options: ["Фейк завжди коротший", "Фейк має на меті навмисно обманути", "Помилки бувають тільки на ТБ", "У фейків немає картинок"],
                correct: 1,
                exp: "Фейк створюється цілеспрямовано для маніпуляції."
            },
            {
                q: "Ти побачив сенсаційну новину з дуже емоційним заголовком. Твої дії?",
                options: ["Швидше переслати друзям", "Написати гнівний коментар", "Зупинитися і перевірити в надійних джерелах", "Повірити, бо заголовок правдивий"],
                correct: 2,
                exp: "Емоції — перший сигнал, що тобою намагаються маніпулювати."
            },
            {
                q: "Що таке 'зворотний пошук зображень'?",
                options: ["Пошук по всьому інтернету за допомогою фото", "Зміна кольору фото", "Видалення фону", "Друк фото на папері"],
                correct: 0,
                exp: "Це допомагає знайти оригінал фото та дату його першої появи."
            },
            {
                q: "Хто зазвичай є першоджерелом надійної інформації?",
                options: ["Анонімний Telegram-канал", "Пост сусіда у Facebook", "Офіційні прес-релізи або перевірені інформагенції", "Скріншот без дати"],
                correct: 2,
                exp: "Офіційні джерела несуть відповідальність за інформацію."
            },
            {
                q: "Яка ознака може вказувати на діпфейк?",
                options: ["Людина занадто часто моргає", "Погане освітлення в кімнаті", "Незбіг міміки та звуку", "Чорно-білий колір"],
                correct: 2,
                exp: "Штучний інтелект часто допускає помилки в синхронізації губ і міміки."
            },
            {
                q: "Сайт новин не має розділу 'Про нас' та контактів редакції. Чи можна йому довіряти?",
                options: ["Так, головне новини", "Ні, прозорість — ознака якості", "Тільки якщо там багато реклами", "Тільки якщо він на першому місці в Google"],
                correct: 1,
                exp: "Відсутність контактів — ознака 'сміттярки', що поширює фейки."
            },
            {
                q: "Чи може старе відео бути частиною фейку?",
                options: ["Ні, воно ж справжнє", "Так, якщо йому приписали інший опис", "Ні, відео неможливо підробити", "Тільки якщо воно в 4К"],
                correct: 1,
                exp: "Виривання контексту — частий метод маніпуляції."
            },
            {
                q: "Тобі прислали повідомлення про 'терміновий збір грошей' від знайомого, але текст виглядає підозріло. Твої дії?",
                options: ["Швидко скинути гроші", "Перевірити, чи не зламали акаунт знайомого", "Проігнорувати і заблокувати", "Скинути пост у групу будинку"],
                correct: 1,
                exp: "Шахраї часто використовують фейкові приводи для збору коштів."
            }
        ]
    },
    'critical': {
        title: "Критичне мислення",
        icon: "🧠",
        leaves: [
            {
                title: "Когнітивні упередження",
                content: `<p>Наш мозок любить спрощувати світ. <strong>Когнітивні упередження</strong> — це ментальні пастки, які заважають нам думати об'єктивно.</p>
                <div class="callout">Найвідоміше — "упередження підтвердження". Ми шукаємо факти, які доводять нашу правоту, і ігноруємо все інше.</div>`
            },
            { title: "Логічні хиби", content: `<p>Хибна аргументація часто використовується в суперечках. Наприклад, "апеляція до авторитету" або "солом'яне опудало".</p>` },
            { title: "Аналіз аргументів", content: `<p>Як перевірити, чи аргумент сильний? Розділи його на тезу, докази та висновок.</p>` }
        ],
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
        leaves: [
            { title: "Паролі та акаунти", content: `<p>Твій пароль — це ключ від квартири. Не використовуй '123456' або дату народження.</p>` },
            { title: "Фішинг та скам", content: `<p><strong>Фішинг</strong> — це спроба виманити твої дані через підробні сайти або листи.</p>` },
            { title: "Приватність у мережі", content: `<p>Те, що потрапило в інтернет — залишається там назавжди. Налаштуй приватність у соцмережах.</p>` }
        ],
        quiz: [
            { q: "Який пароль є найнадійнішим?", options: ["admin123", "Дата народження", "Комбінація випадкових букв, цифр і символів", "Пароль123"], correct: 2, exp: "Складність — ворог хакерів." },
            { q: "Що таке двофакторна автентифікація (2FA)?", options: ["Два однакових пароля", "Додатковий код підтвердження (наприклад, з SMS або додатку)", "Вхід через Facebook", "Використання двох браузерів"], correct: 1, exp: "Це другий замок на твоїх дверях знань." },
            { q: "Тобі прийшов лист від 'банку' з проханням терміново ввести пароль на сайті. Це...", options: ["Сервіс", "Фішинг", "Удача", "Подарунок"], correct: 1, exp: "Банки ніколи не просять паролі таким чином." },
            { q: "Що в адресі сайту вказує на зашифроване з'єднання?", options: ["Яскравий логотип", "https:// та замок у браузері", "Велика кількість реклами", "Закінчення на .com"], correct: 1, exp: "HTTP<strong>S</strong> — S означає Secure." },
            { q: "Чи безпечно використовувати відкритий Wi-Fi у кафе для входу в банк?", options: ["Так, якщо там немає людей", "Ні, трафік можуть перехопити", "Так, це зручно", "Тільки з телефону"], correct: 1, exp: "Публічні мережі часто не захищені." },
            { q: "Де найкраще зберігати складні паролі?", options: ["У блокноті на столі", "В менеджері паролів", "В текстовому файлі на робочому столі", "Не треба їх зберігати"], correct: 1, exp: "Менеджери паролів надійно шифрують твої дані." },
            { q: "Як називається крадіжка особистих даних в інтернеті?", options: ["Хобі", "Кіберзлочинність", "Анонімність", "Серфінг"], correct: 1, exp: "Це серйозне правопорушення." },
            { q: "Що робити, якщо ти підозрюєш злом свого акаунта?", options: ["Нічого", "Негайно змінити пароль та вийти з усіх пристроїв", "Видалити акаунт", "Написати пост про це"], correct: 1, exp: "Швидка реакція рятує дані." }
        ]
    },
    'social': {
        title: "Соціальні мережі",
        icon: "📱",
        leaves: [
            { title: "Алгоритми та бульбашки", content: `<p>Соцмережі показують нам те, що нам подобається. Так виникає <strong>інформаційна бульбашка</strong>.</p>` },
            { title: "Маніпуляції в мережах", content: `<p>Боти, тролі та астротерфінг — як створюється ілюзія масової думки.</p>` },
            { title: "Захист репутації", content: `<p>Твій цифровий слід впливає на майбутню роботу та навчання.</p>` }
        ],
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

// --- DOM Елементи ---
const sidebar = document.getElementById('sidebar');
const treeNav = document.getElementById('treeNav');
const mainWrap = document.getElementById('mainWrap');
const homePage = document.getElementById('homePage');
const leafPage = document.getElementById('leafPage');
const quizPage = document.getElementById('quizPage');
const breadcrumb = document.getElementById('breadcrumb');
const progCount = document.getElementById('progCount');
const sidebarProgressFill = document.getElementById('sidebarProgressFill');
const badgeNum = document.getElementById('badgeNum');
const themeToggle = document.getElementById('themeToggle');

// --- Ініціалізація ---
document.addEventListener('DOMContentLoaded', () => {
    updateGlobalProgress();
    checkSavedTheme();
    // Закриваємо мобільний сайдбар при кліку поза ним на малих екранах
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 840 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
            sidebar.classList.remove('open');
        }
    });

    themeToggle.addEventListener('click', toggleTheme);
});

// --- Навігація ---

function showHome() {
    currentBranch = null;
    hideAllPages();
    homePage.classList.add('active');
    updateBreadcrumb();
    window.scrollTo(0, 0);
}

function toggleBranch(branchId) {
    const group = document.getElementById(`branch-${branchId}`);
    const isOpen = group.classList.contains('open');
    
    // Закриваємо інші, якщо треба (опціонально)
    // document.querySelectorAll('.branch-group').forEach(g => g.classList.remove('open'));
    
    if (isOpen) {
        group.classList.remove('open');
    } else {
        group.classList.add('open');
    }
}

function openLeaf(branchId, leafIndex) {
    currentBranch = branchId;
    currentLeafIndex = leafIndex;
    hideAllPages();
    leafPage.classList.add('active');
    renderLeaf();
    updateBreadcrumb();
    updateActiveLeaf();
    window.scrollTo(0, 0);
}

function openQuiz(branchId) {
    currentBranch = branchId;
    hideAllPages();
    quizPage.classList.add('active');
    showQuizStart();
    updateBreadcrumb();
    updateActiveLeaf('quiz');
    window.scrollTo(0, 0);
}

function hideAllPages() {
    homePage.classList.remove('active');
    leafPage.classList.remove('active');
    quizPage.classList.remove('active');
}

function updateBreadcrumb() {
    let html = `<span onclick="showHome()" class="bc-link">Скіл Хаб 157</span>`;
    if (currentBranch) {
        const branch = contentData[currentBranch];
        html += ` <span class="bc-sep">/</span> <span class="bc-link" onclick="toggleBranch('${currentBranch}')">${branch.title}</span>`;
        
        const isQuiz = quizPage.classList.contains('active');
        if (isQuiz) {
            html += ` <span class="bc-sep">/</span> <span class="bc-current">Тест</span>`;
        } else {
            const leaf = branch.leaves[currentLeafIndex];
            html += ` <span class="bc-sep">/</span> <span class="bc-current">${leaf.title}</span>`;
        }
    }
    breadcrumb.innerHTML = html;
}

function updateActiveLeaf(type = 'leaf') {
    document.querySelectorAll('.leaf').forEach(l => l.classList.remove('active'));
    if (currentBranch) {
        const leavesContainer = document.getElementById(`leaves-${currentBranch}`);
        if (type === 'quiz') {
            leavesContainer.querySelector('.quiz-leaf').classList.add('active');
        } else {
            const leaves = leavesContainer.querySelectorAll('.leaf:not(.quiz-leaf)');
            if (leaves[currentLeafIndex]) leaves[currentLeafIndex].classList.add('active');
        }
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function scrollToBranch() {
    if (window.innerWidth <= 840) toggleSidebar();
}

// --- Логіка Leaf (Контент) ---

function renderLeaf() {
    const branch = contentData[currentBranch];
    const leaf = branch.leaves[currentLeafIndex];
    
    document.getElementById('leafBranchTag').textContent = branch.title;
    document.getElementById('leafTitle').textContent = leaf.title;
    document.getElementById('leafContent').innerHTML = leaf.content;
    
    const prevBtn = document.getElementById('leafPrevBtn');
    const nextBtn = document.getElementById('leafNextBtn');
    
    prevBtn.disabled = currentLeafIndex === 0;
    
    if (currentLeafIndex === branch.leaves.length - 1) {
        nextBtn.textContent = "Перейти до тесту →";
        nextBtn.onclick = () => openQuiz(currentBranch);
    } else {
        nextBtn.textContent = "Наступна тема →";
        nextBtn.onclick = () => navLeaf(1);
    }
}

function navLeaf(dir) {
    const branch = contentData[currentBranch];
    const newIndex = currentLeafIndex + dir;
    if (newIndex >= 0 && newIndex < branch.leaves.length) {
        openLeaf(currentBranch, newIndex);
    }
}

function goBackFromLeaf() {
    showHome();
}

// --- Логіка Quiz (Тести) ---

function showQuizStart() {
    const branch = contentData[currentBranch];
    document.getElementById('quizBranchTag').textContent = branch.title;
    document.getElementById('qsIcon').textContent = branch.icon;
    document.getElementById('qsTitle').textContent = `Перевірка знань: ${branch.title}`;
    
    document.getElementById('quizStart').classList.remove('hidden');
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');
}

function startQuiz() {
    currentQuizQuestionIndex = 0;
    userQuizAnswers = [];
    document.getElementById('quizStart').classList.add('hidden');
    document.getElementById('quizActive').classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const quiz = contentData[currentBranch].quiz;
    const question = quiz[currentQuizQuestionIndex];
    
    document.getElementById('quizCounter').textContent = `Питання ${currentQuizQuestionIndex + 1} з ${quiz.length}`;
    document.getElementById('quizProgressFill').style.width = `${((currentQuizQuestionIndex + 1) / quiz.length) * 100}%`;
    document.getElementById('quizQuestion').textContent = question.q;
    
    let optionsHtml = '';
    question.options.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = userQuizAnswers[currentQuizQuestionIndex] === idx;
        optionsHtml += `
            <div class="q-option ${isSelected ? 'selected' : ''}" onclick="selectOption(${idx})">
                <div class="opt-letter">${letter}</div>
                <div class="opt-text">${opt}</div>
            </div>
        `;
    });
    document.getElementById('quizOptions').innerHTML = optionsHtml;
    
    const nextBtn = document.getElementById('qNextBtn');
    nextBtn.disabled = userQuizAnswers[currentQuizQuestionIndex] === undefined;
    nextBtn.textContent = currentQuizQuestionIndex === quiz.length - 1 ? "Завершити" : "Далі →";
    
    document.getElementById('explanationBox').classList.add('hidden');
}

function selectOption(idx) {
    userQuizAnswers[currentQuizQuestionIndex] = idx;
    
    // Показуємо правильна чи ні (опціонально для динаміки)
    const options = document.querySelectorAll('.q-option');
    options.forEach(o => o.classList.remove('selected'));
    options[idx].classList.add('selected');
    
    document.getElementById('qNextBtn').disabled = false;
}

function qNav(dir) {
    const quiz = contentData[currentBranch].quiz;
    if (dir === 1 && currentQuizQuestionIndex === quiz.length - 1) {
        finishQuiz();
        return;
    }
    
    currentQuizQuestionIndex += dir;
    renderQuizQuestion();
}

function finishQuiz() {
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResult').classList.remove('hidden');
    
    const quiz = contentData[currentBranch].quiz;
    let score = 0;
    let breakdownHtml = '';
    
    userQuizAnswers.forEach((ans, idx) => {
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
    let emoji = "🥉";
    let title = "Непогано!";
    let msg = "Тобі варто ще раз переглянути матеріали цієї гілки.";
    
    if (percent === 100) { emoji = "🏆"; title = "Ідеально!"; msg = "Ти справжній експерт у цій темі!"; }
    else if (percent >= 75) { emoji = "🥇"; title = "Відмінно!"; msg = "Чудовий результат, ти добре засвоїв матеріал."; }
    else if (percent >= 50) { emoji = "🥈"; title = "Добре!"; msg = "Ти орієнтуєшся в темі, але є куди рости."; }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultScore').textContent = `${score} / ${quiz.length}`;
    document.getElementById('resultMsg').textContent = msg;
    document.getElementById('resultBreakdown').innerHTML = breakdownHtml;

    if (percent >= 70) {
        saveQuizProgress(currentBranch);
    }
}

function saveQuizProgress(branchId) {
    completedQuizzes[branchId] = true;
    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    updateGlobalProgress();
}

function resetQuiz() {
    startQuiz();
}

function goBackFromQuiz() {
    openLeaf(currentBranch, 0);
}

// --- Глобальний прогрес ---

function updateGlobalProgress() {
    const total = Object.keys(contentData).length;
    const done = Object.keys(completedQuizzes).length;
    
    progCount.textContent = `${done} / ${total}`;
    sidebarProgressFill.style.width = `${(done / total) * 100}%`;
    badgeNum.textContent = done;
    
    // Помічаємо гілки як пройдені в сайдбарі
    for (let branchId in contentData) {
        const leaf = document.querySelector(`#branch-${branchId} .quiz-leaf`);
        if (completedQuizzes[branchId]) {
            leaf.classList.add('done');
            leaf.textContent = "🏆 Тест пройдено";
        }
    }
}

// --- Темна тема ---

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('hubTheme', isDark ? 'dark' : 'light');
}

function checkSavedTheme() {
    const saved = localStorage.getItem('hubTheme');
    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
    }
}
