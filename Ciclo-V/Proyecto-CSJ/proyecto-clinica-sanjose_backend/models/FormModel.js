class FormModel {
    constructor({ nombre, autor, fechacreacion, fecha_ult_mod, archivo, historia_id }) {
        this.archivo = archivo;
        this.fechacreacion = fechacreacion;
        this.fecha_ult_mod = fecha_ult_mod;
        this.nombre = nombre;
        this.autor = autor;
        this.historia_id = historia_id;
    }
}

module.exports = FormModel;
