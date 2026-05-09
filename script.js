document.addEventListener('DOMContentLoaded', () => {
    const allQuestions = [
        { category: "Космос",    question: "Яка планета найближча до Сонця?", answers: ["Венера", "Марс", "Меркурій", "Земля"], correct: 2 },
        { category: "Біологія",  question: "Яка найменша кістка в тілі людини?", answers: ["Стремінце", "Ребро", "Лопатка", "Стегнова"], correct: 0 },
        { category: "Географія", question: "Яка країна має найбільше населення у світі?", answers: ["США", "Китай", "Бразилія", "Індія"], correct: 3 },
        { category: "Хімія",     question: "Який елемент має хімічний символ Au?", answers: ["Срібло", "Золото", "Мідь", "Алюміній"], correct: 1 },
        { category: "Природа",   question: "Яка тварина є символом Австралії?", answers: ["Кенгуру", "Тигр", "Слон", "Ведмідь"], correct: 0 },
        { category: "Географія", question: "Яка столиця Канади?", answers: ["Торонто", "Ванкувер", "Оттава", "Монреаль"], correct: 2 },
        { category: "Природа",   question: "Яка найглибша точка Світового океану?", answers: ["Маріанська западина", "Бермудський трикутник", "Червоне море", "Філіппінський жолоб"], correct: 0 },
        { category: "Історія",   question: "У якому році почалась Друга світова війна?", answers: ["1945", "1941", "1939", "1914"], correct: 2 },
        { category: "Природа",   question: "Який найшвидший наземний тваринний вид?", answers: ["Кінь", "Вовк", "Лев", "Гепард"], correct: 3 },
        { category: "Географія", question: "Скільки континентів на Землі?", answers: ["8", "7", "6", "5"], correct: 1 },
        { category: "IT",        question: "Хто вважається першим програмістом у світі?", answers: ["Алан Тюрінг", "Ада Лавлейс", "Стів Джобс", "Білл Гейтс"], correct: 1 },
        { category: "IT",        question: "Що означає абревіатура HTML?", answers: ["Hyper Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup"], correct: 1 },
        { category: "Космос",    question: "Скільки часу світло від Сонця йде до Землі?", answers: ["8 хвилин", "1 секунду", "1 годину", "24 години"], correct: 0 },
        { category: "Мистецтво", question: "Хто намалював 'Мону Лізу'?", answers: ["Пікассо", "Ван Гог", "Леонардо да Вінчі", "Мікеланджело"], correct: 2 },
        { category: "Історія",   question: "У якому році Україна здобула незалежність?", answers: ["1989", "1991", "1993", "1996"], correct: 1 },
        { category: "Хімія",     question: "Яка єдина рідка металева речовина за кімнатної температури?", answers: ["Залізо", "Ртуть", "Свинець", "Цинк"], correct: 1 },
        { category: "Біологія",  question: "Скільки сердець у восьминога?", answers: ["1", "2", "3", "4"], correct: 2 },
        { category: "Математика",question: "Чому дорівнює число π з точністю до 2 знаків?", answers: ["3.12", "3.14", "3.16", "3.18"], correct: 1 },
        { category: "Мова",      question: "Скільки літер в українському алфавіті?", answers: ["30", "31", "33", "35"], correct: 2 },
        { category: "IT",        question: "Який тег у HTML використовується для найбільшого заголовка?", answers: ["<h6>", "<head>", "<h1>", "<header>"], correct: 2 }
    ];

    const QUESTIONS_PER_GAME = 10;

    const startScreen = document.querySelector('#start-screen');
    const quizScreen = document.querySelector('#quiz-screen');
    const resultScreen = document.querySelector('#result-screen');
    const startBtn = document.querySelector('#start-btn');
    const restartBtn = document.querySelector('#restart-btn');
    const questionText = document.querySelector('#question-text');
    const answersContainer = document.querySelector('#answers-container');
    const timerDisplay = document.querySelector('#timer');
    const scoreDisplay = document.querySelector('#score-display');
    const resultText = document.querySelector('#result-text');
    const progressFill = document.querySelector('#progress-fill');
    const questionCounter = document.querySelector('#question-counter');
    const categoryBadge = document.querySelector('#category-badge');
    const resultEmoji = document.querySelector('#result-emoji');
    const resultMessage = document.querySelector('#result-message');
    const bestScoreText = document.querySelector('#best-score-text');

    let questions = [];
    let questionIndex = 0;
    let score = 0;
    let timer = 15;
    let interval;

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function shuffleAnswers(question) {
        const correctAnswer = question.answers[question.correct];
        const shuffledAnswers = shuffle(question.answers);
        const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);
        return { ...question, answers: shuffledAnswers, correct: newCorrectIndex };
    }

    function startTimer() {
        timer = 15;
        timerDisplay.innerText = `Час: ${timer}`;
        interval = setInterval(() => {
            timer--;
            timerDisplay.innerText = `Час: ${timer}`;
            if (timer <= 0) {
                clearInterval(interval);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        const buttons = answersContainer.querySelectorAll('.answer-btn');
        const correctIdx = questions[questionIndex].correct;
        if (buttons[correctIdx]) buttons[correctIdx].classList.add('correct');
        disableButtons();
        setTimeout(nextQuestion, 1500);
    }

    function showQuestion(question) {
        clearInterval(interval);
        startTimer();

        const progress = (questionIndex / QUESTIONS_PER_GAME) * 100;
        progressFill.style.width = `${progress}%`;
        questionCounter.innerText = `${questionIndex + 1} / ${QUESTIONS_PER_GAME}`;
        categoryBadge.innerText = question.category;
        questionText.innerText = question.question;

        answersContainer.innerHTML = '';
        question.answers.forEach((answer, i) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => checkAnswer(button, i));
            answersContainer.appendChild(button);
        });
    }

    function checkAnswer(button, i) {
        clearInterval(interval);
        const correctIdx = questions[questionIndex].correct;

        if (i === correctIdx) {
            score++;
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
            const buttons = answersContainer.querySelectorAll('.answer-btn');
            if (buttons[correctIdx]) buttons[correctIdx].classList.add('correct');
        }

        scoreDisplay.innerText = `Бали: ${score}`;
        disableButtons();
        setTimeout(nextQuestion, 1500);
    }

    function disableButtons() {
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = true);
    }

    function nextQuestion() {
        questionIndex++;
        if (questionIndex < QUESTIONS_PER_GAME) {
            showQuestion(questions[questionIndex]);
        } else {
            showResult();
        }
    }

    function showResult() {
        clearInterval(interval);
        progressFill.style.width = '100%';
        quizScreen.classList.add('hide');
        resultScreen.classList.remove('hide');

        resultText.innerText = `Твій результат: ${score} з ${QUESTIONS_PER_GAME}`;

        let emoji, message;
        if (score === 10)      { emoji = "🏆"; message = "Ідеально! Ти геній!"; }
        else if (score >= 8)   { emoji = "🌟"; message = "Чудовий результат!"; }
        else if (score >= 5)   { emoji = "👍"; message = "Непогано, є куди рости!"; }
        else                   { emoji = "😅"; message = "Час трохи підучитися!"; }

        resultEmoji.innerText = emoji;
        resultMessage.innerText = message;


        const oldBest = Number(localStorage.getItem('quizBestScore') || 0);
        if (score > oldBest) {
            localStorage.setItem('quizBestScore', score);
            bestScoreText.innerText = `🎉 Новий рекорд: ${score} / ${QUESTIONS_PER_GAME}!`;
            bestScoreText.classList.remove('hide');
        } else if (oldBest > 0) {
            bestScoreText.innerText = `🏆 Твій рекорд: ${oldBest} / ${QUESTIONS_PER_GAME}`;
            bestScoreText.classList.remove('hide');
        } else {
            bestScoreText.classList.add('hide');
        }
    }

    function startGame() {
        clearInterval(interval);
        questionIndex = 0;
        score = 0;

        scoreDisplay.innerText = `Бали: 0`;
        questionCounter.innerText = `1 / ${QUESTIONS_PER_GAME}`;
        progressFill.style.width = '0%';
        resultText.innerText = '';
        resultEmoji.innerText = '';
        resultMessage.innerText = '';
       
        bestScoreText.classList.add('hide');

        questions = shuffle(allQuestions)
            .slice(0, QUESTIONS_PER_GAME)
            .map(shuffleAnswers);

        startScreen.classList.add('hide');
        resultScreen.classList.add('hide');
        quizScreen.classList.remove('hide');

        showQuestion(questions[questionIndex]);
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});
