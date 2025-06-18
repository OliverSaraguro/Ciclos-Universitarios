const DoctorModel = require('../models/DoctorModel');
const { dbConection } = require('../database/config');
const Nurse_RecepcionistModel = require('../models/Nurse_RecepcionistModel');

const getDoctors = async (req, res) => {

    try {
        await dbConection().query(
            `
            SELECT
            u.id,
            u.nombres,
            u.email,
            m.especialidad,
            u.cedula,
            u.contacto,
            m.registro
            FROM
            usuarios u
            JOIN
            medicos m ON u.cedula = m.cedula;
            `,
            (error, results, fields) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    results,
                    type: 'doctors'
                });
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};

const getNurses = async (req, res) => {

    try {
        await dbConection().query(
            `
            SELECT
            id,
            nombres,
            email,
            cedula,
            contacto
            FROM
            usuarios
            WHERE rol = 'nurse';
            `,
            (error, results, fields) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    results,
                    type: 'nurses'
                });
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};

const getRecepcionists = async (req, res) => {

    try {
        await dbConection().query(
            `
            SELECT
            id,
            nombres,
            email,
            cedula,
            contacto
            FROM
            usuarios
            WHERE rol = 'recepcionist';
            `,
            (error, results, fields) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    results,
                    type: 'recepcionists'
                });
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};

const getPatients = async (req, res) => {

    try {
        await dbConection().query(
            `
            SELECT
            u.id,
            u.nombres,
            u.email,
            p.tipo_sangre,
            p.sexo,
            p.cedula,
            DATE_FORMAT(p.fecha_nac, '%d/%m/%Y') AS fechanac,
            TIMESTAMPDIFF(YEAR, p.fecha_nac, CURDATE()) AS edad,
            u.contacto
            FROM
            pacientes p
            JOIN
            usuarios u ON p.cedula = u.cedula;
            `,
            (error, results, fields) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    results,
                    type: 'patients'
                });
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error
        });
    }
};



