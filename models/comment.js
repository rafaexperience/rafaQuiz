// Definición de módelo de bd Comments
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Comment", {
        comentario: {
            type: DataTypes.STRING,
            validate: { notEmpty: { msg: "-- Falta Comentario --" } }
        }
    });
}
