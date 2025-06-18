/* 
    Rutas del CRUD Eventos
    -> host + api/admin
*/

const { Router } = require("express"); // Se importa Router de Express para definir las rutas.
// const { validateJWT } = require("../middlewares/validateJWT");
const { getDoctors, getNurses, getRecepcionists, getPatients, crearDoctors, crearNurses, crearRecepcionists, actualizarRegistro, eliminarRegistro } = require("../controllers/admin");
const { body } = require("express-validator"); // se usa para validar los datos de entrada.
const { validateFields } = require("../middlewares/validateFields");
const router = Router();

// Obtener registros
router.get('/docs', getDoctors);                     // Medicos
router.get('/nurses', getNurses);                    // Enfermeria 
router.get('/recepcionists', getRecepcionists);      // Recepcionistas 
router.get('/patients', getPatients);                // Pacientes

// Crear un nuevo registro
// Medico
router.post(
    '/doc',
    [
        body('cedula')
            .isInt().withMessage('La cédula debe ser un número entero.')
            .isLength({ max: 15 }).withMessage('La cédula no debe superar los 10 caracteres.'),
        body('email')
            .isEmail().withMessage('Debe ser un correo electrónico válido.')
            .isLength({ max: 30 }).withMessage('El correo electrónico no debe superar los 30 caracteres.'),
        body('nombres')
            .isLength({ max: 50 }).withMessage('Los nombres no deben superar los 50 caracteres.'),
        body('contacto')
            .isLength({ max: 20 }).withMessage('El contacto no debe superar los 20 caracteres.'),
        validateFields
    ],
    crearDoctors
);

router.post(
    '/nurse',
    [
        body('cedula')
            .isInt().withMessage('La cédula debe ser un número entero.')
            .isLength({ max: 15 }).withMessage('La cédula no debe superar los 10 caracteres.'),
        body('email')
            .isEmail().withMessage('Debe ser un correo electrónico válido.')
            .isLength({ max: 30 }).withMessage('El correo electrónico no debe superar los 30 caracteres.'),
        body('nombres')
            .isLength({ max: 50 }).withMessage('Los nombres no deben superar los 50 caracteres.'),
        body('contacto')
            .isLength({ max: 20 }).withMessage('El contacto no debe superar los 20 caracteres.'),
        validateFields
    ],
    crearNurses
);

router.post(
    '/recepcionist',
    [
        body('cedula')
            .isInt().withMessage('La cédula debe ser un número entero.')
            .isLength({ max: 15 }).withMessage('La cédula no debe superar los 10 caracteres.'),
        body('email')
            .isEmail().withMessage('Debe ser un correo electrónico válido.')
            .isLength({ max: 30 }).withMessage('El correo electrónico no debe superar los 30 caracteres.'),
        body('nombres')
            .isLength({ max: 50 }).withMessage('Los nombres no deben superar los 50 caracteres.'),
        body('contacto')
            .isLength({ max: 20 }).withMessage('El contacto no debe superar los 20 caracteres.'),
        validateFields
    ],
    crearRecepcionists
);

// Actualizar un usuario
router.put('/:id',
    [
        body('cedula')
            .isInt().withMessage('La cédula debe ser un número entero.')
            .isLength({ max: 15 }).withMessage('La cédula no debe superar los 10 caracteres.'),
        body('email')
            .isEmail().withMessage('Debe ser un correo electrónico válido.')
            .isLength({ max: 30 }).withMessage('El correo electrónico no debe superar los 30 caracteres.'),
        body('nombres')
            .isLength({ max: 50 }).withMessage('Los nombres no deben superar los 50 caracteres.'),
        body('contacto')
            .isLength({ max: 20 }).withMessage('El contacto no debe superar los 20 caracteres.'),
        validateFields
    ],
    actualizarRegistro);

// Borrar un evento
router.delete('/:cedula', eliminarRegistro);

module.exports = router;