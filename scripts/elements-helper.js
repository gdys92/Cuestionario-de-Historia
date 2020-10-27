
class QuizElementsHelper {
  constructor(app, quizCard, questionCard, resultCard, quiz) {
    this.app = app;
    this.quiz = quiz;
    this.quizCard = quizCard;
    this.questionCard = questionCard;
    this.resultCard = resultCard;

    this.assignElements();
    this.initListeners();
    this.showQuizCard();
  }

  /**
   * encontrar los elementos internos de cada tarjeta.
   */
  assignElements() {
    this.quizCard.startBtn = this.quizCard.querySelector(
      ".quiz-details__start-btn"
    );
    this.quizCard.titleElm = this.quizCard.querySelector(
      ".quiz-details__title"
    );
    this.quizCard.descriptionElm = this.quizCard.querySelector(
      ".quiz-details__description"
    );
    this.quizCard.metaQCElm = this.quizCard.querySelector(
      ".quiz-details__meta.--qc strong"
    );
    this.quizCard.metaTimeElm = this.quizCard.querySelector(
      ".quiz-details__meta.--t strong"
    );


    this.questionCard.progressRemainingTimeElm = document.querySelector(
      ".questions-card__remaining-time"
    );
    this.questionCard.progressQuestionCountElm = document.querySelector(
      ".questions-card__q-count"
    );
    this.questionCard.progressbarElm = document.querySelector(
      ".questions-card__progress .--value"
    );
    this.questionCard.questionTitleElm = document.getElementById(
      "question-title"
    );
    this.questionCard.optionOneElm = document.querySelector(
      "#option-one ~ label"
    );
    this.questionCard.optionTwoElm = document.querySelector(
      "#option-two ~ label"
    );
    this.questionCard.optionThreeElm = document.querySelector(
      "#option-three ~ label"
    );
    this.questionCard.optionFourElm = document.querySelector(
      "#option-four ~ label"
    );
    this.questionCard.nextBtn = this.app.querySelector("#next-btn");
    this.questionCard.stopBtn = this.app.querySelector("#stop-btn");


    this.resultCard.gotoHome = this.resultCard.querySelector("#go-to-home");
    this.resultCard.scoreElm = this.resultCard.querySelector("#score");
  }

  /**
   * iniciando los requerimientos listeners de los elementos.
   */
  initListeners() {
    this.quizCard.startBtn.addEventListener(
      "click",
      this.showQuestionsCard.bind(this)
    );
    this.questionCard.nextBtn.addEventListener(
      "click",
      this.nextBtnHandler.bind(this)
    );
    this.questionCard.stopBtn.addEventListener(
      "click",
      this.stopBtnHandler.bind(this)
    );
    this.resultCard.gotoHome.addEventListener(
      "click",
      this.hideResultCard.bind(this)
    );
  }

  /**
   * Mostrar los detalles de la tarjeta del cuestionario.
   */
  showQuizCard() {
    this.quizCard.titleElm.innerText = this.quiz.title;
    this.quizCard.descriptionElm.innerText = this.quiz.description;
    this.quizCard.metaQCElm.innerText = this.quiz._questions.length;
    this.quizCard.metaTimeElm.innerText = this.quiz._time;

    this.quizCard.classList.add("show");
  }

  /**
   * ocultar la tarjeta del cuestionario.
   */
  hideQuizCard() {
    this.quizCard.classList.remove("show");
  }

  /**
   * Mostrar la tarjeta de pregunta
   */
  showQuestionsCard() {
    this.hideQuizCard();

    this.questionCard.classList.add("show");
    this.questionCard.classList.remove("time-over");

    this.startQuiz();
  }

  /**
   * ocultar la tarjeta de pregunta.
   */
  hideQuestionsCard() {
    this.questionCard.classList.remove("show");
  }