const crearDoctors = async (req, res) => {
    const doctor = new DoctorModel(req.body);

    try {
        // Verificar si la cédula ya existe en la tabla Usuarios
        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [doctor.cedula],
            (error, results) => {
                if (error) throw error;

                if (results[0].count > 0) {
                    // Si la cédula ya existe, lanzar un error
                    return res.status(400).json({
                        ok: false,
                        msg: 'La cédula ya está registrada.'
                    });
                }

                // Si la cédula no existe, proceder con la inserción
                dbConection().query(
                    `
                    INSERT INTO usuarios (cedula, nombres, email, password, rol, contacto)
                    VALUES (?, ?, ?, ?, 'doctor', ?);
                    `,
                    [doctor.cedula, doctor.nombres, doctor.email, doctor.cedula, doctor.contacto],
                    (error, results) => {
                        if (error) throw error;

                        const usuarioId = results.insertId; // ID generado en Usuarios

                        // Insertar en la tabla Medicos
                        dbConection().query(
                            `
                            INSERT INTO medicos (cedula, especialidad, registro)
                            VALUES (?, ?, ?);
                            `,
                            [doctor.cedula, doctor.especialidad, doctor.registro],
                            (error) => {
                                if (error) throw error;

                                res.json({
                                    ok: true,
                                    msg: 'Usuario registrado correctamente',
                                    id: usuarioId,
                                    type: 'doctor'
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error.message
        });
    }
};


const crearNurses = async (req, res) => {
    const nurse = new Nurse_RecepcionistModel(req.body);

    try {
        // Verificar si la cédula ya existe en la tabla Usuarios
        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [nurse.cedula],
            (error, results) => {
                if (error) throw error;

                if (results[0].count > 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La cédula ya está registrada.'
                    });
                }

                // Insertar en la tabla Usuarios
                dbConection().query(
                    `
                    INSERT INTO usuarios (cedula, nombres, email, password, rol, contacto)
                    VALUES (?, ?, ?, ?, 'nurse', ?);
                    `,
                    [nurse.cedula, nurse.nombres, nurse.email, nurse.cedula, nurse.contacto],
                    (error, results) => {
                        if (error) throw error;

                        const usuarioId = results.insertId;

                        res.json({
                            ok: true,
                            msg: 'Usuario registrado correctamente',
                            id: usuarioId,
                            type: 'nurse'
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error.message
        });
    }
};

const crearRecepcionists = async (req, res) => {
    const recepcionist = new Nurse_RecepcionistModel(req.body);

    try {
        // Verificar si la cédula ya existe en la tabla Usuarios
        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [recepcionist.cedula],
            (error, results) => {
                if (error) throw error;

                if (results[0].count > 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La cédula ya está registrada.'
                    });
                }

                // Insertar en la tabla Usuarios
                dbConection().query(
                    `
                    INSERT INTO usuarios (cedula, nombres, email, password, rol, contacto)
                    VALUES (?, ?, ?, ?, 'recepcionist', ?);
                    `,
                    [recepcionist.cedula, recepcionist.nombres, recepcionist.email, recepcionist.cedula, recepcionist.contacto],
                    (error, results) => {
                        if (error) throw error;

                        const usuarioId = results.insertId;

                        res.json({
                            ok: true,
                            msg: 'Usuario registrado correctamente',
                            id: usuarioId,
                            type: 'recepcionist'
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error.message
        });
    }
};



const actualizarRegistro = async (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedData = req.body;

    try {
        // Buscar si existe el usuario
        const user = await new Promise((resolve, reject) => {
            dbConection().query(
                'SELECT * FROM usuarios WHERE id = ?',
                [userId],
                (error, results) => {
                    if (error) reject(error);
                    if (!results || results.length === 0) {
                        reject(new Error('Usuario no encontrado'));
                    }
                    resolve(results[0]);
                }
            );
        });

        const role = user.rol;

        let updateQuery = '';
        let updateValues = [];

        // Dependiendo del rol, se actualiza la tabla correspondiente
        if (role === 'doctor') {
            updateQuery = `
                UPDATE usuarios u
                INNER JOIN medicos m ON u.cedula = m.cedula
                SET 
                    u.nombres = ?,
                    u.email = ?,
                    m.especialidad = ?,
                    u.contacto = ?,
                    m.registro = ?
                WHERE u.id = ?;
            `;
            updateValues = [
                updatedData.nombres,
                updatedData.email,
                updatedData.especialidad,
                updatedData.contacto,
                updatedData.registro,
                userId
            ];
        } else if (role === 'nurse') {
            updateQuery = `
                UPDATE usuarios u
                SET 
                    u.nombres = ?,
                    u.email = ?,
                    u.contacto = ?
                WHERE u.id = ?;
            `;
            updateValues = [
                updatedData.nombres,
                updatedData.email,
                updatedData.contacto,
                userId
            ];
        } else if (role === 'recepcionist') {
            updateQuery = `
                UPDATE usuarios u
                SET 
                    u.nombres = ?,
                    u.email = ?,
                    u.contacto = ?
                WHERE u.id = ?;
            `;
            updateValues = [
                updatedData.nombres,
                updatedData.email,
                updatedData.contacto,
                userId
            ];
        } else if (role === 'patient') {
            updateQuery = `
                UPDATE usuarios u
                INNER JOIN pacientes p ON u.cedula = p.cedula
                SET 
                    u.nombres = ?,
                    u.email = ?,
                    u.contacto = ?,
                    p.sexo = ?,
                    p.tipo_sangre = ?,
                    p.fecha_nac = ?
                WHERE u.id = ?;
            `;
            updateValues = [
                updatedData.nombres,
                updatedData.email,
                updatedData.contacto,
                updatedData.sexo,
                updatedData.tipo_sangre,
                updatedData.fecha_nac,
                userId
            ];
        }

        // Realizar el UPDATE usando Promise
        await new Promise((resolve, reject) => {
            dbConection().query(updateQuery, updateValues, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error.message
        });
    }
};


const eliminarRegistro = async (req, res) => {
    const userId = parseInt(req.params.cedula);

    try {

        // Verificar si la cédula ya existe en la tabla Usuarios
        dbConection().query(
            `SELECT * FROM usuarios WHERE cedula = ?`,
            [userId],
            (error, results) => {
                if (error) throw error;

                if (!results || results.length === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ese usuario no existe'
                    });
                }

                // Insertar en la tabla Usuarios
                dbConection().query('DELETE FROM usuarios WHERE cedula = ?',
                    [userId],
                    (error, results) => {
                        if (error) throw error;

                        res.json({
                            ok: true,
                            msg: 'Usuario eliminado correctamente'
                        });
                    }
                );
            }
        );


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error.message
        });
    }
};


module.exports = {
    getDoctors,
    getNurses,
    getRecepcionists,
    getPatients,
    crearDoctors,
    crearNurses,
    crearRecepcionists,
    actualizarRegistro,
    eliminarRegistro
} 