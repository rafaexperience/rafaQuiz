console.log("ENTRAMOS EN USERCONTROLLER.JS.");
var users={
	admin: {id:1,username: "admin", password: "1234"},
	pepe:  {id:2,username: "pepe" , password: "5678"}
};

// Comprueba si el usuario es uno de los registrados en users. Si no lo es se envia el error.
exports.autentificar=function(login, password, callback){
	console.log("ENTRAMOS EN USERCONTROLLER-AUTENTIFICAR.");
	if(users[login]){
		if(password===users[login].password){
			callback(null, users[login])
		} else{
			callback(new Error("Password erróneo."));
		}
	} else{
		callback(new Error("Usuario Desconocido"));
	}
};