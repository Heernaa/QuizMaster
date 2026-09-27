const NICKNAME_KEY = "quizmaster-nickname";

const nicknameForm = document.querySelector("#nickname-form");
if (nicknameForm) {
  nicknameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nickname = document.querySelector("#nickname").value.trim();
    if (!nickname) {
      document.querySelector("#nickname").focus();
      return;
    }

    sessionStorage.setItem(NICKNAME_KEY, nickname);
    window.location.href = "game.html";
  });
}

const playerName = document.querySelector("#player-name");
if (playerName) {
  playerName.textContent = sessionStorage.getItem(NICKNAME_KEY) || "Invitado";
}

const quiz = document.querySelector("#quiz");
if (quiz) startQuiz();

async function startQuiz() {
  let loaded = false;
  const loadingMessage = document.querySelector("#loading-message");
  const roundNumber = document.querySelector("#round-number");
  const resultDialog = document.querySelector("#result-dialog");
  const resultTitle = document.querySelector("#result-title");
  const resultMessage = document.querySelector("#result-message");
  const resultAction = document.querySelector("#result-action");
  let questions;
  let round = 1;
  let score = 0;
  const usedQuestions = new Set();

  try {
    const response = await fetch("../preguntas.json");
    if (!response.ok) throw new Error("No se pudo cargar preguntas.json");
    const data = await response.json();
    questions = Object.values(data.preguntas);
    if (questions.length < 4) throw new Error("Se necesitan al menos cuatro preguntas.");
    loaded = true;
    if (loaded) loadingMessage?.remove();
  } catch (error) {
    quiz.textContent = "No se pudieron cargar las preguntas. Abre el juego desde un servidor web local.";
    return;
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function renderRound() {
    roundNumber.textContent = String(round);
    const roundQuestions = shuffle(questions.filter((question) => !usedQuestions.has(question))).slice(0, 2);
    roundQuestions.forEach((question) => usedQuestions.add(question));
    const form = document.createElement("form");
    form.className = "round-form";

    roundQuestions.forEach((question, questionIndex) => {
      const card = document.createElement("section");
      card.className = "pregunta_card";
      const heading = document.createElement("div");
      heading.textContent = `Ronda ${round} · Pregunta ${questionIndex + 1}`;
      const prompt = document.createElement("div");
      prompt.textContent = question.pregunta;
      const answers = document.createElement("div");
      answers.className = "answers";

      shuffle([
        { text: question.res_correcta, correct: true },
        ...question.res_incorrectas.map((text) => ({ text, correct: false })),
      ]).forEach((answer, answerIndex) => {
        const label = document.createElement("label");
        label.className = "answer-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${questionIndex}`;
        input.value = String(answer.correct);
        input.required = true;
        const text = document.createElement("span");
        text.textContent = answer.text;
        label.append(input, text);
        answers.append(label);
      });
      card.append(heading, prompt, answers);
      form.append(card);
    });

    const submit = document.createElement("button");
    submit.className = "green_bubble submit-round";
    submit.type = "submit";
    submit.textContent = "Comprobar respuestas";
    form.append(submit);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const correctCount = roundQuestions.reduce((count, _, index) => {
        return count + (form.querySelector(`input[name="question-${index}"]:checked`)?.value === "true" ? 1 : 0);
      }, 0);
      score += correctCount;
      if (correctCount === 2 && round === 1) {
        form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
        form.classList.add("completed-round");
        submit.remove();
        resultTitle.textContent = "¡Ronda superada!";
        resultMessage.textContent = "¡Has acertado las dos! Prepárate para otras dos preguntas.";
        resultAction.textContent = "Continuar";
        resultAction.onclick = () => {
          resultDialog.close();
          round = 2;
          renderRound();
        };
      } else if (correctCount === 2) {
        resultTitle.textContent = `¡Felicidades, ${sessionStorage.getItem(NICKNAME_KEY) || "Invitado"}!`;
        resultMessage.textContent = `¡Has superado el quiz con ${score} de 4 respuestas correctas!`;
        resultAction.textContent = "Jugar de nuevo";
        resultAction.onclick = () => window.location.reload();
      } else {
        resultTitle.textContent = "¡Derrota!";
        resultMessage.textContent = `Has conseguido ${score} de 4 respuestas correctas. Necesitas acertar las dos preguntas de cada ronda.`;
        resultAction.textContent = "Intentar de nuevo";
        resultAction.onclick = () => window.location.reload();
      }
      resultDialog.showModal();
    });
    quiz.append(form);
  }

  renderRound();
}
