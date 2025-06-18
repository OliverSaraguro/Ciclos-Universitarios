const { dbConection } = require('../database/config');

const getPatients = async (req, res) => {
    const docCed = parseInt(req.params.doctorCed);

    try {
        dbConection().query(
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
            FROM pacientes p
            JOIN usuarios u ON p.cedula = u.cedula
            JOIN pacientes_medicos pm ON pm.paciente_cedula = p.cedula
            WHERE pm.medico_cedula = ?;

            `, [docCed],
            (error, results, fields) => {
                if (error) throw error;

                res.json({
                    ok: true,
                    results,
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

const getPatientByCed = async (req, res) => {
    const patCed = parseInt(req.params.patCed);

    try {

        dbConection().query(
            `SELECT COUNT(*) AS count, rol FROM usuarios WHERE cedula = ?`,
            [patCed],
            (error, results) => {
                if (error) throw error;

                // Si no se encuentra el usuario o el rol no es 'patient'
                if (results[0].count <= 0 || results[0].rol !== 'patient') {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Paciente no encontrado.'
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
                    DATE_FORMAT(p.fecha_nac, '%d/%m/%Y') AS fechanac,
                    TIMESTAMPDIFF(YEAR, p.fecha_nac, CURDATE()) AS edad,
                    u.contacto
                    FROM pacientes p
                    JOIN usuarios u ON p.cedula = u.cedula
                    WHERE p.cedula = ?;

            `, [patCed],
                    (error, results, fields) => {
                        if (error) throw error;

                        res.json({
                            ok: true,
                            results,
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


const agregarPaciente = async (req, res) => {
    const cedula_paciente = parseInt(req.params.patCed); // Cedula del paciente
    const { cedula_doc } = req.body;  // Cedula del doctor

    try {
        // Verificar si el paciente ya está registrado
        dbConection().query(
            `SELECT COUNT(*) AS count FROM pacientes WHERE cedula = ?`,
            [cedula_paciente],
            (error, results) => {
                if (error) throw error;

                if (results[0].count === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El paciente no está registrado.'
                    });
                }

                // Verificar si el doctor existe
                dbConection().query(
                    `SELECT COUNT(*) AS count FROM medicos WHERE cedula = ?`,
                    [cedula_doc],
                    (error, results) => {
                        if (error) throw error;

                        if (results[0].count === 0) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'El doctor con esta cédula no existe.'
                            });
                        }

                        // Verificar si ya existe la relación en la tabla intermedia
                        dbConection().query(
                            `SELECT COUNT(*) AS count FROM pacientes_medicos WHERE paciente_cedula = ? AND medico_cedula = ?`,
                            [cedula_paciente, cedula_doc],
                            (error, results) => {
                                if (error) throw error;

                                if (results[0].count > 0) {
                                    return res.status(400).json({
                                        ok: false,
                                        msg: 'Este paciente ya está asignado a este doctor.'
                                    });
                                }

                                // Insertar la relación en la tabla intermedia
                                dbConection().query(
                                    `
                                    INSERT INTO pacientes_medicos (paciente_cedula, medico_cedula, fecha_asignacion)
                                    VALUES (?, ?, ?);
                                    `,
                                    [cedula_paciente, cedula_doc, new Date()],
                                    (error) => {
                                        if (error) throw error;

                                        res.json({
                                            ok: true,
                                            msg: 'Paciente asignado correctamente al doctor'
                                        });
                                    }
                                );
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
    getPatients,
    getPatientByCed,
    agregarPaciente,
} 