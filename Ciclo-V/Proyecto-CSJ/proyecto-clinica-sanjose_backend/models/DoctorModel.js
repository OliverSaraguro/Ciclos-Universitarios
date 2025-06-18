class DoctorModel {
    constructor({ cedula, nombres, especialidad, contacto, email, registro }) {
        this.cedula = cedula;
        this.nombres = nombres;
        this.especialidad = especialidad;
        this.contacto = contacto;
        this.email = email; 
        this.registro = registro;
    }
}

module.exports = DoctorModel;
