// importamos objeto Quiz = quiz.sqlite a traves de models
var models = require("../models/models.js");


// GET /quizes/index
//exporta la funcion como quiz_controller.index
exports.index = function (req, res) {
    //coge todos los datos de bd y los pasa como parametro array quizes
    models.Quiz.findAll().then(function (quizes) {
        //monta la pagina quizes/index con param quizes (obj con todas preguntas) 
        res.render("quizes/index", { quizes: quizes, title: "Preguntas rafaQuiz" });
    })
};

//GET /quizes/:id
exports.show =function(req, res){
//exporta la funcion como quiz_controller.show
    models.Quiz.find(req.params.quizId).then(function(quiz){
        //coge el parametro id y lo usa para buscar un quiz :id-->quizId
        //Muestra el la pagina de la pregunta con el quiz pasado
        res.render("quizes/show", { quiz: quiz, title: "Pregunta rafaQuiz" });
    })
};

// GET /quizes/:id/answer
//exporta la funcion como quiz_controller.answer
exports.answer = function (req, res) {
    //busca pregunta segun parametro :id y pasa el objeto como quiz
    models.Quiz.find(req.params.quizId).then(function (quiz) {
        if (req.query.respuesta === quiz.respuesta) {
            //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente 
            res.render("quizes/answer", { quiz:quiz, respuesta: "¡¡ Asin es !!",
             title: 'Respuesta rafaQuiz' });
        } else {
            res.render("quizes/answer", { quiz:quiz, respuesta: "Que dices, tarao...",
             title: "Respuesta rafaQuiz" });
        }
    })
};

// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Creditos rafaQuiz" });
};