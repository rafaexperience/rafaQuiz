//carga el modulo express en variable express
var express = require('express');
//asigna el comportamiento del objeto Router() de express a router
var router = express.Router();

// acepta peticion GET /users y envia un string de vuelta
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router; // hace que router se pueda exportar a otros archivos
