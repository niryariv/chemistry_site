// קובץ JavaScript לניהול קוויזים באתר הכימיה

// מפתחות התשובות הנכונות לכל מודול. כל שאלה מסומנת כ- q1, q2 וכד׳.
const quizAnswers = {
    'module1': {
        'q1': 'b', // מצב צבירה של גז
        'q2': 'c', // התנהגות מולקולות במוצק
        'q3': 'a', // שינויי טמפרטורה ומצב צבירה
        'q4': 'b', // הגדרת חומר
        'q5': 'b'  // השפעת טמפרטורה על תנועת חלקיקים
    },
    'module2': {
        'q1': 'a', // התכה
        'q2': 'a', // טמפרטורה בעת רתיחה נשארת קבועה כי האנרגיה שוברת כוחות בין מולקולות
        'q3': 'b', // המעבר מגז לנוזל הוא עיבוי
        'q4': 'a', // מעבר מנוזל למוצק הוא קפיאה
        'q5': 'a'  // אנרגיה מושקעת בכוחות משיכה
    },
    'module3': {
        'q1': 'c', // צפיפות
        'q2': 'a', // מדידת נפח בעקירה
        'q3': 'b', // קשת בנוזל – שכבות בגלל צפיפות שונה
        'q4': 'b', // גוף צפיפות נמוכה יצוף
        'q5': 'c'  // נפח גדל => צפיפות קטנה
    },
    'module4': {
        'q1': 'a', // פרוטון
        'q2': 'c', // מיקום אלקטרונים
        'q3': 'b', // מטענים מנוגדים
        'q4': 'c', // נויטרון נייטרלי
        'q5': 'a'  // איבוד אלקטרון יוצר יון חיובי
    },
    'module5': {
        'q1': 'd', // מהו יסוד
        'q2': 'b', // מספר אטומי
        'q3': 'c', // איזוטופים
        'q4': 'a', // עמודה אנכית היא קבוצה
        'q5': 'b'  // תכונות דומות באותה קבוצה
    },
    'module6': {
        'q1': 'b', // קוטביות מים – החמצן מושך את האלקטרונים חזק יותר
        'q2': 'b', // החמצן חלקית שלילי והמימנים חלקית חיוביים
        'q3': 'd', // משיכה בין מולקולות ומתח פנים
        'q4': 'a', // מתיחות פנים מקשרי מימן
        'q5': 'b'  // מים קוטביים ממיסים יונים
    },
    'module7': {
        'q1': 'c', // שינוי כימי
        'q2': 'c', // בעירת נר – פרפין וחמצן יוצרים CO2 ומים
        'q3': 'c', // גז בתגובה חומץ‑סודה הוא פחמן דו‑חמצני
        'q4': 'b', // יצירת גז או בועות
        'q5': 'a'  // שימור מספר האטומים במשוואה מאוזנת
    },
    'module8': {
        'q1': 'b', // גורמים המשפיעים על קצב תגובה
        'q2': 'a', // השפעת קטליזטור
        'q3': 'b', // קטליזטור – מאיץ תגובה ואינו נצרך
        'q4': 'b', // ריכוז גבוה מאיץ תגובה
        'q5': 'b'  // שטח פנים גדול מאיץ תגובה
    },
    'module9': {
        'q1': 'a', // חומצה מוסרת יוני מימן
        'q2': 'c', // ערך pH ניטרלי הוא 7
        'q3': 'a', // חומצה ובסיס יוצרים מים ומלח
        'q4': 'b', // pH נמוך חומצי
        'q5': 'b'  // כרוב סגול בבסיס כחול-ירוק
    }
};

const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 5 * 60 * 1000;
const COMPLETED_MODULES_COOKIE = 'completedModules';

function getCookieValue(name) {
    if (!document.cookie) {
        return '';
    }
    const cookies = document.cookie.split('; ').map((cookie) => cookie.split('='));
    for (const [key, value] of cookies) {
        if (key === name) {
            return decodeURIComponent(value || '');
        }
    }
    return '';
}

