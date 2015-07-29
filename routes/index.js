//carga el modulo express en variable express
var express = require('express');
//asigna el comportamiento del objeto Router() de express a router
var router = express.Router();

//asignamos a variable quizController las funciones exportadas en archivo /controllers/quiz_controller.
//  .question y .answer
var quizController = require("../controllers/quiz_controller");

// acepta peticion GET / o /index y envia la pagina index.js con la variable title con valor "Express"
router.get('/', function (req, res) {
    //res.render(vista, params)-->respuesta.generaPagina(pagina.ejs,objeto-
    //con parametros (variables en ejs=<%=var%>)
  res.render('index', { title: 'rafaQuiz' });
});

// Enviamos las peticiones get de quizes/.. a quizController --> controllers/quiz_controller.js
router.get("/quizes/question", quizController.question);
router.get("/quizes/answer", quizController.answer);

module.exports = router; // hace que router se pueda exportar a otros archivos
