import Swal from "sweetalert2";
import api from "../../../api/api";
import { setEmergenciaFormData, setNormalFormData, setPaciente } from "./prehospitalarioSlice";

export const startSetPatient = (paciente) => {
    return async (dispatch) => {
        dispatch(setPaciente(paciente))
    }
};

export const startSetNormalFormData = (data) => {
    return async (dispatch) => {
        dispatch(setNormalFormData(data))
    }
};

export const startSetEmergenciaFormData = (data) => {
    return async (dispatch) => {
        dispatch(setEmergenciaFormData(data))
    }
};


export const startSearchPatient = (cedula) => {
    return async (dispatch) => {
        try {

            const { data } = await api.get(`ingreso/${cedula}`);
            dispatch(setPaciente(data.resp[0]));

        } catch (err) {
            console.error(err);
            const errorMessage = await err.response.data.msg;
            if (errorMessage === 'No se puede registrar personal hospitalario como pacientes.') {
                await Swal.fire('Errro de registro', errorMessage, 'error');
                dispatch(setPaciente(errorMessage));
                return;
            }
            dispatch(setPaciente({
                nombres: '',
                sexo: '',
                cedula: '',
                fechanac: '',
                lugarnac: '',
                estadoCivil: '',
                email: '',
                contacto: '',
                tipo_sangre: ''
            }));


        }

    }
}


export const startAddHistory = (history) => {
    return async () => {
        try {
            const { data } = await api.post('ingreso/historia', history);

            // Retornar el id de la nueva historia
            return data.id;
        } catch (err) {
            console.error(err);
            throw new Error('Error al agregar la historia');
        }
    }
}


export const startAddForm = (form) => {
    return async () => {
        try {

            await api.post('ingreso/formulario', form);

        } catch (err) {
            console.error(err);
        }

    }
}

export const startAddPatient = (patient) => {
    return async () => {
        try {
            // Si tiene no tiene ID, entonces se debe crear un nuevo paciente
            if (!patient.id) {
                await api.post(`ingreso/paciente`, patient);
                return;
            } else {
                await api.put(`ingreso/paciente`, patient);
                return;
            }

        } catch (err) {
            console.log(err);/* 
            const { data } = err.response;
            let errorMessages = '';

            if (data.errors) {
                errorMessages = Object.values(data.errors)
                    .map(error => `<li>${error.msg}</li>`)
                    .join('');
                errorMessages = `<ul>${errorMessages}</ul>`;
            } else if (data.msg) {
                errorMessages = `<p>${data.msg}</p>`;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: errorMessages
            }); */
        }

    }
}

