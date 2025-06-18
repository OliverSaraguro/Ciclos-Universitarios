/* 
    Rutas del CRUD Eventos
    -> host + api/historias
*/

const { Router } = require("express");
const { getHistoria, actualizarHistoria } = require("../controllers/historias");
const router = Router();

// Obtener la historia de un paciente
router.get('/:patientCed', getHistoria); 

// Actualizar historia
router.put( '/:histid',actualizarHistoria);

module.exports = router;