function setCookieValue(name, value, days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getCompletedModules() {
    const raw = getCookieValue(COMPLETED_MODULES_COOKIE);
    if (!raw) {
        return new Set();
    }
    return new Set(raw.split(',').map((item) => item.trim()).filter(Boolean));
}

function saveCompletedModules(completedModules) {
    setCookieValue(COMPLETED_MODULES_COOKIE, Array.from(completedModules).join(','), 365);
}

function getCurrentModuleId() {
    const match = window.location.pathname.match(/(module\\d+)\\.html$/);
    return match ? match[1] : '';
}

function updateNavHighlights(currentModuleId) {
    const completedModules = getCompletedModules();
    document.querySelectorAll('nav a[data-module]').forEach((link) => {
        const moduleId = link.dataset.module;
        link.classList.toggle('is-active', Boolean(currentModuleId) && moduleId === currentModuleId);
        link.classList.toggle('is-completed', completedModules.has(moduleId));
    });
}

function markModuleCompleted(moduleId) {
    const completedModules = getCompletedModules();
    if (!completedModules.has(moduleId)) {
        completedModules.add(moduleId);
        saveCompletedModules(completedModules);
    }
    updateNavHighlights(getCurrentModuleId());
}

function getAttemptStorageKey(moduleId) {
    return `quizAttempts:${moduleId}`;
}

function loadAttemptData(moduleId) {
    const raw = localStorage.getItem(getAttemptStorageKey(moduleId));
    if (!raw) {
        return { count: 0, lastAttempt: 0 };
    }
    try {
        const parsed = JSON.parse(raw);
        return {
            count: Number(parsed.count) || 0,
            lastAttempt: Number(parsed.lastAttempt) || 0
        };
    } catch (error) {
        return { count: 0, lastAttempt: 0 };
    }
}

function saveAttemptData(moduleId, data) {
    localStorage.setItem(getAttemptStorageKey(moduleId), JSON.stringify(data));
}

function formatCooldownTime(ms) {
    if (ms <= 0) {
        return '';
    }
    const minutes = Math.ceil(ms / 60000);
    if (minutes <= 1) {
        const seconds = Math.max(1, Math.ceil(ms / 1000));
        return `${seconds} שניות`;
    }
    return `${minutes} דקות`;
}

function getTimeRemaining(data) {
    if (data.count < MAX_ATTEMPTS) {
        return 0;
    }
    return Math.max(0, COOLDOWN_MS - (Date.now() - data.lastAttempt));
}

function updateQuizUI(moduleId) {
    const data = loadAttemptData(moduleId);
    const timeRemaining = getTimeRemaining(data);
    const quizForm = document.getElementById(`quiz-${moduleId}`);
    if (!quizForm) {
        return;
    }
    const button = quizForm.querySelector('button');
    const counter = document.getElementById(`attempt-counter-${moduleId}`);
    const resultDiv = document.getElementById(`result-${moduleId}`);
    if (timeRemaining <= 0 && data.count >= MAX_ATTEMPTS) {
        data.count = 0;
        data.lastAttempt = 0;
        saveAttemptData(moduleId, data);
    }
    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - data.count);
    if (button) {
        button.disabled = timeRemaining > 0;
    }
    if (counter) {
        counter.textContent = `ניסיונות שנותרו: ${remainingAttempts}`;
    }
    if (resultDiv && timeRemaining > 0) {
        resultDiv.textContent = `הגעת למספר הניסיונות המקסימלי. ניתן לנסות שוב בעוד ${formatCooldownTime(timeRemaining)}.`;
    }
}

function canAttemptQuiz(moduleId) {
    const data = loadAttemptData(moduleId);
    const timeRemaining = getTimeRemaining(data);
    if (timeRemaining > 0) {
        return { allowed: false, data, timeRemaining };
    }
    if (data.count >= MAX_ATTEMPTS) {
        data.count = 0;
        data.lastAttempt = 0;
        saveAttemptData(moduleId, data);
    }
    return { allowed: true, data, timeRemaining: 0 };
}

