var models = require("../models/models.js");

//------------------GET STATS----------------------------------------------------
// GET /stats
//exporta la funcion como stats_controller.stats
exports.stats = function (req, res, next) {
	//Recuperamo los datos necesarios de la bd (tanto tb quiz como tb comment )
	//guarda todos quizes (solo atributo id) con sus comments ( con todos los atributos)
	var err = { errors: [] };
	models.Quiz.findAll({
		attributes: ["id"],
		include: [{ model: models.Comment, attributes: ["id", "QuizId"] }]
		//Pasamos objeto a la funcion
	}).then(function (quizstat) {
		//Muestro en consola (para ver que hago)
		var QuizContenido = JSON.stringify(quizstat);
		console.log("CONTENIDO DE quiz: " + QuizContenido);
		//si todo ok calculamos datos
		if (quizstat) {
			//preparamos variables
			var errors = [];
			var totalQuizes = quizstat.length;
			var totalComments = 0;
			var pregSin = 0;
			//hacemos ronda por cada quiz (con su campo Comments correspondiente)
			for (var q in quizstat) {
				console.log("id. quiz: " + quizstat[q].id);
				// Ya podemos ver los quiz sin Comment asignado ( segun lo monto el findAll)
				if (quizstat[q].Comments.length === 0) {
					pregSin++;
				};
				// vemos los Comments por pregunta y contamos todos
				for (var c in quizstat[q].Comments) {
					console.log("----id. comment: " + quizstat[q].Comments[c].id);
					totalComments++;
				};
			};
//			models.Comment.findAll().then(function (comentarios) {
//				if (comentarios.length !== totalComments) {
//					console.log("COMMENT TOTALES=" + comentarios.length + " Y " + "COMMENTS ASIGNADOS=" + totalComments);
//					err.errors.push(new Error("No todos los comentarios de la tabla tienen pregunta asignada:" +
//						 "Cantidad de campos en tabla Comments = "+comentarios.length));

					//Montamos paquetito para enviar mas limpio (y calculamos preguntas con commentarios(pregCon))
					req.stats = {
						totalQuizes: totalQuizes, 					//preguntas totales
						totalComments: totalComments,				// comentarios totales
						mediaCommPreg: totalComments / totalQuizes, //media comentarios por pregunta
						pregSin: pregSin,							// preguntas sin comentarios
						pregCon: totalQuizes - pregSin				// preguntas con comentarios
					};

					console.log("contenido de errors: " + JSON.stringify(errors));
					res.render("stats/stats", { stats: req.stats, title: "estadis. rafaQuiz", errors: err.errors });
//				}
//			})
		}
	});
};



