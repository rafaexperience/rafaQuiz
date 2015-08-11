exports.newsession=function(req,res){
	// guardamos los errores para enviarlos como parametro a sessions/new.ejs
	// y los borramos de req.session
	var errors = req.session.errors || {};
	req.session.errors ={};
	res.render("sessions/new",  {errors: errors, title:"sesion rafaQuiz"});
};

// POST /login -- Crear sesion
exports.create=function(req,res){
	console.log("ENTRAMOS EN SESION-CREATE.")
	var login=req.body.login;
	var password= req.body.password;
	// creamos variable asociada a archivo user_controller que comprueba
	// si los usuarios estan en la lista
	var userController =require("./user_controller");
	userController.autentificar(login, password, function(error, user){
		if (error){
			req.session.errors=[{"message":"ERROR DE SESION: "}];
			res.redirect("/login");
			console.log("VOLVEMOS A SESION-CREATE.")
			return;
		}
		//Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id: user.id, username:user.username};
		//redirecciona a path guardado en app.js
		res.redirect(req.session.redir.toString());
		console.log("INICIO DE SESION. Reenviando a:" + req.session.redir);
	});
};
// DELETE /logout -- Destruir sesion
exports.destroy = function(req,res){
	delete req.session.user;
	console.log("FIN DE SESION. Reenviando a:" + req.session.redir);
	//redirecciona a path guardado en app.js
	res.redirect(req.session.redir.toString());
};
// AÑADIR EN RUTAS QUE REQUIERAN AUTORIZACION
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	} else{
		res.redirect("/login");
	}
};