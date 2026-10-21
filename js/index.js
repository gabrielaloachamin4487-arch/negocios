"use strict";

const quizQuestions = [
  {
    question: "¿Cuál es el objetivo principal de Business Intelligence?",
    options: [
      "Reemplazar todas las decisiones humanas por algoritmos",
      "Convertir datos en información útil para tomar decisiones",
      "Guardar la mayor cantidad posible de archivos",
      "Diseñar gráficos llamativos sin una pregunta concreta"
    ],
    answer: 1,
    explanation: "BI conecta datos, procesos y herramientas para producir información que ayude a decidir."
  },
  {
    question: "¿Qué aporta el criterio humano al analizar datos?",
    options: [
      "Contexto para interpretar la evidencia",
      "La garantía de que los datos no tienen errores",
      "Una forma de evitar definir una pregunta",
      "Un reemplazo para medir resultados"
    ],
    answer: 0,
    explanation: "Los datos aportan evidencia y las personas interpretan esa evidencia con su contexto y experiencia."
  },
  {
    question: "En ETL, ¿qué ocurre durante la transformación?",
    options: [
      "Se presentan los indicadores a los usuarios",
      "Se recopilan registros desde sus fuentes",
      "Se limpian y armonizan los datos antes de analizarlos",
      "Se eliminan los datos que contradicen una hipótesis"
    ],
    answer: 2,
    explanation: "Transformar puede incluir normalizar formatos, eliminar duplicados y unificar categorías."
  },
  {
    question: "Un equipo combina fechas de dos sedes y unifica nombres de especialidades. ¿Qué etapa es?",
    options: ["Extracción", "Transformación", "Carga", "Visualización"],
    answer: 1,
    explanation: "Armonizar fechas y categorías es parte de transformar los datos."
  },
  {
    question: "¿Qué conviene hacer antes de elegir un gráfico para un dashboard?",
    options: [
      "Definir qué pregunta se necesita responder",
      "Añadir todos los datos disponibles",
      "Elegir primero los colores de marca",
      "Ocultar los periodos con resultados distintos"
    ],
    answer: 0,
    explanation: "Una pregunta concreta permite seleccionar datos e indicadores que sí aportan a la decisión."
  }
];

const questionCounter = document.querySelector("#question-counter");
const scoreCounter = document.querySelector("#score-counter");
const progressBar = document.querySelector("#quiz-progress");
const progressTrack = document.querySelector(".quiz-progress-wrap .progress");
const questionText = document.querySelector("#question-text");
const answerOptions = document.querySelector("#answer-options");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-question");
const quizContent = document.querySelector("#quiz-content");
const resultPanel = document.querySelector("#quiz-result");

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

function renderQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
  scoreCounter.textContent = `${score} ${score === 1 ? "punto" : "puntos"}`;
  questionText.textContent = currentQuestion.question;
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
  nextButton.disabled = true;
  hasAnswered = false;

  answerOptions.replaceChildren();
  currentQuestion.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.dataset.optionIndex = String(optionIndex);
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => checkAnswer(optionIndex));
    answerOptions.append(button);
  });
}

function checkAnswer(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.answer;
  const optionButtons = answerOptions.querySelectorAll(".answer-option");

  optionButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.answer) button.classList.add("is-correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("is-wrong");
  });

  if (isCorrect) score += 1;
  feedback.textContent = `${isCorrect ? "¡Correcto!" : "No exactamente."} ${currentQuestion.explanation}`;
  feedback.classList.add(isCorrect ? "correct" : "incorrect");
  scoreCounter.textContent = `${score} ${score === 1 ? "punto" : "puntos"}`;
  nextButton.disabled = false;
  nextButton.innerHTML = currentQuestionIndex === quizQuestions.length - 1
    ? "Ver resultado <i class=\"bi bi-check2 ms-2\"></i>"
    : "Siguiente <i class=\"bi bi-arrow-right ms-2\"></i>";
}

function renderResult() {
  const percentage = Math.round((score / quizQuestions.length) * 100);
  const message = score === quizQuestions.length
    ? "¡Excelente! Tienes muy claros los fundamentos."
    : score >= 3
      ? "Buen trabajo. Ya tienes una base sólida para seguir explorando."
      : "Vuelve a los fundamentos y prueba otra vez: aprender también es iterar.";

  quizContent.classList.add("d-none");
  resultPanel.classList.remove("d-none");
  questionCounter.textContent = "Cuestionario completado";
  scoreCounter.textContent = `${score} de ${quizQuestions.length} puntos`;
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(quizQuestions.length));
  resultPanel.innerHTML = `
    <span class="section-kicker">RESULTADO FINAL · ${percentage}%</span>
    <div class="quiz-result-score">
      <div class="quiz-result-number">${score}/${quizQuestions.length}</div>
      <div><h3>${message}</h3><p>La inteligencia de negocios mejora cuando hacemos preguntas, contrastamos evidencia y aprendemos de los resultados.</p></div>
    </div>
    <button class="btn btn-ink" id="restart-quiz" type="button">Intentarlo de nuevo <i class="bi bi-arrow-repeat ms-2"></i></button>
  `;
  resultPanel.querySelector("#restart-quiz").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  progressBar.style.width = "0%";
  progressTrack.setAttribute("aria-valuenow", "0");
  quizContent.classList.remove("d-none");
  resultPanel.classList.add("d-none");
  renderQuestion();
}

nextButton.addEventListener("click", () => {
  if (!hasAnswered) return;
  currentQuestionIndex += 1;
  progressBar.style.width = `${(currentQuestionIndex / quizQuestions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestionIndex));
  if (currentQuestionIndex === quizQuestions.length) {
    renderResult();
    return;
  }
  renderQuestion();
});

renderQuestion();