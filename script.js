(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');
    let W, H, nodes, segments, animId;
    let mouse = { x: -9999, y: -9999 };
    let t = 0;
    const PAL = {
        light: ['rgba(99,102,241,','rgba(139,92,246,','rgba(6,182,212,','rgba(245,158,11,','rgba(236,72,153,'],
        dark : ['rgba(129,140,248,','rgba(167,139,250,','rgba(34,211,238,','rgba(251,191,36,','rgba(244,114,182,'],
    };
    const isDark  = () => document.body.classList.contains('dark-theme');
    const pal     = () => isDark() ? PAL.dark : PAL.light;
    const bgFill  = () => isDark() ? '#0a0f1e' : '#f4f6fb';
    const pick    = (arr) => arr[Math.floor(Math.random() * arr.length)];
    class Atom {
        constructor () { this.init(true); }
        init (scatter) {
            this.x   = Math.random() * W;
            this.y   = scatter ? Math.random() * H : (Math.random() < 0.5 ? -40 : H + 40);
            this.vx  = (Math.random() - 0.5) * 0.22;
            this.vy  = (Math.random() - 0.5) * 0.22;
            this.r   = 2.5 + Math.random() * 3.5;
            this.col = pick(pal());
            this.phase  = Math.random() * Math.PI * 2;
            this.phaseS = 0.012 + Math.random() * 0.016;
            this.arms   = Math.floor(Math.random() * 4);
            this.armAngles = Array.from({length: this.arms}, () => Math.random() * Math.PI * 2);
            this.armLen    = 18 + Math.random() * 24;
            this.armRotV   = (Math.random() - 0.5) * 0.006;
        }
        update () {
            this.x      += this.vx;
            this.y      += this.vy;
            this.phase  += this.phaseS;
            this.armAngles = this.armAngles.map(a => a + this.armRotV);
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const d  = Math.hypot(dx, dy);
            if (d < 140 && d > 0) {
                const f = (140 - d) / 140 * 0.35;
                this.vx += (dx / d) * f;
                this.vy += (dy / d) * f;
            }
            const spd = Math.hypot(this.vx, this.vy);
            if (spd > 0.8) { this.vx = this.vx / spd * 0.8; this.vy = this.vy / spd * 0.8; }
            if (this.x < -60) this.x = W + 60;
            if (this.x > W + 60) this.x = -60;
            if (this.y < -60) this.y = H + 60;
            if (this.y > H + 60) this.y = -60;
        }
        draw () {
            const pulse  = 1 + Math.sin(this.phase) * 0.25;
            const alpha  = isDark() ? 0.55 : 0.45;
            const haloA  = isDark() ? 0.12 : 0.09;
            const haloR = this.r * 4.5 * pulse;
            const grd   = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, haloR);
            grd.addColorStop(0,   this.col + haloA + ')');
            grd.addColorStop(1,   this.col + '0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, haloR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = this.col + alpha + ')';
            ctx.fill();
            if (this.arms > 0) {
                ctx.strokeStyle = this.col + (isDark() ? 0.35 : 0.28) + ')';
                ctx.lineWidth   = 1.2;
                this.armAngles.forEach(a => {
                    const tx = this.x + Math.cos(a) * this.armLen;
                    const ty = this.y + Math.sin(a) * this.armLen;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(tx, ty);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = this.col + (isDark() ? 0.5 : 0.4) + ')';
                    ctx.fill();
                });
            }
        }
    }
    class Segment {
        constructor () { this.init(); }
        init () {
            this.x    = Math.random() * W;
            this.y    = Math.random() * H;
            this.len  = 30 + Math.random() * 60;
            this.ang  = Math.random() * Math.PI * 2;
            this.vx   = (Math.random() - 0.5) * 0.15;
            this.vy   = (Math.random() - 0.5) * 0.15;
            this.rotV = (Math.random() - 0.5) * 0.004;
            this.col  = pick(pal());
            this.alpha = 0.08 + Math.random() * 0.12;
        }
        update () {
            this.x   += this.vx;
            this.y   += this.vy;
            this.ang += this.rotV;
            if (this.x < -100 || this.x > W + 100 || this.y < -100 || this.y > H + 100) this.init();
        }
        draw () {
            const x2 = this.x + Math.cos(this.ang) * this.len;
            const y2 = this.y + Math.sin(this.ang) * this.len;
            const grd = ctx.createLinearGradient(this.x, this.y, x2, y2);
            grd.addColorStop(0,   this.col + '0)');
            grd.addColorStop(0.5, this.col + this.alpha + ')');
            grd.addColorStop(1,   this.col + '0)');
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = 1.4;
            ctx.stroke();
        }
    }
    function drawNetwork () {
        const maxD = 160;
        const baseA = isDark() ? 0.18 : 0.13;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const d  = Math.hypot(dx, dy);
                if (d < maxD) {
                    const a   = baseA * (1 - d / maxD);
                    const grd = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    grd.addColorStop(0,   nodes[i].col + a + ')');
                    grd.addColorStop(1,   nodes[j].col + a + ')');
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = grd;
                    ctx.lineWidth   = 0.9;
                    ctx.stroke();
                }
            }
        }
    }
    function drawOrbs () {
        t += 0.003;
        const orbs = isDark()
            ? [{x:0.12,y:0.18,r:380,c:'rgba(129,140,248,'},{x:0.88,y:0.75,r:320,c:'rgba(167,139,250,'},{x:0.55,y:0.45,r:280,c:'rgba(34,211,238,'},{x:0.25,y:0.80,r:240,c:'rgba(251,191,36,'}]
            : [{x:0.12,y:0.18,r:380,c:'rgba(99,102,241,'},{x:0.88,y:0.75,r:320,c:'rgba(139,92,246,'},{x:0.55,y:0.45,r:280,c:'rgba(6,182,212,'},{x:0.25,y:0.80,r:240,c:'rgba(245,158,11,'}];
        const a = isDark() ? 0.11 : 0.08;
        orbs.forEach((o, i) => {
            const ox = (o.x + Math.sin(t + i * 1.4) * 0.07) * W;
            const oy = (o.y + Math.cos(t + i * 1.0) * 0.06) * H;
            const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
            g.addColorStop(0, o.c + a + ')');
            g.addColorStop(1, o.c + '0)');
            ctx.beginPath(); ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
        });
    }
    function loop () {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = bgFill();
        ctx.fillRect(0, 0, W, H);
        drawOrbs();
        segments.forEach(s => { s.update(); s.draw(); });
        drawNetwork();
        nodes.forEach(n => { n.update(); n.draw(); });
        animId = requestAnimationFrame(loop);
    }
    function init () {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        const nCount = Math.min(48, Math.floor((W * H) / 24000));
        const sCount = Math.min(20, Math.floor((W * H) / 55000));
        nodes    = Array.from({length: nCount}, () => new Atom());
        segments = Array.from({length: sCount}, () => new Segment());
    }
    function start () { init(); if (animId) cancelAnimationFrame(animId); loop(); }
    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }, { passive: true });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('touchstart', e => { if (e.touches.length) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } }, { passive: true });
    window.addEventListener('touchmove', e => { if (e.touches.length) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } }, { passive: true });
    document.addEventListener('DOMContentLoaded', start);
})();
let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '{}');
const quizState = {};
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
            { q: "Як називається пошук лише тієї інформації, що нам подобається?", options: ["Ерудиція", "Упередження підтвердження", "Оптимізм", "Критичний аналіз"], correct: 1, exp: "Ми схильні 'фільтрувати' світ под свою думку." },
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
            { q: "Що таке двофакторна автентифікація (2FA)?", options: ["Два одинакових пароля", "Додатковий код підтвердження (наприклад, з SMS або додатку)", "Вхід через Facebook", "Використання двох браузерів"], correct: 1, exp: "Це другий замок на твоїх дверях." },
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
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('themeToggle');
const progCount = document.getElementById('progCount');
const sidebarProgressFill = document.getElementById('sidebarProgressFill');
const badgeNum = document.getElementById('badgeNum');
document.addEventListener('DOMContentLoaded', () => {
    checkSavedTheme();
    updateGlobalProgress();
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 840 && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
            sidebar.classList.remove('open');
        }
    });
    themeToggle.addEventListener('click', toggleTheme);
    setupScrollSpy();
    setupScrollReveal();
});
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
function setupScrollSpy() {
    const sections = ['fakedragon', 'critical', 'security', 'social', 'guides'];
    sections.forEach(id => {
        const el = document.getElementById(`section-${id}`);
        if (!el) return;
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navItem = document.querySelector(`#nav-${id} .branch-item`);
                if (!navItem) return;
                if (entry.isIntersecting) {
                    document.querySelectorAll('.branch-item').forEach(b => b.classList.remove('active-section'));
                    navItem.classList.add('active-section');
                }
            });
        }, {
            rootMargin: `-${56 + 60}px 0px -50% 0px`,
            threshold: 0
        }).observe(el);
    });
}
function toggleSidebar() {
    sidebar.classList.toggle('open');
}
function setupScrollReveal() {
    document.querySelectorAll('.content-section').forEach((el, i) => {
        el.classList.add('anim-ready');
        el.style.transitionDelay = (i * 0.04) + 's';
    });
    document.querySelectorAll('.leaf-block').forEach((el, i) => {
        el.classList.add('anim-ready');
        el.classList.add(i % 2 === 0 ? 'anim-from-left' : 'anim-from-right');
        el.style.transitionDelay = '0s';
    });
    document.querySelectorAll('.quiz-block').forEach(el => {
        el.classList.add('anim-ready', 'anim-scale');
    });
    document.querySelectorAll('.callout').forEach(el => {
        el.classList.add('anim-ready', 'anim-from-left');
    });
    document.querySelectorAll('.example-box').forEach(el => {
        el.classList.add('anim-ready', 'anim-scale');
    });
    document.querySelectorAll('.guide-decor').forEach(el => {
        el.classList.add('anim-ready', 'anim-scale');
    });
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.contains('quiz-block') &&
                        entry.target.classList.add('is-visible');
                }, idx * 40);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.anim-ready').forEach(el => io.observe(el));
}
function initQuiz(branchId) {
    const area = document.getElementById(`quiz-area-${branchId}`);
    const startBtn = document.getElementById(`start-btn-${branchId}`);
    quizState[branchId] = {
        currentIndex: 0,
        answers: [],
        finished: false
    };
    area.classList.remove('hidden');
    startBtn.style.display = 'none';
    renderInlineQuestion(branchId);
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
    for (let branchId in contentData) {
        const leaf = document.querySelector(`#nav-${branchId} .quiz-leaf`);
        if (leaf && completedQuizzes[branchId]) {
            leaf.classList.add('done');
            leaf.textContent = "🏆 Тест пройдено";
        }
        const startBtn = document.getElementById(`start-btn-${branchId}`);
        if (startBtn && completedQuizzes[branchId]) {
            startBtn.classList.add('done');
            startBtn.textContent = "Пройти ще раз";
        }
    }
}
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('hubTheme', isDark ? 'dark' : 'light');
}
function checkSavedTheme() {
    if (localStorage.getItem('hubTheme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = imageSrc;
    modal.classList.add('show');
}
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
}
