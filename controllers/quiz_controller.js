// importamos objeto Quiz = quiz.sqlite a traves de models
var models = require("../models/models.js");

// Autoload - se ejecuta si la ruta incluye quizId como parametro (viene de routes/index.js/)
exports.load = function (req, res, next, quizId) { //(peticion http, respuesta http, next=continua al siguiente gestor, parametro identificador de objeto)
    models.Quiz.findById(quizId).then(//Localiza objeto por id, segun parametro quizId
        function (quiz) {// envia el objeto localizado a la funcion
            if (quiz) { // Si lo encuentra
                req.quiz = quiz; //lo guarda como req.quiz
                next(); //pasa el control a la siguiente funcion(answer o show)
            } else { next(new Error("No existe quizId= " + quizId)); } // pasa el control a funcion pasandole el parametro error con un mensaje
        }
    ).catch(function (error) {// {Captura el error y muestra la pagina error con mensaje pasado
        console.log("error autoload")
        next(error);
    });
};

// GET /quizes/
exports.index = function (req, res) {
    //coge todos los datos de bd y los pasa como parametro array quizes[]
    models.Quiz.findAll().then(function (quizes) {
        res.render("quizes/index", { quizes: quizes, title: "Preguntas rafaQuiz" });
    }).catch(function (error) {// {Captura el error y muestra la pagina error con mensaje pasado
        console.log("error autoload");
        next(error);
    })
};

// GET /quizes/(quizId) Ej: ./quizes/1 (como url incluye quizId pasa por autoload, que localiza el objeto y lo guarda en la peticion como req.quiz
//exporta la funcion show
exports.show = function (req, res) { //carga el quizId desde autoload que lo guarda como req.quiz para enviarlo a la pagina como quiz
    //monta la pagina quizes/show y le envia respuesta con el titulo, y el objeto req.quiz como quiz
    res.render("quizes/show", { quiz: req.quiz, title: "Pregunta rafaQuiz" }); //sera show.ejs quien mueste la pregunta quiz.pregunta
};

// GET /quizes/(quizId)/answer (como url incluye quizId pasa por autoload, que localiza el objeto y lo guarda en la peticion como req.quiz
//exporta la funcion .answer
exports.answer = function (req, res) {
    var result = "Que dices, Tarao...";//Asume que es erronea y fuarda mensaje
    if (req.query.respuesta === req.quiz.respuesta) {//si es correcta modifica el mensaje
        result = "¡¡ Asín es !!";
    }
    //monta la pagina quizes/answer y le envia respuesta con el mensaje correspondiente, el titulo, y el objeto req.quiz como quiz
    res.render("quizes/answer", { quiz: req.quiz, respuesta: result, title: "Respuesta rafaQuiz" }); //Sera answer.ejs quien use quiz.respuesta
};

// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Creditos rafaQuiz" });
};