// פונקציה לבדיקה ולהצגת תוצאות הקוויז
function checkQuiz(moduleId) {
    const quizForm = document.getElementById('quiz-' + moduleId);
    const resultDiv = document.getElementById('result-' + moduleId);
    if (!quizForm || !resultDiv) {
        return;
    }
    const attemptStatus = canAttemptQuiz(moduleId);
    if (!attemptStatus.allowed) {
        resultDiv.textContent = `הגעת למספר הניסיונות המקסימלי. ניתן לנסות שוב בעוד ${formatCooldownTime(attemptStatus.timeRemaining)}.`;
        updateQuizUI(moduleId);
        return;
    }
    const answers = quizAnswers[moduleId];
    let score = 0;
    let total = 0;
    for (const key in answers) {
        total++;
        const radios = quizForm.querySelectorAll(`input[name="${key}"]`);
        for (const radio of radios) {
            if (radio.checked && radio.value === answers[key]) {
                score++;
                break;
            }
        }
    }
    const data = attemptStatus.data;
    data.count += 1;
    data.lastAttempt = Date.now();
    saveAttemptData(moduleId, data);
    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - data.count);
    if (remainingAttempts === 0) {
        resultDiv.textContent = `תוצאה: ${score} מתוך ${total}. הגעת למספר הניסיונות המקסימלי. ניתן לנסות שוב בעוד ${formatCooldownTime(COOLDOWN_MS)}.`;
    } else {
        resultDiv.textContent = `תוצאה: ${score} מתוך ${total}. ניסיונות שנותרו: ${remainingAttempts}.`;
    }
    markModuleCompleted(moduleId);
    updateQuizUI(moduleId);
}

