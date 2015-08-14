//carga el modulo express en variable express
var express = require('express');
//asigna el comportamiento del objeto Router() de express a router
var router = express.Router();

//asignamos a variables  los archivos controladores de carpeta controllers/.
var quizController = require("../controllers/quiz_controller");
var commentController = require("../controllers/comment_controller");
var sessionController = require("../controllers/session_controller");
var statsController = require("../controllers/stats_controller");
// GET /home
// acepta peticion GET / o /index y envia la pagina index.js con la variable title con valor "rafaQuiz"
router.get('/', function (req, res) {
    //res.render(vista, params)-->respuesta.generaPagina(pagina.ejs,objeto-
    //con parametros (variables en ejs=<%=var%>)
  res.render('index', { title: 'rafaQuiz', errors: [] });
});

// AUTOLOAD (recoge rutas con parametro quizId)
router.param("quizId", quizController.load);
// AUTOLOAD COMMENT ( rutas que incluyan commentId)
router.param("commentId", commentController.load
  )
// RUTAS SESION
//GET  POST DELETE /login/ o logout SESION
// Enviamos las peticiones a /login/.. a sessionController --> controllers/session_controller.js
router.get("/login", sessionController.newsession); // formulario login
router.post("/login", sessionController.create); // crear sesion
router.delete("/login", sessionController.destroy); // cerrar sesion

//GET  POST PUT DELETE /quizes/.. PREGUNTAS Y RESPUESTAS
// Enviamos las peticiones a /quizes/.. a quizController --> controllers/quiz_controller.js
router.get("/quizes", quizController.index);
router.get("/quizes/:quizId(\\d+)", quizController.show);
router.get("/quizes/:quizId(\\d+)/answer", quizController.answer);
router.get("/quizes/newquiz", sessionController.loginRequired, quizController.newquiz);
router.post("/quizes/create", sessionController.loginRequired, quizController.create);
router.get("/quizes/:quizId(\\d+)/editquiz", sessionController.loginRequired, quizController.editquiz);
router.put("/quizes/:quizId(\\d+)", sessionController.loginRequired, quizController.update);
router.delete("/quizes/:quizId(\\d+)", sessionController.loginRequired, quizController.destroy);

//GET  POST PUT DELETE quizes/comment/..  COMENTARIOS
// Enviamos las peticiones a quizes/comment/.. a commentController --> controllers/comment_controller.js
router.get("/quizes/:quizId(\\d+)/comments/new", commentController.newcomment);
router.post("/quizes/:quizId(\\d+)/comments", commentController.create);
router.put("/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish",
                sessionController.loginRequired, commentController.publish);

//GET /author CREDITOS
// Enviamos peticiones get de /author a quizController
router.get("/author", quizController.author);

//GET /stats CREDITOS
// Enviamos peticiones get de /author a quizController
router.get("/stats", sessionController.loginRequired, statsController.stats);

module.exports = router; // hace que router se pueda exportar a otros archivos
