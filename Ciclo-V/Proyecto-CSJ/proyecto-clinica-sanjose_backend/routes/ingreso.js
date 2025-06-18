/* 
    Rutas del CRUD Eventos
    -> host + api/ingreso
*/

const { Router } = require("express");
const { searchByCed, crearHistoria, crearFormulario, crearPaciente, actualizarPaciente } = require("../controllers/ingreso");
const { body } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const router = Router();

// Buscar paciente por cédula
router.get('/:patCed', searchByCed);   

// Crear un nueva historia
router.post('/historia', crearHistoria);

// Crear un nuevo formulario de ingreso
router.post('/formulario', crearFormulario);

// Crear un nuevo paciente
router.post('/paciente', crearPaciente);

// Actualizar un paciente
router.put('/paciente', actualizarPaciente);

module.exports = router;   