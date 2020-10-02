"use strict";

let TIME_OVER_SYM = Symbol("TO");
let TIMER_INTERVAL_SYM = Symbol("TI");

class Quiz {

    constructor(title, description, time, questions = []) {

        if (!title)
            throw new Error("El titulo es requerido.");

        if (!description)
            throw new Error("La descripcion es requerida.");

        if (!time || time < 10)
            throw new Error("El tiempo es requerido y debe ser mas de 10 seg.");

        this.title = title;
        this.description = description;
        this._time = time;
        this[TIME_OVER_SYM] = null;
        this[TIMER_INTERVAL_SYM] = null;
        this._questions = questions;
    }

    
    addQuestion(title, options) {
        if (this._startTime) {
            console.log("La pregunta no se puede agregar en un cuestionario iniciado.");
            return;
        }

        let id = this._questions.length;
        this._questions.push({id, title, options})
    }

    
    start() {
        if (!this._questions.length) {
            console.log("No hay una pregunta.");
            return;
        }

        if (this._startTime) {
            console.log("Ya inició.");
            return;
        }

        this.reset();
        this._startTime = new Date().getTime();

        this._setTicker();

        return this.currentQuestion;
    }

    /**
     * Parar cuestionario.
     */
    stop() {
        this._endTime = new Date().getTime();
        clearInterval(this[TIMER_INTERVAL_SYM]);
        this[TIMER_INTERVAL_SYM] = null;
    }

    /**
     * Esto devolverá la pregunta principal de ejecutar la prueba
     */
    get currentQuestion() {
        if (!this._startTime) {
            console.log("El cuestionario no inició.");
            return;
        }

        return this._questions[this._currentQuestionIndex];
    }

    /**
     * Obtener el resultado de la ejecución de la prueba
     */
    result() {
        if (!this._startTime) {
            console.log("El cuestionario no inició.");
            return;
        }

        let skipped = 0;
        let correct = 0;
        this._questions.map(q => {
            if (q.result)
                correct++;
            else if (q.skip)
                skipped++;
        });

        let score = (100 * correct) / this._questions.length;

        return {
            questionsCount: this._questions.length,
            skipped,
            correct,
            score,
            timeOver: this[TIME_OVER_SYM],
            finished: this.isOnLastQuestion() || this[TIME_OVER_SYM] || this._endTime
        };
    }

    /**
     * Restableciendo el estado de la prueba en ejecución y prepárese para comenzar de nuevo
     */
    reset() {
        if (this._startTime && !this._endTime) {
            console.log("No se puede restablecer el cuestionario en ejecución.");
            return;
        }

        this._startTime = null;
        this._endTime = null;
        this._remainingTime = this._time;
        this._currentQuestionIndex = 0;
        this[TIME_OVER_SYM] = false;
        clearInterval(this[TIMER_INTERVAL_SYM]);

        this._questions = this._questions.map(q => ({id: q.id, title: q.title, options: q.options}))
    }

    /**
     * responder a la pregunta principal de la prueba y contiuar con una opción seleccionada
     */
     
    answerCurrentQuestion(option) {
        if (!this._startTime) {
            console.log("Comience el cuestionario primero.");
            return;
        }

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: this.isOnLastQuestion() || this._endTime || this[TIME_OVER_SYM]
        };

        if (!this[TIME_OVER_SYM]) {

            const currentQ = this.currentQuestion;
            if (currentQ.skip !== void (0)) {
                console.log("Ya se ha saltado esta pregunta.");
                return;
            }
            if (currentQ.answer !== void (0)) {
                console.log("Ya respondiste a esta pregunta.");
                return;
            }
            currentQ.answer = option;
            const answerResult = checkAnswerValidity(currentQ.id, option);
            currentQ.result = answerResult;

            response.answerResult = answerResult;

            if (!response.finished) {
                const nextQ = askNextQuestion.call(this);
                if (nextQ) {
                    response.nextQ = nextQ;
                }
            }
        }

        if (response.finished) {
            response.result = this.result();
            this.stop();
        }

