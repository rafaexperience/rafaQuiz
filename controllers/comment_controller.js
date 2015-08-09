var models = require("../models/models.js");
//---------------------------------------QUIZES/COMMENTS------------------------------------------------------------
// GET /QUIZES/(quizId)/COMMENTS/NEW
exports.newcomment=function(req, res){
	res.render("comments/new", {quizId: req.params.quizId, errors: [], title: "new Coment rafaQuiz" });
};

// POST QUIZES/(quizId)/COMMENTS
exports.create=function(req, res,next){
	//Crea un campo provisional de tabla Comment (definido en models/comment)
	var comment = models.Comment.build(
		{ comentario: req.body.comment.comentario, //comentario pendiente de guardar
		  QuizId: req.params.quizId	//relacion entre comentario(comment) y pregunta asociada(quiz)segun página
		}
	);
	//valida el campo creado (confirma que los campos coinciden con lo especificado en validate de comment.js)
	comment.validate() // si al validar hay algun error se guarda en err
	.then( function(err){ // si cuando lo valide, error contiene algo (no validado) se lo pasa a la funcion
		if (err){ //si hubo error
			// muestra la página con los datos actuales y el mensaje del error
			res.render("comments/new", {comment:comment, quizId: req.params.quizId, errors: err.errors, title: "error Coment rafaQuiz" });
		} else{// si no hubo error(=null)
			comment.save()// guardamos objeto provisional en tb Comment
				.then( function(){ res.redirect("/quizes/" + req.params.quizId)}) //muestra página quizes/(quizId) con datos nuevos
			}
		
	}).catch(function(error){next(error)});//Esto se activara si se detecta error fuera de validate (creo)
};