const elementData = [
    { number: 1, symbol: 'H', name: 'מימן' },
    { number: 2, symbol: 'He', name: 'הליום' },
    { number: 3, symbol: 'Li', name: 'ליתיום' },
    { number: 4, symbol: 'Be', name: 'בריליום' },
    { number: 5, symbol: 'B', name: 'בורון' },
    { number: 6, symbol: 'C', name: 'פחמן' },
    { number: 7, symbol: 'N', name: 'חנקן' },
    { number: 8, symbol: 'O', name: 'חמצן' },
    { number: 9, symbol: 'F', name: 'פלואור' },
    { number: 10, symbol: 'Ne', name: 'ניאון' },
    { number: 11, symbol: 'Na', name: 'נתרן' },
    { number: 12, symbol: 'Mg', name: 'מגנזיום' },
    { number: 13, symbol: 'Al', name: 'אלומיניום' },
    { number: 14, symbol: 'Si', name: 'צורן' },
    { number: 15, symbol: 'P', name: 'זרחן' },
    { number: 16, symbol: 'S', name: 'גופרית' },
    { number: 17, symbol: 'Cl', name: 'כלור' },
    { number: 18, symbol: 'Ar', name: 'ארגון' },
    { number: 19, symbol: 'K', name: 'אשלגן' },
    { number: 20, symbol: 'Ca', name: 'סידן' },
    { number: 21, symbol: 'Sc', name: 'סקנדיום' },
    { number: 22, symbol: 'Ti', name: 'טיטניום' },
    { number: 23, symbol: 'V', name: 'ונדיום' },
    { number: 24, symbol: 'Cr', name: 'כרום' },
    { number: 25, symbol: 'Mn', name: 'מנגן' },
    { number: 26, symbol: 'Fe', name: 'ברזל' },
    { number: 27, symbol: 'Co', name: 'קובלט' },
    { number: 28, symbol: 'Ni', name: 'ניקל' },
    { number: 29, symbol: 'Cu', name: 'נחושת' },
    { number: 30, symbol: 'Zn', name: 'אבץ' },
    { number: 31, symbol: 'Ga', name: 'גליום' },
    { number: 32, symbol: 'Ge', name: 'גרמניום' },
    { number: 33, symbol: 'As', name: 'ארסן' },
    { number: 34, symbol: 'Se', name: 'סלניום' },
    { number: 35, symbol: 'Br', name: 'ברום' },
    { number: 36, symbol: 'Kr', name: 'קריפטון' },
    { number: 37, symbol: 'Rb', name: 'רובידיום' },
    { number: 38, symbol: 'Sr', name: 'סטרונציום' },
    { number: 39, symbol: 'Y', name: 'איטריום' },
    { number: 40, symbol: 'Zr', name: 'זרקוניום' },
    { number: 41, symbol: 'Nb', name: 'ניוביום' },
    { number: 42, symbol: 'Mo', name: 'מוליבדן' },
    { number: 43, symbol: 'Tc', name: 'טכנציום' },
    { number: 44, symbol: 'Ru', name: 'רותניום' },
    { number: 45, symbol: 'Rh', name: 'רודיום' },
    { number: 46, symbol: 'Pd', name: 'פלדיום' },
    { number: 47, symbol: 'Ag', name: 'כסף' },
    { number: 48, symbol: 'Cd', name: 'קדמיום' },
    { number: 49, symbol: 'In', name: 'אינדיום' },
    { number: 50, symbol: 'Sn', name: 'בדיל' },
    { number: 51, symbol: 'Sb', name: 'אנטימון' },
    { number: 52, symbol: 'Te', name: 'טלור' },
    { number: 53, symbol: 'I', name: 'יוד' },
    { number: 54, symbol: 'Xe', name: 'קסנון' },
    { number: 55, symbol: 'Cs', name: 'צזיום' },
    { number: 56, symbol: 'Ba', name: 'בריום' },
    { number: 57, symbol: 'La', name: 'לנתן' },
    { number: 58, symbol: 'Ce', name: 'צריום' },
    { number: 59, symbol: 'Pr', name: 'פרסאודימיום' },
    { number: 60, symbol: 'Nd', name: 'נאודימיום' },
    { number: 61, symbol: 'Pm', name: 'פרומתיום' },
    { number: 62, symbol: 'Sm', name: 'סמריום' },
    { number: 63, symbol: 'Eu', name: 'אירופיום' },
    { number: 64, symbol: 'Gd', name: 'גדוליניום' },
    { number: 65, symbol: 'Tb', name: 'טרביום' },
    { number: 66, symbol: 'Dy', name: 'דיספרוזיום' },
    { number: 67, symbol: 'Ho', name: 'הולמיום' },
    { number: 68, symbol: 'Er', name: 'ארביום' },
    { number: 69, symbol: 'Tm', name: 'תוליום' },
    { number: 70, symbol: 'Yb', name: 'איטרביום' },
    { number: 71, symbol: 'Lu', name: 'לוטציום' },
    { number: 72, symbol: 'Hf', name: 'הפניום' },
    { number: 73, symbol: 'Ta', name: 'טנטלום' },
    { number: 74, symbol: 'W', name: 'טונגסטן' },
    { number: 75, symbol: 'Re', name: 'רניום' },
    { number: 76, symbol: 'Os', name: 'אוסמיום' },
    { number: 77, symbol: 'Ir', name: 'אירידיום' },
    { number: 78, symbol: 'Pt', name: 'פלטינה' },
    { number: 79, symbol: 'Au', name: 'זהב' },
    { number: 80, symbol: 'Hg', name: 'כספית' },
    { number: 81, symbol: 'Tl', name: 'תליום' },
    { number: 82, symbol: 'Pb', name: 'עופרת' },
    { number: 83, symbol: 'Bi', name: 'ביסמוט' },
    { number: 84, symbol: 'Po', name: 'פולוניום' },
    { number: 85, symbol: 'At', name: 'אסטטין' },
    { number: 86, symbol: 'Rn', name: 'רדון' },
    { number: 87, symbol: 'Fr', name: 'פרנסיום' },
    { number: 88, symbol: 'Ra', name: 'רדיום' },
    { number: 89, symbol: 'Ac', name: 'אקטיניום' },
    { number: 90, symbol: 'Th', name: 'תוריום' },
    { number: 91, symbol: 'Pa', name: 'פרוטאקטיניום' },
    { number: 92, symbol: 'U', name: 'אורניום' },
    { number: 93, symbol: 'Np', name: 'נפטוניום' },
    { number: 94, symbol: 'Pu', name: 'פלוטוניום' },
    { number: 95, symbol: 'Am', name: 'אמריציום' },
    { number: 96, symbol: 'Cm', name: 'קיריום' },
    { number: 97, symbol: 'Bk', name: 'ברקליום' },
    { number: 98, symbol: 'Cf', name: 'קליפורניום' },
    { number: 99, symbol: 'Es', name: 'איינשטייניום' },
    { number: 100, symbol: 'Fm', name: 'פרמיום' },
    { number: 101, symbol: 'Md', name: 'מנדלביום' },
    { number: 102, symbol: 'No', name: 'נובליום' },
    { number: 103, symbol: 'Lr', name: 'לורנציום' },
    { number: 104, symbol: 'Rf', name: 'רתרפורדיום' },
    { number: 105, symbol: 'Db', name: 'דובניום' },
    { number: 106, symbol: 'Sg', name: 'סיבורגיום' },
    { number: 107, symbol: 'Bh', name: 'בוהריום' },
    { number: 108, symbol: 'Hs', name: 'האסים' },
    { number: 109, symbol: 'Mt', name: 'מייטנריום' },
    { number: 110, symbol: 'Ds', name: 'דרמשטטיום' },
    { number: 111, symbol: 'Rg', name: 'רנטגניום' },
    { number: 112, symbol: 'Cn', name: 'קופרניקיום' },
    { number: 113, symbol: 'Nh', name: 'ניהוניום' },
    { number: 114, symbol: 'Fl', name: 'פלרוביום' },
    { number: 115, symbol: 'Mc', name: 'מוסקוביום' },
    { number: 116, symbol: 'Lv', name: 'ליברמוריום' },
    { number: 117, symbol: 'Ts', name: 'טנסין' },
    { number: 118, symbol: 'Og', name: 'אוגניסיון' }
];

