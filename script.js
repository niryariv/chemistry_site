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

// פונקציה לבדיקה ולהצגת תוצאות הקוויז
function checkQuiz(moduleId) {
    const quizForm = document.getElementById('quiz-' + moduleId);
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
    const resultDiv = document.getElementById('result-' + moduleId);
    resultDiv.textContent = `תוצאה: ${score} מתוך ${total}`;

    const reflectionArea = quizForm.querySelector('.reflection-area');
    const reflectionInput = quizForm.querySelector('.reflection-input');
    const submitButton = quizForm.querySelector('button');
    const reflectionStatusKey = `reflection-needed-${moduleId}`;
    if (score < total) {
        if (reflectionArea) {
            reflectionArea.hidden = false;
        }
        quizForm.dataset.needsReflection = 'true';
        localStorage.setItem(reflectionStatusKey, 'true');
        const hasText = reflectionInput && reflectionInput.value.trim().length > 0;
        if (submitButton) {
            submitButton.disabled = !hasText;
        }
    } else {
        if (reflectionArea) {
            reflectionArea.hidden = true;
        }
        quizForm.dataset.needsReflection = 'false';
        localStorage.setItem(reflectionStatusKey, 'false');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const reflectionInputs = document.querySelectorAll('.reflection-input');
    reflectionInputs.forEach((input) => {
        const moduleId = input.dataset.module;
        if (!moduleId) {
            return;
        }
        const storageKey = `reflection-${moduleId}`;
        const storedValue = localStorage.getItem(storageKey);
        if (storedValue) {
            input.value = storedValue;
        }
        const form = input.closest('form');
        if (form) {
            const reflectionArea = form.querySelector('.reflection-area');
            const needsReflection = localStorage.getItem(`reflection-needed-${moduleId}`) === 'true';
            form.dataset.needsReflection = needsReflection ? 'true' : 'false';
            if (reflectionArea && needsReflection) {
                reflectionArea.hidden = false;
            }
            const button = form.querySelector('button');
            if (button && needsReflection) {
                button.disabled = input.value.trim().length === 0;
            }
        }
        input.addEventListener('input', () => {
            const trimmedValue = input.value.trim();
            localStorage.setItem(storageKey, trimmedValue);
            const form = input.closest('form');
            if (!form) {
                return;
            }
            if (form.dataset.needsReflection === 'true') {
                const button = form.querySelector('button');
                if (button) {
                    button.disabled = trimmedValue.length === 0;
                }
            }
        });
    });
});
