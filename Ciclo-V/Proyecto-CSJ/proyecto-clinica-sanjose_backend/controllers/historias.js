const { dbConection } = require('../database/config');

const getHistoria = async (req, res) => {
    const patCed = parseInt(req.params.patientCed);

    try {
        dbConection().query(
            `SELECT COUNT(*) AS count, rol FROM usuarios WHERE cedula = ?`,
            [patCed],
            (error, results) => {
                if (error) throw error;

                if (results[0].count <= 0 || results[0].rol !== 'patient') {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Paciente no encontrado.',
                    });
                }

                dbConection().query(
                    `SELECT u.nombres, p.cedula 
                     FROM pacientes p 
                     JOIN usuarios u ON p.cedula = u.cedula 
                     WHERE p.cedula = ?`,
                    [patCed],
                    (error, patientResults) => {
                        if (error) throw error;

                        const patient = {
                            cedula: patientResults[0].cedula,
                            nombres: patientResults[0].nombres,
                        };

                        dbConection().query(
                            `SELECT
                                hc.id,
                                hc.unique_id,
                                hc.archivo,
                                hc.nroforms,
                                DATE_FORMAT(hc.fechacreacion, '%Y-%m-%d') AS fechacreacion,
                                DATE_FORMAT(hc.fecha_ult_mod, '%Y-%m-%d') AS fecha_ult_mod,
                                hc.estado
                             FROM historias_clinicas hc
                             WHERE paciente = ?;`,
                            [patCed],
                            (error, historyResults) => {
                                if (error) throw error;

                                const histories = historyResults.map(history => ({
                                    id: history.id,
                                    unique_id: history.unique_id,
                                    archivo: history.archivo,
                                    nroforms: history.nroforms,
                                    fechacreacion: history.fechacreacion,
                                    fecha_ult_mod: history.fecha_ult_mod,
                                    estado: history.estado,
                                    formularios: [],
                                }));

                                const historyIds = histories.map(h => h.unique_id);

                                if (historyIds.length > 0) {
                                    dbConection().query(
                                        `SELECT 
                                            nombre,
                                            autor,
                                            DATE_FORMAT(fechacreacion, '%Y-%m-%d') AS fecha_creacion,
                                            DATE_FORMAT(fecha_ult_mod, '%Y-%m-%d') AS fecha_ult_mod,
                                            archivo,
                                            historia_id
                                         FROM formularios
                                         WHERE historia_id IN (?)`,
                                        [historyIds],
                                        (error, formResults) => {
                                            if (error) throw error;

                                            formResults.forEach(form => {
                                                const history = histories.find(h => h.unique_id === form.historia_id);
                                                if (history) {
                                                    history.formularios.push({
                                                        nombre: form.nombre,
                                                        autor: form.autor,
                                                        fecha_creacion: form.fecha_creacion,
                                                        fecha_ult_mod: form.fecha_ult_mod,
                                                        archivo: form.archivo,
                                                    });
                                                }
                                            });

                                            res.json({
                                                ok: true,
                                                patient,
                                                histories,
                                            });
                                        }
                                    );
                                } else {
                                    res.json({
                                        ok: true,
                                        patient,
                                        histories,
                                    });
                                }
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
            msg: 'ERROR: ' + error,
        });
    }
};



const actualizarHistoria = async (req, res) => {
    const historyId = parseInt(req.params.histid);
    const { archivo, fechacreacion, fecha_ult_mod, nroforms, estado, formularios } = req.body;

    try {
        // Actualizar la historia clínica
        await new Promise((resolve, reject) => {
            dbConection().query(
                `UPDATE historias_clinicas
                 SET archivo = ?, fechacreacion = ?, fecha_ult_mod = ?, nroforms = ?, estado = ?
                 WHERE unique_id = ?;`,
                [archivo, fechacreacion, fecha_ult_mod, nroforms, estado, historyId],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        // Procesar cada formulario individualmente
        for (const formulario of formularios) {
            // Buscar un formulario existente por nombre y historia_id
            const existingForm = await new Promise((resolve, reject) => {
                dbConection().query(
                    `SELECT * FROM formularios WHERE nombre = ? AND historia_id = ?`,
                    [formulario.nombre, historyId],
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results[0]); // Devuelve el primer resultado (si existe)
                    }
                );
            });

            if (existingForm) {
                // Si existe, actualizamos el formulario
                await new Promise((resolve, reject) => {
                    dbConection().query(
                        `UPDATE formularios
                         SET autor = ?, fecha_ult_mod = ?, archivo = ?
                         WHERE id = ?`,
                        [formulario.autor, formulario.fecha_ult_mod, formulario.archivo, existingForm.id],
                        (error, results) => {
                            if (error) return reject(error);
                            resolve(results);
                        }
                    );
                });
            } else {
                // Si no existe, lo insertamos como un nuevo formulario
                await new Promise((resolve, reject) => {
                    dbConection().query(
                        `INSERT INTO formularios (nombre, autor, fechacreacion, fecha_ult_mod, archivo, historia_id)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [formulario.nombre, formulario.autor, formulario.fecha_creacion, formulario.fecha_ult_mod, formulario.archivo, historyId],
                        (error, results) => {
                            if (error) return reject(error);
                            resolve(results);
                        }
                    );
                });
            }
        }

        res.json({
            ok: true,
            msg: 'Historia clínica y formularios actualizados correctamente.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR: ' + error,
        });
    }
};


module.exports = {
    getHistoria,
    actualizarHistoria,
} 