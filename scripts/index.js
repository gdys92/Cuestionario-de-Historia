
const app = document.getElementById("quiz-app");
const quizCard = document.getElementById("quiz-details");
const questionsCard = document.getElementById("questions-card");
const resultCard = document.getElementById("result-card");

let quiz;

function initApp() {
    const questions = [
        {
            title: "¿Qué líder tribal luchó contra la ocupación romana de Gran Bretaña (Britania)?",
            options: ["Tácito", "Boudica", "Prasutagus", "Ariovistus"]
        }, {
            title: "¿Qué esposas de Enrique VIII fueron decapitadas?",
            options: ["Catalina Howard y Catalina Parr", 
                       "Ana Bolena y Catherine Howard", 
                       "Ana de Cléveris y Ana Bolena", 
                       "Ana de Cléveris y Ana Bolena"]
        }, {
            title: "¿Qué emperador romano legalizó el cristianismo y puso fin a la persecución de los cristianos?",
            options: [
                "Nerón",
                "Constantino",
                "Trajano",
                "Adriano"]
        }, {
            title: "¿Qué hito informático de 1969 cambiaría radicalmente el curso de la historia de la humanidad?",
            options: [
                'El primer router wi-fi',
                'Internet',
                'El primer ordenador personal',
                'El primer iPod'
            ]
        }, {
            title: '¿Quién fue el primer Presidente de Estados Unidos?',
            options: [
                'George Washington',
                'Abraham Lincoln',
                'Thomas Jefferson',
                'Andrew Jackson',
            ]
        }, {
            title: '¿Cuál es el nombre de la famosa batalla donde Napoleón Bonaparte fue derrotado?',
            options: [
                'La batalla de Hastings',
                'La batalla de Waterloo',
                'La batalla del Álamo',
                'La batalla de Stalingrado',
            ]
        }, {
            title: '¿A través de qué río africano se alzó el antiguo Egipto?',
            options: [
                'Éufrates',
                'Nilo',
                'Tigris',
                'Amazonas',
            ]
        }, {
            title: '¿A qué filósofo griego se atribuye la famosa obra “La República”?',
            options: [
                'Aristóteles',
                'Platón',
                'Ptolomeo',
                'Sócrates',
            ]
        }, {
            title: '¿Qué facción dirigió MaoZedong durante la guerra civil China?',
            options: [
                'Nacionalistas',
                'Comunistas',
                'Confederados',
                'Protestantes',
            ]
        }, {
            title: '¿En qué año se disolvió la Unión Soviética?',
            options: [
                'En 1981',
                'En 1991',
                'En 1987',
                'En 1989',
            ]
        },
    ];

    quiz = new Quiz(
        "¿Cuánto sabes de historia universal?",
        `¿Te crees capaz de pasar esta prueba de historia? Recuerda que abarcamos todos los continentes y muchas de las culturas del mundo. ¡Comprueba cuánto sabes!`,
        70,
        questions);

    new QuizElementsHelper(app, quizCard, questionsCard, resultCard, quiz);
}

initApp();


