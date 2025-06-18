/* 
    Rutas del CRUD Eventos
    -> host + api/medico
*/

const { Router } = require("express");
// const { validateJWT } = require("../middlewares/validateJWT");
const {getPatients, getPatientByCed, agregarPaciente } = require("../controllers/medico");
const router = Router();

// Obtener pacientes
router.get('/pats/:doctorCed', getPatients);

// Obtener pacientes especifico
router.get('/pat/:patCed', getPatientByCed);   

// Agregar paciente
router.put( '/:patCed',agregarPaciente);

module.exports = router;