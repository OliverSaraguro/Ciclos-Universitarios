const FormModel = require("../models/FormModel");
const HistoryModel = require("../models/HistoryModel");
const PacienteModel = require("../models/PacienteModel");
const { dbConection } = require('../database/config');

const searchByCed = async (req, res) => {
    const patCed = parseInt(req.params.patCed);

    try {

        dbConection().query(
            `SELECT COUNT(*) AS count, rol FROM usuarios WHERE cedula = ?`,
            [patCed],
            (error, results) => {
                if (error) throw error;

                // Si no se encuentra el usuario 
                if (results[0].count <= 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Paciente no encontrado.'
                    });
                }

                // Si el usuario es personal hospitalario
                if (results[0].rol !== 'patient') {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se puede registrar personal hospitalario como pacientes.'
                    });
                }

                dbConection().query(
                    `
                    SELECT
                    u.id,
                    u.nombres,
                    u.email,
                    p.tipo_sangre,
                    p.sexo,
                    p.cedula,
                    p.estado_civil as estadoCivil,
                    p.lugar_nac as lugarnac,
                    DATE_FORMAT(p.fecha_nac, '%Y-%m-%d') AS fechanac,
                    u.contacto
                    FROM pacientes p
                    JOIN usuarios u ON p.cedula = u.cedula
                    WHERE p.cedula = ?;

            `, [patCed],
                    (error, results, fields) => {
                        if (error) throw error;

                        res.json({
                            ok: true,
                            resp: results,
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

const crearHistoria = async (req, res) => {
    const historia = new HistoryModel(req.body);

    try {
        // Obtener el próximo id para el paciente
        dbConection().query(
            `
            SELECT IFNULL(MAX(id), 0) + 1 AS nextId
            FROM historias_clinicas
            WHERE paciente = ?;
            `,
            [historia.paciente],
            (error, results) => {
                if (error) throw error;

                const nextId = results[0].nextId;

                // Insertar la nueva historia clínica
                dbConection().query(
                    `
                    INSERT INTO historias_clinicas (id, archivo, fechacreacion, fecha_ult_mod, estado, paciente, nroforms)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                    `,
                    [nextId, historia.archivo, historia.fechacreacion, historia.fecha_ult_mod, historia.estado, historia.paciente, historia.nroforms],
                    (error, results) => {
                        if (error) throw error;

                        // Obtener el unique_id generado para la historia clínica
                        dbConection().query(
                            `
                            SELECT hc.unique_id  FROM historias_clinicas hc WHERE paciente = ? AND id = ?;
                            `,
                            [historia.paciente, nextId],  // Usamos el nextId que acabamos de insertar
                            (error, results) => {
                                if (error) throw error;

                                const uniqueId = results[0].unique_id;

                                // Devolver el unique_id generado
                                res.json({
                                    ok: true,
                                    msg: 'Historia creada correctamente',
                                    id: uniqueId, // Aquí devuelves el unique_id
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


const crearFormulario = async (req, res) => {
    const formulario = new FormModel(req.body);
    try {
        // Insertar el formulario nuevo
        dbConection().query(
            `
                    INSERT INTO formularios VALUES (null, ?, ?, ?, ?, ?, ?);
                    `,
            [formulario.nombre, formulario.autor, formulario.fechacreacion, formulario.fecha_ult_mod, formulario.archivo, formulario.historia_id],
            (error, results) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    msg: 'Formulario creado correctamente'
                });
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

const crearPaciente = async (req, res) => {
    const paciente = new PacienteModel(req.body);

    try {
        // Verificar si la cédula ya existe en la tabla Usuarios
        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [paciente.cedula],
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
                    VALUES (?, ?, ?, ?, 'patient', ?);
                    `,
                    [paciente.cedula, paciente.nombres, paciente.email, paciente.cedula, paciente.contacto],
                    (error, results) => {
                        if (error) throw error;

                        // Insertar en la tabla Pacientes
                        dbConection().query(
                            `
                            INSERT INTO pacientes VALUES (?, ?, ?, ?, ?, ?);
                            `,
                            [paciente.cedula, paciente.tipo_sangre, paciente.sexo, paciente.fechanac, paciente.estadoCivil, paciente.lugarnac],
                            (error) => {
                                if (error) throw error;

                                res.json({
                                    ok: true,
                                    msg: 'Usuario registrado correctamente',
                                    type: 'patient'
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

const actualizarPaciente = async (req, res) => {
    const paciente = new PacienteModel(req.body);

    try {
        // Verificar si el paciente con la cédula existe en la tabla `usuarios`
        dbConection().query(
            `SELECT COUNT(*) AS count FROM usuarios WHERE cedula = ?`,
            [paciente.cedula],
            (error, results) => {
                if (error) throw error;

                if (results[0].count === 0) {
                    // Si la cédula no existe, devolver un error
                    return res.status(404).json({
                        ok: false,
                        msg: 'Paciente no encontrado.'
                    });
                }

                // Actualizar información en la tabla `usuarios`
                dbConection().query(
                    `
                    UPDATE usuarios
                    SET nombres = ?, email = ?, contacto = ?
                    WHERE cedula = ?;
                    `,
                    [paciente.nombres, paciente.email, paciente.contacto, paciente.cedula],
                    (error) => {
                        if (error) throw error;

                        // Actualizar información en la tabla `pacientes`
                        dbConection().query(
                            `
                            UPDATE pacientes
                            SET tipo_sangre = ?, sexo = ?, fecha_nac = ?, estado_civil = ?, lugar_nac = ?
                            WHERE cedula = ?;
                            `,
                            [paciente.tipo_sangre, paciente.sexo, paciente.fechanac, paciente.estadoCivil, paciente.lugarnac, paciente.cedula],
                            (error) => {
                                if (error) throw error;

                                res.json({
                                    ok: true,
                                    msg: 'Paciente actualizado correctamente',
                                    type: 'patient'
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


module.exports = {
    searchByCed,
    crearHistoria,
    crearFormulario,
    crearPaciente,
    actualizarPaciente,
} 