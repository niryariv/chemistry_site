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

document.addEventListener('DOMContentLoaded', () => {
    updateNavHighlights(getCurrentModuleId());
    const quizForms = document.querySelectorAll('form.quiz[id^="quiz-"]');
    quizForms.forEach((form) => {
        const moduleId = form.id.replace('quiz-', '');
        updateQuizUI(moduleId);
    });
});
