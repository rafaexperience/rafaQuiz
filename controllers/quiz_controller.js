// importamos objeto Quiz = quiz.sqlite a traves de models
var models = require("../models/models.js");

//-----------------AUTOLOAD-----------------------------------------
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
//------------------INDEX------------------------------------------
// GET /quizes/
exports.index = function (req, res, next) {
    //formato busqueda {where: {pregunta: {$like: '%de%Italia%'}}} -- var locales--> busqueda=objeto filtro, searchLoc=string a buscar
    //Siempre le enviamos objeto filtro, si no tenemos fitro, ira vacio y no hará ningun filtro
    var busqueda={};
    console.log("Variable busqueda en /quizes, segun se graba en req: "+ req.query.search);//mostramos por consola parametro en la ruta
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
//----------------SHOW--------------------------------------------------
// GET /quizes/(quizId) Ej: ./quizes/1  -- carga objeto req.quiz en autoload
//exporta la funcion show
exports.show = function (req, res) {
    //busca por id en la bd y pasa el objeto como parametro quiz
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        //monta la pagina quizes/show con la pregunta como objeto 
        res.render("quizes/show", { quiz: quiz, errors: [], title: "Preg rafaQuiz" }); //show.ejs muesta la pregunta
    })
};
//---------------ANSWER--------------------------------------------------
// GET /quizes/(quizId)/answer-- carga objeto req.quiz en autoload
//exporta la funcion .answer
exports.answer = function (req, res) {
    //busca por id en la bd y pasa el objeto (pregunta, respuesta) como parametro quiz
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        //guardamos respuesta error, para enviar como parametro
        var resp = "¿¿Que dices?? ..tarao";
        // Si es la correcta cambiamos el mensaje respuesta
        if (req.query.respuesta === quiz.respuesta) {
            resp = "¡¡ Asin es !!";
        };
        //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente, el titulo, error,y el objeto quiz 
        res.render("quizes/answer", { quiz: quiz, respuesta: resp, errors: [], title: "Resp rafaQuiz" });

    })
};
//--------------NEWQUIZ-- O NEW ----------------------------------------
// GET /quizes/newquiz
exports.newquiz= function(req,res){
    var quiz=models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "respuesta"}
    );
    res.render("quizes/newquiz",{quiz:quiz, errors: [], title: "Crea Preg/Res rafaQuiz"})
}
//-------------------CREATE---------------------------------------------
// POST /quizes/create
exports.create = function (req, res) {
    console.log(req.body.quiz);
    // creamos modelo del campo quiz a grabar
    var quiz = models.Quiz.build(req.body.quiz);
    // Validamos los datos (segun models/quiz.js propiedad validate de pregunta y respuesta)
    quiz.validate().then(function (err) {
        if (err) {// con error reabrimos formulario y añadimos mensaje error
            console.log("Error al validar");
            res.render("quizes/newquiz", { quiz: quiz, errors: err.errors, title: "Crea Preg/Res rafaQuiz" });
        } else {//sin error guarda el objeto en bd y reabre pagina todas preguntas
            console.log("Campo nuevo guardado en db: " + quiz);
            quiz.save({ fields: ["pregunta", "respuesta"] })
            //y vuelve a mostrar la pagina del indice con datos actualizados
                .then(function () { res.redirect("/quizes") })
        }
    });
};
//--------------editquiz-------------------------------------------------------
// GET /quizes/(quizId)/edit -- carga objeto req.quiz en autoload
exports.editquiz = function (req, res) {
    console.log("Entramos en editquiz")
    res.render("quizes/editquiz", { quiz: req.quiz, errors: [], title: "edit Preg/Res rafaQuiz" });
};

//----------------UPDATE-------------------------------------------------------------
// PUT /quizes/(quizId)-- carga objeto req.quiz en autoload
exports.update = function (req, res) {
    console.log("Entramos en update")
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    // Validamos los datos segun models/quiz.js propiedad validate de pregunta y respuesta)
    req.quiz.validate().then(
        function (err) {
            if (err) {
                console.log("no validado y regresa a ");
                res.render("quizes/editquiz", { quiz: req.quiz, errors: err.errors, title: "edit Preg/Res rafaQuiz" });
            } else {//sin error guarda el objeto en bd y reabre pagina todas preguntas
                req.quiz.save({ fields: ["pregunta", "respuesta"] })
                    .then(function () {
                        console.log("validado y guardado, vuelve a quizes: " + req.quiz.pregunta + req.quiz.respuesta);
                        res.redirect("/quizes");
                    });
            }
        }
        );
};
//-----------------DESTROY--------------------------------------------------------------
// DELETE /quizes/(quizId) -- carga objeto req.quiz en autoload
exports.destroy= function(req, res, next){
    req.quiz.destroy().then(function(){
        res.redirect("/quizes");
    }).catch(function(error){next(error)});
};
//--------------AUTHOR----------------------------------------------------
// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Créditos rafaQuiz", errors: [] });
};