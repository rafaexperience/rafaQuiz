// GET /login -- Formulario de login
exports.new=function(req,res){
	// guardamos los errores para enviarlos como parametro a sessions/new.ejs
	// y los borramos de req.session
	var errors = req.session.errors || {};
	req.session.errors ={};
	res.render("sessions/new",  {errors: errors, title:"sesion rafaQuiz"});
};

// POST /login -- Crear sesion
exports.create=function(req,res){
	var login=req.body.login;
	var password= req.body.password;
	// creamos variable asociada a archivo user_controller que comprueba
	// si los usuarios estan en la lista
	var userController =require("./user_controller");
	userController.autenticar(login, password, function(error, user){
		if (error){
			req.session.errors=[{"message":"ERROR DE SESION: "}];
			res.redirect("/login");
			return;
		}
		//Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id: user.id, username:user.username};
		//redirecciona a path guardado en app.js
		res.redirect(req.session.redir.toString());
	});
};
// DELETE /logout -- Destruir sesion
exports.destroy = function(req,res){
	delete req.session.user;
	//redirecciona a path guardado en app.js
	res.redirect(req.session.redir.toString());
};