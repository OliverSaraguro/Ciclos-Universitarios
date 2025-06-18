/* 
    Rutas del user - auth
    -> host + api/auth
*/

const { Router } = require('express');
const router = Router();

const { validarCedula, validarCredenciales, changePassword, primerAcceso } = require('../controllers/auth');
// const { validateJWT } = require('../middlewares/validateJWT');

// Validar usurio por cedula
router.get('/validateCedula/:cedula', validarCedula);

// Acceso primera vez
router.get('/primerAcceso/:cedula', primerAcceso);

// Validar usuario por cedula y contraseña
router.post('/validateCredenciales', validarCredenciales);

// Cambiar la contraseña por primera vez
router.put('/changePassword/:cedula', changePassword);

// Renovar el token del usuario
// router.get('/renew', validateJWT, revalidarToken);


module.exports = router;