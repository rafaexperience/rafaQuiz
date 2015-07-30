//cargamos modulo path en variable path - crea rutas de archivo
var path = require('path');
//  VARIABLE ENTORNO: DATABASE_URL --process.env.DATABASE_URL
//Postgres DATABASE_URL = postgres://user:passwd@host:port/database --> instalado en HEROKU como addon y configurada variable entorno al añadirlo
//SQLite3  DATABASE_URL = sqlite://:@:/ --> en .env
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);     // nombre de bd
var user = (url[2] || null);        // usuario (si lo tiene)
var paswd = (url[3] || null);       // contraseña (si tiene)
var protocol = (url[1] || null);    // protocolo que usa 
var dialect = (url[1] || null);     // lenguaje= protocol
var port = (url[5] || null);        // puerto de bd
var host = (url[4] || null);        // nombre del servidor
var storage = process.env.DATABASE_STORAGE; // variable entorno (si esta en local)


//cargamos modulo sequelize en variable Sequelize- Gestiona modelos de bd reales (dentro de las compatibles)
var Sequelize = require('sequelize');

//Creamos "objeto" para base datos tipo sqlite o postgres (ahora añadimos datos segun division url con subexpresiones regulares) 
var sequelize = new Sequelize(DB_name, user, paswd,
    {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage,   // solo SQLite (.env)
    omitNull: true      // solo Postgres
}
);

//Aplicamos la definicion de datos al objeto de la base de datos creado (quiz.js -->sequelize) y lo asignamos a var Quiz
var Quiz = sequelize.import(path.join(__dirname, "quiz")); //  models/quiz.js (module.exports)
//Hacemos visible Quiz para el resto del codigo
exports.Quiz = Quiz;

//sync crea (o se conecta) con el archivo quiz.sqlite. ejecuta then()Cuando es exitoso
sequelize.sync().then(function () {
    Quiz.count().then(function (count) {
        if (count === 0) {
            Quiz.create({ pregunta: "Capital de Italia ?", respuesta: "Roma" })
            .then(function () { console.log("Base de Datos inicializada") });
        };
    });
});