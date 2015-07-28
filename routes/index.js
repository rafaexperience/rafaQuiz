//carga el modulo express en variable express
var express = require('express');
//asigna el comportamiento del objeto Router() de express a router
var router = express.Router();

// acepta peticion GET / o /index y envia la pagina index.js con la variable title con valor "Express"
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router; // hace que router se pueda exportar a otros archivos
