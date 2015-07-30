// GET /quizes/question
//exporta la funcion como quiz_controller.question
exports.question = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("quizes/question", { pregunta: "Capital de Italia ?: ", title: "Pregunta rafaQuiz" });
};
// GET /quizes/answer
//exporta la funcion como quiz_controller.answer
exports.answer = function (req, res) {
    if (req.query.respuesta === "Roma") {
        //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente 
        res.render("quizes/answer", { respuesta: "¡¡ Asin es !!", title: 'Respuesta rafaQuiz' });
    } else {
        res.render("quizes/answer", { respuesta: "Que dices, tarao...", title: "Respuesta rafaQuiz" });
    }
    
};

// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Creditos rafaQuiz" });
};