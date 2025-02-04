document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  updateLeaderboard();
});

let currentQuestionIndex = 0;
let score = localStorage.getItem("quizScore")
  ? parseInt(localStorage.getItem("quizScore"))
  : 0;
let questions = [];

function fetchQuestions() {
  fetch("http://localhost:3000/questions")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      questions = data;
      displayQuestions();
    })
    .catch((error) => console.error("error while fetching questions:", error));
}

function displayQuestions() {
  if (currentQuestionIndex >= questions.length) {
    alert(`quiz over! Your score is ${score}`);

    addToLeaderboard();
    window.location.reload();
    return;
  }

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const scoreElement = document.getElementById("score");

  let currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option, currentQuestion.answer);
    optionsElement.appendChild(button);
  });

  scoreElement.textContent = `Score: ${score}`;
}

function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    score += 1;
    localStorage.setItem("quizScore", score);
  }

  currentQuestionIndex++;
  displayQuestions();
}

function addToLeaderboard() {
  let playerName = prompt("enter your name for the leaderboard:");
  if (!playerName) return;

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  uptLeaderboard();
}

function updateLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardEle = document.getElementById("leaderboard");

  leaderboardEle.innerHTML = "<h2>Leaderboard</h2>";
  leaderboard.forEach((entry, index) => {
    leaderboardEle.innerHTML += `<p>${index + 1}. ${entry.name} - ${
      entry.score
    }</p>`;
  });
}

function resetGame() {
  localStorage.removeItem("quizScore");
  currentQuestionIndex = 0;
  score = 0;
  displayQuestions();
}