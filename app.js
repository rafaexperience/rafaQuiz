// Cargamos módulos en variables( Al ser parte de la aplicacion, deben estar en package.json)
// localmente, se instalarian con npm install
// Resumen de modulos (sin conocerlos realmente)


// express- modulo para crear servidores
var express = require('express');
// path- ayuda para montar (uri´s) rutas a archivos o recursos internet
var path = require('path');
// serve-favicon- Monta el icono para el titulo de las paginas
var favicon = require('serve-favicon');
// morgan- Ayuda para conectarse con permisos (log)
var logger = require('morgan');
// Analiza cookies para pasarlas a otro formato
var cookieParser = require('cookie-parser');
// Analiza los parametros en body de una solicitud (Ej. formularios web) para recuperar datos
// ver final modulo 4
var bodyParser = require('body-parser');

// Gestiona las url pedidas (gets) para devolverle lo que sea
var routes = require('./routes/index');
// Controla los accesos registrados
var users = require('./routes/users');

// "instancia" el modulo en app  !!!!SE PUEDE CONFUNDIR CON app de bin/www que este mismo archivo  
var app = express();

// configura el motor views (Esto es para montar las paginas con ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Quitar comentario despues de colocar tu favicon en carpeta public/
//app.use(favicon(__dirname + '/public/favicon.ico'));

// aplicamos y configuramos los modulos
app.use(logger('dev')); // supongo que dev sera el usuario que crea la pagina
app.use(bodyParser.json()); // 
app.use(bodyParser.urlencoded({ extended: false })); // ver final modulo 4. Codifica url´s en utf8
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // devuelve peticiones a recursos que esten en public/

app.use('/', routes); // envia las peticiones a /, a /routes/index.js
//http://localhost:3000 devuelve "Welcome to Express"
app.use('/users', users); // envia las peticiones a /, a /routes/users.js
//http://localhost:3000/users devuelve "respond with a resource
// GESTION DE ERRORES - SI ACCEDE A RECURSOS QUE NO EXISTEN O LA APLICACION-SERVIDOR FALLA

// captura 404 (recurso no encontrado) and envia al manejador de errores con codigo 404
app.use(function(req, res, next) {
    var err = new Error('No tengo lo que buscas');
    err.status = 404;
    next(err);
});

// manejadores de error

// manejador de errores del desarrollo
// se mostrara en ??(stacktrace - seguimiento en la pila de llamadas)
// Algun tipo de registro de monitoreo.
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {//muestra views/error.ejs
            message: err.message + " (Error desarrollo)",
            error: err//se envia objeto err (incluye error.status y error.stack que se muestran en views/error.ejs)
        });
    });
}

// manejador de error de producccion (en la red?)
// no stacktraces leaked to user ( La pila de llamadas no le aparecera al usuario. no envia err)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {//muestra views/error.ejs
        message: err.message + " (Error produccion)",
        error: {} //se envia objeto vacio
    });
});


module.exports = app;// muestra app para todas las aplicaciones