        return response;
    }

    /**
     * Omitir pregunta y elija la siguiente pregunta si existe.
     
     */
    skipCurrentQuestion() {
        if (!this._startTime) {
            console.log("Comience el cuestionario primero.");
            return;
        }

        let response = {
            timeOver: this[TIME_OVER_SYM],
            finished: this.isOnLastQuestion() || this._endTime || this[TIME_OVER_SYM]
        };

        if (!this[TIME_OVER_SYM]) {

            const currentQ = this.currentQuestion;
            if (currentQ.skip !== void (0)) {
                console.log("Ya se ha saltado esta pregunta");
                return;
            }
            if (currentQ.answer !== void (0)) {
                console.log("Ya respondiste a esta pregunta");
                return;
            }
            currentQ.skip = true;

            if (!response.finished) {
                const nextQ = askNextQuestion.call(this);
                if (nextQ) {
                    response.nextQ = nextQ;
                }
            }
        }

        if (response.finished) {
            response.result = this.result();
            this.stop();
        }

        return response;
    }

    /**
     * Check if the head question is the last question of running quiz.
     */
    isOnLastQuestion() {
        return this._currentQuestionIndex + 1 >= this._questions.length
    }

    /**
     * Get the details of the timing of the quiz
     *
     * @returns {{start: null, end: null, timeOver: *, quizTime: *, elapsedTime: number, remainingTime: *}}
     */
    get timeDetails() {
        let now = new Date().getTime();
        return {
            quizTime: this._time,
            start: this._startTime,
            end: this._endTime,
            elapsedTime: ((this._endTime || now) - this._startTime) / 1000, // ms to sec
            remainingTime: secToTimeStr(this._remainingTime),
            timeOver: this[TIME_OVER_SYM]
        }
    }

    /**
     * Control the ticker of the time of the running quiz.
     *
     * @private
     */
    _setTicker() {
        if (!this._startTime) {
            console.log("Quiz not started yet.");
            return;
        }

        if (this[TIMER_INTERVAL_SYM]) {
            console.log("The ticker has been set before");
            return;
        }

        let privateRemainingTimeInSec = this._time;
        this[TIME_OVER_SYM] = false;
        this[TIMER_INTERVAL_SYM] = setInterval(() => {
            --privateRemainingTimeInSec;
            this._remainingTime = privateRemainingTimeInSec;
            if (privateRemainingTimeInSec <= 0) {
                this[TIME_OVER_SYM] = true;
                this.stop();
            }
        }, 1000)
    }
}

/**
 * Private function to ask next question.
 * @returns {*}
 */
function askNextQuestion() {
    if (!this._startTime) {
        console.log("Quiz not started");
        return;
    }

    const currentQ = this.currentQuestion;
    if (currentQ.answer === void (0) && currentQ.skip === void (0)) {
        console.log("Current question answered or skipped.");
        return;
    }

    if (this.isOnLastQuestion()) {
        console.log("No more question.");
        return;
    }

    return this._questions[++this._currentQuestionIndex];
}

/**
 * check the validity of the selected option
 *
 * @param questionID
 * @param option
 */
function checkAnswerValidity(questionID, option) {

    // Every checking could be apply here but
    // the correct answer is the second option in
    // my questions because of its simplicity
    return +option === 1;
}

/**
 * Convert number (in second) to time-string
 *
 * @param seconds
 * @returns {string}
 */
function secToTimeStr(seconds) {

    let timeInHour = Math.floor(seconds / 3600);
    let timeInMin = Math.floor((seconds % 3600) / 60);
    let timeInSec = Math.floor(seconds % 60);

    if (timeInHour < 10)
        timeInHour = `0${timeInHour}`;

    if (timeInMin < 10)
        timeInMin = `0${timeInMin}`;

    if (timeInSec < 10)
        timeInSec = `0${timeInSec}`;

    let timeStr = `${timeInMin}:${timeInSec}`;
    if (parseInt(timeInHour))
        timeStr = `${timeInHour}:${timeStr}`;

    return timeStr;
}
