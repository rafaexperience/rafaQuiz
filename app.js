/* global __dirname */
// Cargamos módulos en variables( Al ser parte de la aplicacion, deben estar en package.json)
// localmente, se instalarian con npm install
// Resumen de modulos (sin conocerlos realmente)


// express- modulo para crear servidores
var express = require('express');
// path- ayuda para montar (uri's) rutas a archivos o recursos internet
var path = require('path');
// morgan- Ayuda para conectarse con permisos (log)
var logger = require('morgan');
// Analiza cookies para pasarlas a otro formato
var cookieParser = require('cookie-parser');
// Analiza los parametros en body de una solicitud (Ej. formularios web) para recuperar datos--ver final modulo 4
var bodyParser = require('body-parser');
// Permite incluir un marco layout común a todas las páginas
var partials = require('express-partials');
// Permite transformar una petición http a otra: Ej POST -->DELETE
var methodOverride =require("method-override");
// Ayuda para gestionar sesiones de usuario (usa cookies)
var session =require("express-session");
// conecta con la pagina de inicio /routes/index.ejs
var routes = require('./routes/index');

// "instancia" el modulo en app  !!!!SE PUEDE CONFUNDIR CON app de bin/www que este mismo archivo  
var app = express();

// configura el motor views (Esto es para montar las paginas con ejs pasandole variables)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// aplicamos y configuramos los modulos
app.use(partials());
app.use(logger('dev')); // supongo que dev sera el usuario que crea la pagina
//elimino serve-favicon, por que lo incluyo directo en pagina (layout.ejs)
app.use(bodyParser.json()); //  Analiza el cuerpo de la petición http
app.use(bodyParser.urlencoded()); // ver final modulo 4. Codifica url's en utf8
app.use(cookieParser("rafaQuiz2015")); //Gestiona las cookies-param=semilla para codif.
app.use(session()); // gestión de sesiones
app.use(methodOverride("_method")); // Permite cambiar una peticion http en otra Ej - POST --> DELETE
app.use(express.static(path.join(__dirname, 'public'))); // devuelve peticiones a recursos que esten en public/

// Helpers dinamicos (para sesiones)
app.use(function(req, res, next){
    // guardar path en req.session.redir para volver tras login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir=req.path; 
    }
    //Hacer visible req.session en las vistas (en res, mas bien)
    res.locals.session=req.session;
    next();// envia al siguiente gestor, segun ruta
});


app.use('/', routes); // envia las peticiones de /, a /routes/index.js
//http://localhost:3000 devuelve "Welcome to rafaQuiz"
//http://localhost:3000/users devuelve 404 y muestra pagina error desarrollo
//   ahora está modificado y lo gestiona segun archivo routes/index.js

// GESTION DE ERRORES - SI ACCEDE A RECURSOS QUE NO EXISTEN O LA APLICACION-SERVIDOR FALLA

// captura 404 (recurso no encontrado) and envia al manejador de errores con codigo 404
app.use(function (req, res, next) {
    var err = new Error('No tengo lo que buscas');
    err.status = 404;
    next(err);
});

// manejadores de error

// manejador de errores del desarrollo
// se mostrara en ??(stacktrace - seguimiento en la pila de llamadas)
// Algun tipo de registro de monitoreo.
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {//muestra views/error.ejs
            title: "error rafaQuiz",
            errors: [],
            message: err.message + " (Error desarrollo)",
            error: err//se envia objeto err (incluye error.status y error.stack que se muestran en views/error.ejs)
        });
    });
}

// manejador de error de producccion (en la red?)
// no stacktraces leaked to user ( La pila de llamadas no le aparecera al usuario. no envia err)
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { //muestra views/error.ejs
        title: "error rafaQuiz",
        errors: [],
        message: err.message + " (Error produccion)",
        error: {} //se envia objeto vacio
    });
});


module.exports = app;// muestra app para todas las aplicaciones (que apliquen require)
