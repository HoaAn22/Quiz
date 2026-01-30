let questions = [];
let current = 0;

const buttons = document.querySelectorAll(".answers button");
const questionEl = document.getElementById("question");
const levelEl = document.getElementById("level");
const imgEl = document.getElementById("questionImage");
const nextBtn = document.getElementById("nextBtn");
const endScreen = document.getElementById("endScreen");

/* Fisher–Yates shuffle */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/* Load câu hỏi từ JSON */
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleArray(questions);
        loadQuestion();
    })
    .catch(err => {
        alert("Cannot load questions.json. Please run with local server.");
        console.error(err);
    });

function loadQuestion() {
    const q = questions[current];
    levelEl.textContent = "Prize: " + q.level;
    questionEl.textContent = q.text;

    if (q.image) {
        imgEl.src = q.image;
        imgEl.style.display = "block";
    } else {
        imgEl.style.display = "none";
    }

    buttons.forEach((btn, i) => {
        btn.textContent = q.answers[i];
        btn.className = "";
        btn.disabled = false;
    });

    nextBtn.style.display = "none";
}

function checkAnswer(index) {
    const correct = questions[current].correct;

    buttons[index].classList.add(
        index === correct ? "correct" : "wrong"
    );
    buttons[correct].classList.add("correct");

    buttons.forEach(btn => btn.disabled = true);
    nextBtn.style.display = "inline-block";
}

function nextQuestion() {
    current++;
    if (current < questions.length) {
        loadQuestion();
    } else {
        document.querySelector(".answers").style.display = "none";
        questionEl.style.display = "none";
        levelEl.style.display = "none";
        nextBtn.style.display = "none";
        endScreen.style.display = "block";
    }
}