  /**
   * Manejando la visibilidad de la tarjeta de resultados.
   */
  showResultCard(result) {
    this.hideQuestionsCard();

    if (this.resultCard.scoreElm && result)
      this.resultCard.scoreElm.innerText = Math.floor(result.score * 10) / 10;

    this.resultCard.classList.add("show");
  }

  /**
   * ocultar la tarjeta de resultado.
   */
  hideResultCard() {
    this.resultCard.classList.remove("show");
    this.showQuizCard();
  }

  /**
   * Manejando el inicio de la prueba y controlar el estado de la misma.
   */
  startQuiz() {
    this.resetPreviousQuiz();
    this.quiz.reset();
    const firstQuestion = this.quiz.start();
    if (firstQuestion) {
      this.parseNextQuestion(firstQuestion);
    }

    this.questionCard.nextBtn.innerText = "Siguiente";

    this._setProgressTicker();
  }

  /**
   * inicializando el progreso del tiempo de prueba cada vez que el cuestionario comienza a controlar la barra de progreso y el tiempo restante.
   */
  _setProgressTicker() {
    this.remainingTimeInterval = setInterval(() => {
      const qTime = this.quiz.timeDetails;
      if (qTime && qTime.remainingTime) {
        
        this.questionCard.progressRemainingTimeElm.innerText =
          qTime.remainingTime;

        let progressPercent =
          ((qTime.quizTime - qTime.elapsedTime) * 100) / qTime.quizTime;
        if (progressPercent < 0) progressPercent = 0;
        this.questionCard.progressbarElm.style.width = progressPercent + "%";
      }

      if (qTime.timeOver) {
        this.questionCard.classList.add("time-over");
        this.questionCard.nextBtn.innerText = "Mostrar Resultados";
        clearInterval(this.remainingTimeInterval);
      }
    }, 1000);
  }

  /**
   * este método coloca la pregunta en la tarjeta de pregunta
   */
  parseNextQuestion(question) {
    const selectedOption = document.querySelector(
      "input[name=question-option]:checked"
    );

    this.questionCard.progressQuestionCountElm.innerText = `Question ${this.quiz
      ._currentQuestionIndex + 1}/${this.quiz._questions.length}`;
    this.questionCard.questionTitleElm.setAttribute(
      "data-qn",
      `Q ${this.quiz._currentQuestionIndex + 1}:`
    );
    this.questionCard.questionTitleElm.innerText = question.title;

    this.questionCard.optionOneElm.innerText = question.options[0];
    this.questionCard.optionTwoElm.innerText = question.options[1];
    this.questionCard.optionThreeElm.innerText = question.options[2];
    this.questionCard.optionFourElm.innerText = question.options[3];

    // restablece las opciones preseleccionadas en cada "siguiente".
    if (selectedOption) selectedOption.checked = false;
  }

  /**
   * Para restablecer el estado de la prueba anterior antes de reiniciarlo.
   */
  resetPreviousQuiz() {
    this.quiz.stop();
    clearInterval(this.remainingTimeInterval);

    this.resultCard.scoreElm.innerText = 0;
    this.questionCard.progressRemainingTimeElm.innerText = "00:00";
    this.questionCard.progressbarElm.style.width = "100%";
  }

  /**
   * Esto funciona cuando el boton "siguiente" haga clic.
   */
  nextBtnHandler() {
    const selectedOption = document.querySelector(
      "input[name=question-option]:checked"
    );

    let result;
    if (!selectedOption) {
      result = this.quiz.skipCurrentQuestion();
    } else {
      result = this.quiz.answerCurrentQuestion(selectedOption.value);
    }

    if (result.finished || result.timeOver) {
      this.showResultCard(result.result);
    } else if (result) {
      this.parseNextQuestion(result.nextQ);
    }
  }

  /**
   * Esto funciona cuando el botón de "parar" haga clic.
   */
  stopBtnHandler() {
    this.resetPreviousQuiz();
    this.showResultCard();
  }
}
