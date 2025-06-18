/* 
    Rutas del CRUD Eventos
    -> host + api/enfermeria
*/

const { Router } = require("express");
// const { validateJWT } = require("../middlewares/validateJWT");
const { getPatients } = require("../controllers/enfermeria");
const router = Router();

// Obtener pacientes
router.get('/', getPatients);

module.exports = router;