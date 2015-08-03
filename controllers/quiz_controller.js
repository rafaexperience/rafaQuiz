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
exports.index = function (req, res, next) {
    
    //formato busqueda {where: {pregunta: {$like: '%de%Italia%'}}} -- var locales--> busqueda=objeto filtro, searchLoc=string a buscar
    //Siempre le enviamos objeto filtro, si no tenemos fitro, ira vacio y no hará ningun filtro
    var busqueda={};
    console.log("Variable introducida con formulario en /quizes, segun se graba en req: "+ req.query.search);//mostramos por consola parametro en la ruta
    //Si hay query.search (no undefined=true) adaptamos la query(string) como parametro de where(filtro)
    if (req.query.search) {
        var searchLoc="%"+(req.query.search.replace(/ /g, "%"))+"%";
        console.log("variable modificada, añadida a where: "+ searchLoc);//mostramos por consola  parametro transformado, que ira en where
       busqueda={where: {pregunta: {$like: searchLoc}}, order:['pregunta']};

   }
    //coge todos los datos de bd que coinciden con la busqueda  y los pasa como parametro array quizes[]
    models.Quiz.findAll(busqueda)
    .then(function (quizes) {
        res.render("quizes/index", { quizes: quizes, title: "Preguntas rafaQuiz" });
    }).catch(function (error) {// {Captura el error y muestra la pagina error con mensaje pasado
        next(error);
    })
};

// GET /quizes/(quizId) Ej: ./quizes/1
//exporta la funcion show
exports.show = function (req, res) {
    //busca por id en la bd y pasa el objeto como parametro quiz
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        //monta la pagina quizes/show con la pregunta como objeto 
        res.render("quizes/show", { quiz: quiz, title: "Pregunta rafaQuiz" }); //sera show.ejs quien mueste la pregunta quiz.pregunta
    })
};
// GET /quizes/(quizId)/answer
//exporta la funcion .answer
exports.answer = function (req, res) {
    //busca por id en la bd y pasa el objeto (pregunta, respuesta) como parametro quiz
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        if (req.query.respuesta === quiz.respuesta) {
            //monta la pagina quizes/answer y le envia respuesta con el valor correspondiente, el titulo, y el objeto quiz
            res.render("quizes/answer", { quiz: quiz, respuesta: "¡¡ Asin es !!", title: 'Respuesta rafaQuiz' });
        } else {
            res.render("quizes/answer", { quiz: quiz, respuesta: "Que dices, tarao...", title: "Respuesta rafaQuiz" });
        }
    })
};
// GET /quizes/newquiz
exports.newquiz= function(req,res){
    var nquiz=models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "respuesta"}
    );
    res.render("quizes/newquiz",{nquiz:nquiz, title: "Crea Pregunta rafaQuiz"})
}
// POST /quizes/create
exports.create =function(req,res){
    console.log(req.body.nquiz);
    var quiz=models.Quiz.build(req.body.nquiz);
    // guarda los campos del formulario pasado en la base de datos y vuelve a mostrar la pagina del indice con datos actualizados
    quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
        res.redirect("/quizes")
    })
}

// GET /author
//exporta la funcion como quiz_controller.author
exports.author = function (req, res) {
    //monta la pagina quizes/question con la pregunta como objeto 
    res.render("creditos", { title: "Creditos rafaQuiz" });
};