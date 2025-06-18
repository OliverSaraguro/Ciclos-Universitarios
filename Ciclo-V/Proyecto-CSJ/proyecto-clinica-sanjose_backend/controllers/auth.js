const { dbConection } = require('../database/config');
const bcrypt = require('bcryptjs');

const validarCedula = async (req, res) => {
    const cedula = parseInt(req.params.cedula);

    try {

        dbConection().query(
            `SELECT COUNT(*) AS count, rol FROM usuarios WHERE cedula = ?`,
            [cedula],
            (error, results) => {
                if (error) throw error;

                // Si no se encuentra el usuario o el rol no es 'patient'
                if (results[0].count <= 0 || results[0].rol !== 'patient') {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Paciente no encontrado.'
                    });
                }

                dbConection().query(`SELECT id, nombres, cedula, email, rol FROM usuarios WHERE cedula = ?;`, [cedula],
                    (error, results, fields) => {
                        if (error) throw error;

                        res.json({
                            ok: true,
                            user: results[0],
                        });
                    });

            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};

const primerAcceso = async (req, res) => {
    const cedula = parseInt(req.params.cedula);

    try {

        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [cedula],
            (error, results) => {
                if (error) throw error;

                // Si no se encuentra el usuario 
                if (results[0].count <= 0 ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Paciente no encontrado.'
                    });
                }

                dbConection().query(`SELECT id, nombres, cedula, email, rol FROM usuarios WHERE cedula = ?;`, [cedula],
                    (error, results, fields) => {
                        if (error) throw error;

                        res.json({
                            ok: true,
                            user: results[0],
                        });
                    });

            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};


const validarCredenciales = async (req, res) => {
    const { cedula, password } = req.body;

    try {
        // 1. Verificamos si el usuario con la cédula existe
        dbConection().query(
            `SELECT COUNT(*) AS count, password, rol, id, nombres, email FROM usuarios WHERE cedula = ?`,
            [cedula],
            (error, results) => {
                if (error) throw error;

                // 2. Si no se encuentra el usuario
                if (results[0].count <= 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario no encontrado.'
                    });
                }

                // 3. Obtenemos los detalles del usuario
                const user = results[0];

                // 4. Si la contraseña en la base de datos es igual a la cédula (primer acceso)
                if (user.password === cedula.toString()) {
                    return res.json({
                        ok: true,
                        user: {
                            id: user.id,
                            nombres: user.nombres,
                            cedula: cedula,
                            email: user.email,
                            rol: user.rol,
                            password: cedula // Enviar la cédula como "password" para este caso específico
                        }
                    });
                }

                // 5. Si no, comparamos la contraseña recibida con la almacenada en la base de datos (hasheada)
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al comparar contraseñas.'
                        });
                    }

                    // Si las contraseñas coinciden después de la comparación del hash
                    if (isMatch) {
                        return res.json({
                            ok: true,
                            user: {
                                id: user.id,
                                nombres: user.nombres,
                                cedula: cedula,
                                email: user.email,
                                rol: user.rol
                            }
                        });
                    }

                    // Si las contraseñas no coinciden
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario y/o contraseña incorrecto/s'
                    });
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};

const changePassword = async (req, res) => {
    const cedula = parseInt(req.params.cedula);
    const { newPassword } = req.body;

    try {
        // 1. Verificamos si el usuario con la cédula existe
        dbConection().query(
            `SELECT COUNT(*) AS count, password FROM usuarios WHERE cedula = ?`,
            [cedula],
            (error, results) => {
                if (error) throw error;

                // 2. Si no se encuentra el usuario
                if (results[0].count <= 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario no encontrado.'
                    });
                }

                // 3. Si el usuario existe, hasheamos la nueva contraseña
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al hashear la contraseña.'
                        });
                    }

                    // 4. Actualizamos la contraseña en la base de datos
                    dbConection().query(
                        `UPDATE usuarios SET password = ? WHERE cedula = ?`,
                        [hashedPassword, cedula],
                        (updateError, updateResults) => {
                            if (updateError) throw updateError;

                            return res.json({
                                ok: true,
                                msg: 'Contraseña cambiada exitosamente.'
                            });
                        }
                    );
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};


module.exports = {
    validarCedula,
    primerAcceso,
    validarCredenciales,
    changePassword
} 