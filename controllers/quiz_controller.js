// GET /quizes/question
//exporta la funcion como quiz_controller.question
exports.question = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("quizes/question", { pregunta: "Capital de Italia?: " });
};
// GET /quizes/answer
//exporta la funcion como quiz_controller.answer
exports.answer = function (req, res) {
    if (req.query.respuesta === "Roma") {
        //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente 
        res.render("quizes/answer", { respuesta: "¡¡ Asin es !!" });
    } else {
        res.render("quizes/answer", { respuesta: "Que dices, tarao..." });
    }
    
};
