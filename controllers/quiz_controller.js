// importamos objeto Quiz = quiz.sqlite a traves de models
var models = require("../models/models.js");
var temasArray=['Ciencia', 'Humanidades','Ocio', 'Tecnología', 'Otros'];
//-------------------------------------------------AUTOLOAD----------------------------------------------------------------
// Autoload - se ejecuta si la ruta incluye quizId como parametro (viene de routes/index.js/)
//   Tambien carga los datos relacionados de comment
exports.load = function (req, res, next, quizId) { //(peticion http, respuesta http, next=continua al siguiente gestor, parametro identificador de objeto)
    models.Quiz.findById(quizId,{include:[{ model: models.Comment }]}).then(//Localiza objeto por id, segun parametro quizId
        function (quiz) {// envia el objeto localizado a la funcion
            if (quiz) { // Si lo encuentra
                var descQuiz=JSON.stringify(Object.getOwnPropertyNames(quiz));
                var QuizContenido=JSON.stringify(quiz);
                console.log("PROPIEDADES DE (quiz) CARGADO EN AUTOLOAD:"+ descQuiz);
                console.log("CONTENIDO DE quiz: (PASADO A JSON) "+ QuizContenido);
                req.quiz = quiz; //lo guarda como req.quiz
                console.log("CONTENIDO DE REQ.QUIZ: "+ JSON.stringify(req.quiz));
                next(); //pasa el control a la siguiente funcion(answer o show)
            } else { next(new Error("No existe quizId= " + quizId)); } // pasa el control a funcion pasandole el parametro error con un mensaje
        }
    ).catch(function (error) {// {Captura el error y muestra la pagina error con mensaje pasado
        console.log("error autoload")
        next(error);
    });
};
//----------------------------------------------------/QUIZES--------------------------------------------------------------------
//------------------GET INDEX------------------------------------------
exports.index = function (req, res, next) {
    //formato busqueda {where: {pregunta: {$like: '%de%Italia%'}}} -- var locales--> busqueda=objeto filtro, searchLoc=string a buscar
    //Siempre le enviamos objeto filtro, si no tenemos fitro, ira vacio y no hará ningun filtro
    var busqueda={};

    console.log("Variable busqueda en /quizes: "+ req.query.search);//mostramos por consola parametro en la ruta
    //Si hay query.search (no undefined=true) adaptamos la query(string) como parametro de where(filtro)
    if (req.query.search) {
        var searchLoc="%"+(req.query.search.replace(/ /g, "%"))+"%";
        console.log("variable modificada, añadida a where: "+ searchLoc);//mostramos por consola  parametro transformado, que ira en where
       busqueda={where: {pregunta: {$like: searchLoc}}, order:['pregunta']};
   }
    //coge todos los datos de bd que coinciden con la busqueda  y los pasa como parametro array quizes[]
    models.Quiz.findAll(busqueda)
    .then(function (quizes) {
        res.render("quizes/index", { quizes: quizes,errors: [], title: "Preguntas rafaQuiz" });
    }).catch(function (error) {// {Captura el error y muestra la pagina error con mensaje pasado
        next(error);
    })
};
//----------------GET QUIZES/SHOW--------------------------------------------------
// GET /quizes/(quizId) Ej: ./quizes/1  -- carga objeto req.quiz en autoload
//exporta la funcion show
exports.show = function (req, res) {
        //monta la pagina quizes/show con la pregunta como objeto 
        res.render("quizes/show", { quiz: req.quiz, errors: [], title: "Preg rafaQuiz" }); //show.ejs muesta la pregunta
};
//---------------GET QUIZES/(quizId)/ANSWER--------------------------------------------------
// lleva quizId, asi que carga objeto req.quiz en autoload
//exporta la funcion .answer
exports.answer = function (req, res) {

        //guardamos respuesta error, para enviar como parametro
        var resp = "¿¿Que dices?? ..tarao";
        // Si es la correcta cambiamos el mensaje respuesta
        if (req.query.respuesta === req.quiz.respuesta) {
            resp = "¡¡ Asin es !!";
        };
        //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente, el titulo, error,y el objeto quiz 
        res.render("quizes/answer", { quiz: req.quiz, respuesta: resp, errors: [], title: "Resp rafaQuiz" });
};
//--------------GET QUIZES/NEWQUIZ-- (O NEW EN ORIGINAL) ------------------------
exports.newquiz= function(req,res){
    var quiz=models.Quiz.build(
        {pregunta: "-", respuesta: "-", tema:"Otros"}
    );
    res.render("quizes/newquiz",{quiz:quiz,temasArray:temasArray, errors: [], title: "Crea Preg/Res rafaQuiz"})
}
//-------------------POST QUIZES/CREATE---------------------------------------------
exports.create = function (req, res) {
    console.log(req.body.quiz);
    // creamos modelo del campo quiz a grabar
    var quiz = models.Quiz.build(req.body.quiz);
    // Validamos los datos (segun models/quiz.js propiedad validate de pregunta y respuesta)
    quiz.validate().then(function (err) {
        if (err) {// con error reabrimos formulario y añadimos mensaje error
            console.log("Error al validar");
            res.render("quizes/newquiz", { quiz: quiz, temasArray:temasArray, errors: err.errors, title: "Crea Preg/Res rafaQuiz" });
        } else {//sin error guarda el objeto en bd y reabre pagina todas preguntas
            console.log("Campo nuevo guardado en db: " + quiz);
            quiz.save({ fields: ["pregunta", "respuesta","tema"] })
            //y vuelve a mostrar la pagina del indice con datos actualizados
                .then(function () { res.redirect("/quizes") })
        }
    });
};
//--------------/QUIZES/(quizId)/EDITQUIZ-------------------------------------------------------
// lleva quizId, asi que carga objeto req.quiz en autoload
exports.editquiz = function (req, res) {
    console.log("Entramos en editquiz")
    res.render("quizes/editquiz", { quiz: req.quiz, temasArray:temasArray, errors: [], title: "edit Preg/Res rafaQuiz" });
};

//----------------PUT QUIZES/(quizId)/UPDATE-------------------------------------------------------------
// lleva quizId, asi que carga objeto req.quiz en autoload
exports.update = function (req, res) {
    console.log("Entramos en update")
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    // Validamos los datos segun models/quiz.js propiedad validate de pregunta y respuesta)
    req.quiz.validate().then(
        function (err) {
            if (err) {
                console.log("no validado y regresa a ");
                res.render("quizes/editquiz", { quiz: req.quiz, temasArray:temasArray, errors: err.errors, title: "edit Preg/Res rafaQuiz" });
            } else {//sin error guarda el objeto en bd y reabre pagina todas preguntas
                req.quiz.save({ fields: ["pregunta", "respuesta", "tema"] })
                    .then(function () {
                        console.log("validado y guardado, vuelve a quizes: " +req.quiz.tema + req.quiz.pregunta + req.quiz.respuesta);
                        res.redirect("/quizes");
                    });
            }
        }
        );
};
//-----------------DELETE QUIZES------------------------------------------------------------
// lleva quizId, asi que carga objeto req.quiz en autoload
exports.destroy= function(req, res, next){
    req.quiz.destroy().then(function(){
        res.redirect("/quizes");
    }).catch(function(error){next(error)});
};
//------------------GET AUTHOR----------------------------------------------------
// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Créditos rafaQuiz", errors: [] });
};