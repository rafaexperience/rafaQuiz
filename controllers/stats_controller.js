var models = require("../models/models.js");

//------------------GET STATS----------------------------------------------------
// GET /stats
//exporta la funcion como stats_controller.stats
exports.stats = function (req, res) {
	//guarda todos quizes con sus comments
    function (quiz) {
		models.Quiz.findAll({include:[{ model: models.Comment }]}).then(){
			function (quiz) {
				var QuizContenido=JSON.stringify(quiz);
				console.log("CONTENIDO DE quiz: "+ QuizContenido);
					if (quiz) {
						console.log("Quiz existe");
				
				}
			}
		}
	}
    //monta la pagina stats/stats.ejs 
    res.render("stats/stats", { title: "estadis. rafaQuiz", errors: [] });
};