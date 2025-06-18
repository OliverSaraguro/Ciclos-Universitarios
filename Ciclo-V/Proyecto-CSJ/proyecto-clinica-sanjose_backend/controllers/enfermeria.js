const { dbConection } = require('../database/config');

const getPatients = async (req, res) => {

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
                    WHERE u.rol = 'patient';

            `, (error, results, fields) => {
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


module.exports = {
    getPatients
} 