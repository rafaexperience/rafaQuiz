// Definición de módelo de bd Quiz
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Quiz", {
        pregunta: {
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "-- Falta Pregunta --"} }
        },
        respuesta: {
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "-- Falta Respuesta --"} }
                },
        tema: {
            type: DataTypes.STRING,
            validate: {
                 notEmpty: {msg: "-- Falta Tema --"},
                 isIn: { args: [['Ciencia', 'Humanidades','Ocio', 'Tecnología', 'Otros']],
                         msg: "Solo los temas indicados"}
                      }
              }
    });
}
