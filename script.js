let allQuestions = {};
let questions = [];
let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersDiv = document.querySelector(".answers");
const topicTitle = document.getElementById("topicName");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const explanationBox = document.getElementById("explanationBox");

/* ======================
   LOAD JSON
====================== */
fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        allQuestions = data;
        renderTopics(Object.keys(data));
    });

/* ======================
   RENDER TOPIC
====================== */
function renderTopics(topics) {
    const sidebar = document.getElementById("topicList");
    sidebar.innerHTML = "";

    topics.forEach(topic => {
        const btn = document.createElement("button");
        btn.innerText = topic;
        btn.onclick = () => startTopic(topic);
        sidebar.appendChild(btn);
    });
}

/* ======================
   START TOPIC
====================== */
function startTopic(topic) {
    topicTitle.innerText = topic;

    score = 0;
    scoreEl.innerText = score;

    questions = [...allQuestions[topic]];
    shuffleArray(questions);

    current = 0;
    loadQuestion();
}

/* ======================
   LOAD QUESTION
====================== */
function loadQuestion() {
    if (current >= questions.length) {
        questionEl.innerText = "🎉 Finished!";
        answersDiv.innerHTML = "";
        nextBtn.style.display = "none";

        explanationBox.style.display = "block";
        explanationBox.className = "";
        explanationBox.innerHTML = `🏆 Final score: <b>${score}</b>`;
        return;
    }

    const q = questions[current];

    questionEl.innerText = q.question;
    answersDiv.innerHTML = "";

    // Reset explanation
    explanationBox.style.display = "none";
    explanationBox.innerHTML = "";
    explanationBox.className = "";

    const shuffledOptions = [...q.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(btn, opt);
        answersDiv.appendChild(btn);
    });

    nextBtn.style.display = "none";
}

/* ======================
   CHECK ANSWER + EXPLANATION
====================== */
function checkAnswer(button, selected) {
    const q = questions[current];
    const correct = q.answer;
    const buttons = document.querySelectorAll(".answers button");

    buttons.forEach(b => b.disabled = true);

    explanationBox.style.display = "block";

    if (selected === correct) {
        button.classList.add("correct");

        score += 10;
        scoreEl.innerText = score;

        explanationBox.classList.add("correct");
        explanationBox.innerHTML =
            `<b>Correct.</b><br>${q.explanation.correct}`;

    } else {
        button.classList.add("wrong");

        buttons.forEach(b => {
            if (b.innerText === correct) {
                b.classList.add("correct");
            }
        });

        explanationBox.classList.add("wrong");
        explanationBox.innerHTML =
            `<b>Wrong.</b><br>
             <b>Correct answer:</b> ${correct}<br><br>
             ${q.explanation.wrong[selected]}`;
    }

    nextBtn.style.display = "inline-block";
}

/* ======================
   NEXT QUESTION
====================== */
nextBtn.onclick = () => {
    current++;
    loadQuestion();
};

/* ======================
   SHUFFLE
====================== */
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
