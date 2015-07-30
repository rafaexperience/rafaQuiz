//cargamos modulo path en variable path - crea rutas de archivo
var path = require('path');

//cargamos modulo sequelize en variable Sequelize- Gestiona modelos de bd reales (dentro de las compatibles)
var Sequelize = require('sequelize');

//Creamos "objeto" para base datos tipo sqlite de nombre quiz.sqlite (al ser local, no le asignamos usuario ni nada) 
var sequelize = new Sequelize(null, null, null,
    { dialect: "sqlite", storage: "quiz.sqlite" }
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