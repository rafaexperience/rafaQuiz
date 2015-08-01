// importamos objeto Quiz = quiz.sqlite a traves de models
var models = require("../models/models.js");

// GET /quizes/
exports.index = function (req, res) {
    //coge todos los datos de bd y los pasa como parametro array quizes[]
    models.Quiz.findAll().then(function (quizes) {
        res.render("quizes/index", { quizes: quizes, title: "Preguntas rafaQuiz" });
    })
};

// GET /quizes/question
//exporta la funcion como quiz_controller.question
exports.show = function (req, res) {
    //busca por id en la bd y pasa el objeto como parametro quiz
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        //monta la pagina quizes/show con la pregunta como objeto 
        res.render("quizes/show", { quiz: quiz, title: "Pregunta rafaQuiz" }); //sera show.ejs quien mueste la pregunta quiz.pregunta
    })
};
// GET /quizes/answer
//exporta la funcion como quiz_controller.answer
exports.answer = function (req, res) {
    //coge todos los datos de quiz.sqlite y los pasa como parametro array quiz[]
    models.Quiz.findAll().then(function (quiz) {
        if (req.query.respuesta === quiz[0].respuesta) {
            //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente 
            res.render("quizes/answer", { respuesta: "¡¡ Asin es !!", title: 'Respuesta rafaQuiz' });
        } else {
            res.render("quizes/answer", { respuesta: "Que dices, tarao...", title: "Respuesta rafaQuiz" });
        }
    })
};

// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Creditos rafaQuiz" });
};