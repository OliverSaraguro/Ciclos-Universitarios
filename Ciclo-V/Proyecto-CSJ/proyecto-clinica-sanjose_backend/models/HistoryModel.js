class HistoryModel {
    constructor({ archivo, fechacreacion, fecha_ult_mod, nroforms, estado, paciente }) {
        this.archivo = archivo;
        this.fechacreacion = fechacreacion;
        this.fecha_ult_mod = fecha_ult_mod;
        this.nroforms = nroforms;
        this.estado = estado;
        this.paciente = paciente;
    }
}

module.exports = HistoryModel;
