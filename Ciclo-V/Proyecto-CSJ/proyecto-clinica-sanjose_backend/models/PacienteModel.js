class PacienteModel {
    constructor({ cedula, tipo_sangre, sexo, fechanac, lugarnac, estadoCivil, nombres, contacto, email }) {
        this.cedula = cedula;
        this.nombres = nombres;
        this.tipo_sangre = tipo_sangre;
        this.contacto = contacto;
        this.email = email; 
        this.sexo = sexo;
        this.fechanac = fechanac;
        this.lugarnac = lugarnac;
        this.estadoCivil = estadoCivil;
    }
}

module.exports = PacienteModel;
