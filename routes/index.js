//carga el modulo express en variable express
var express = require('express');
//asigna el comportamiento del objeto Router() de express a router
var router = express.Router();

//asignamos a variable quizController las funciones exportadas en archivo /controllers/quiz_controller.
//  .question y .answer
var quizController = require("../controllers/quiz_controller");

// GET /home
// acepta peticion GET / o /index y envia la pagina index.js con la variable title con valor "rafaQuiz"
router.get('/', function (req, res) {
    //res.render(vista, params)-->respuesta.generaPagina(pagina.ejs,objeto-
    //con parametros (variables en ejs=<%=var%>)
  res.render('index', { title: 'rafaQuiz', errors: [] });
});
// AUTOLOAD (recoge rutas con parametro quizId)
router.param("quizId", quizController.load);
//GET /quizes/..
// Enviamos las peticiones get de /quizes/.. a quizController --> controllers/quiz_controller.js
router.get("/quizes/", quizController.index);
router.get("/quizes/:quizId(\\d+)", quizController.show);
router.get("/quizes/:quizId(\\d+)/answer", quizController.answer);
router.get("/quizes/newquiz", quizController.newquiz);
router.post("/quizes/create", quizController.create);
//GET /author
// Enviamos peticiones get de /author a quizController
router.get("/author", quizController.author);

module.exports = router; // hace que router se pueda exportar a otros archivos
