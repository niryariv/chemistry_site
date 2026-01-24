// קובץ JavaScript לניהול קוויזים באתר הכימיה

// מפתחות התשובות הנכונות לכל מודול. כל שאלה מסומנת כ- q1, q2 וכד׳.
const quizAnswers = {
    'module1': {
        'q1': 'b', // מצב צבירה של גז
        'q2': 'c', // התנהגות מולקולות במוצק
        'q3': 'a'  // שינויי טמפרטורה ומצב צבירה
    },
    'module2': {
        'q1': 'a', // התכה
        'q2': 'a', // טמפרטורה בעת רתיחה נשארת קבועה כי האנרגיה שוברת כוחות בין מולקולות
        'q3': 'b'  // המעבר מגז לנוזל הוא עיבוי
    },
    'module3': {
        'q1': 'c', // צפיפות
        'q2': 'a', // מדידת נפח בעקירה
        'q3': 'b'  // קשת בנוזל – שכבות בגלל צפיפות שונה
    },
    'module4': {
        'q1': 'a', // פרוטון
        'q2': 'c', // מיקום אלקטרונים
        'q3': 'b'  // מטענים מנוגדים
    },
    'module5': {
        'q1': 'd', // מהו יסוד
        'q2': 'b', // מספר אטומי
        'q3': 'c'  // איזוטופים
    },
    'module6': {
        'q1': 'b', // קוטביות מים – החמצן מושך את האלקטרונים חזק יותר
        'q2': 'b', // החמצן חלקית שלילי והמימנים חלקית חיוביים
        'q3': 'd'  // משיכה בין מולקולות ומתח פנים
    },
    'module7': {
        'q1': 'c', // שינוי כימי
        'q2': 'c', // בעירת נר – פרפין וחמצן יוצרים CO2 ומים
        'q3': 'c'  // גז בתגובה חומץ‑סודה הוא פחמן דו‑חמצני
    },
    'module8': {
        'q1': 'b', // גורמים המשפיעים על קצב תגובה
        'q2': 'a', // השפעת קטליזטור
        'q3': 'b'  // קטליזטור – מאיץ תגובה ואינו נצרך
    },
    'module9': {
        'q1': 'a', // חומצה מוסרת יוני מימן
        'q2': 'c', // ערך pH ניטרלי הוא 7
        'q3': 'a'  // חומצה ובסיס יוצרים מים ומלח
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
}