const groupDefinitions = [
    { group: 1, name: 'מתכות אלקליות (מימן יוצא דופן)' },
    { group: 2, name: 'מתכות אלקליות עפרוריות' },
    { group: 3, name: 'מתכות מעבר' },
    { group: 4, name: 'מתכות מעבר' },
    { group: 5, name: 'מתכות מעבר' },
    { group: 6, name: 'מתכות מעבר' },
    { group: 7, name: 'מתכות מעבר' },
    { group: 8, name: 'מתכות מעבר' },
    { group: 9, name: 'מתכות מעבר' },
    { group: 10, name: 'מתכות מעבר' },
    { group: 11, name: 'מתכות מעבר' },
    { group: 12, name: 'מתכות מעבר' },
    { group: 13, name: 'קבוצת הבורון' },
    { group: 14, name: 'קבוצת הפחמן' },
    { group: 15, name: 'קבוצת החנקן (פניקטוגנים)' },
    { group: 16, name: 'קבוצת החמצן (כלקוגנים)' },
    { group: 17, name: 'הלוגנים' },
    { group: 18, name: 'גזים אצילים' }
];

const periodicTableLayout = [
    { label: '1', items: ['H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'He'] },
    { label: '2', items: ['Li', 'Be', '', '', '', '', '', '', '', '', '', '', 'B', 'C', 'N', 'O', 'F', 'Ne'] },
    { label: '3', items: ['Na', 'Mg', '', '', '', '', '', '', '', '', '', '', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'] },
    { label: '4', items: ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'] },
    { label: '5', items: ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'] },
    {
        label: '6',
        items: [
            'Cs', 'Ba',
            { type: 'placeholder', label: '57–71', category: 'lanthanide' },
            'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'
        ]
    },
    {
        label: '7',
        items: [
            'Fr', 'Ra',
            { type: 'placeholder', label: '89–103', category: 'actinide' },
            'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
        ]
    }
];

const lanthanideRow = {
    label: 'לנתנידים',
    items: ['', '', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', '']
};

const actinideRow = {
    label: 'אקטינידים',
    items: ['', '', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', '']
};

function getGroupDefinition(groupNumber) {
    return groupDefinitions.find((group) => group.group === groupNumber);
}

function renderGroupLegend() {
    const legend = document.getElementById('group-legend');
    if (!legend) {
        return;
    }
    legend.innerHTML = '';

    groupDefinitions.forEach((group) => {
        const item = document.createElement('div');
        item.className = `legend-item group-${group.group}`;
        item.innerHTML = `
            <span class="legend-swatch" aria-hidden="true"></span>
            <span class="legend-group-number">${group.group}</span>
            <span class="legend-group-name">${group.name}</span>
        `;
        legend.appendChild(item);
    });
}

function renderPeriodicTable() {
    const grid = document.getElementById('periodic-table-grid');
    if (!grid) {
        return;
    }
    grid.innerHTML = '';

    const elementMap = new Map(elementData.map((element) => [element.symbol, element]));
    const groups = Array.from({ length: 18 }, (_, index) => index + 1);

    const cornerLabel = document.createElement('div');
    cornerLabel.className = 'periodic-label';
    cornerLabel.textContent = 'קבוצה / תקופה';
    cornerLabel.style.gridRow = '1';
    cornerLabel.style.gridColumn = '1';
    grid.appendChild(cornerLabel);

    groups.forEach((group, index) => {
        const label = document.createElement('div');
        label.className = 'periodic-label';
        label.textContent = group;
        label.style.gridRow = '1';
        label.style.gridColumn = String(index + 2);
        grid.appendChild(label);
    });

    const buildRow = (rowData, rowIndex) => {
        const rowLabel = document.createElement('div');
        rowLabel.className = 'periodic-label';
        rowLabel.textContent = rowData.label;
        rowLabel.style.gridRow = String(rowIndex);
        rowLabel.style.gridColumn = '1';
        grid.appendChild(rowLabel);

        rowData.items.forEach((item, colIndex) => {
            const cell = document.createElement('div');
            cell.style.gridRow = String(rowIndex);
            cell.style.gridColumn = String(colIndex + 2);

            if (!item) {
                cell.className = 'element-cell empty';
                grid.appendChild(cell);
                return;
            }

            if (typeof item === 'object') {
                cell.className = 'element-cell placeholder group-3';
                cell.textContent = item.label;
                grid.appendChild(cell);
                return;
            }

            const element = elementMap.get(item);
            if (!element) {
                cell.className = 'element-cell empty';
                grid.appendChild(cell);
                return;
            }

            const groupNumber = colIndex + 1;
            const groupDefinition = getGroupDefinition(groupNumber);
            cell.className = `element-cell group-${groupNumber}`;
            cell.dataset.group = String(groupNumber);
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute(
                'aria-label',
                `${element.name} (${element.symbol}), מספר אטומי ${element.number}, קבוצה ${groupNumber}${groupDefinition ? ` (${groupDefinition.name})` : ''}, תקופה ${rowData.label}`
            );

            const number = document.createElement('span');
            number.className = 'element-number';
            number.textContent = element.number;

            const symbol = document.createElement('span');
            symbol.className = 'element-symbol';
            symbol.textContent = element.symbol;

            const name = document.createElement('span');
            name.className = 'element-name';
            name.textContent = element.name;

            cell.append(number, symbol, name);
            grid.appendChild(cell);
        });
    };

    periodicTableLayout.forEach((row, index) => buildRow(row, index + 2));
    buildRow(lanthanideRow, periodicTableLayout.length + 2);
    buildRow(actinideRow, periodicTableLayout.length + 3);
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavHighlights(getCurrentModuleId());
    const quizForms = document.querySelectorAll('form.quiz[id^="quiz-"]');
    quizForms.forEach((form) => {
        const moduleId = form.id.replace('quiz-', '');
        updateQuizUI(moduleId);
    });
    renderGroupLegend();
    renderPeriodicTable();
});
