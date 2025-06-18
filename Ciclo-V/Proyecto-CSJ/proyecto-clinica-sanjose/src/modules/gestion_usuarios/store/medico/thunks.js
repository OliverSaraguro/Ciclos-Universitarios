import Swal from "sweetalert2";
import api from "../../../../api/api";
import { addRegister, appLogout, getRegisters, setActiveRegister } from "./medicoSlice";



export const startSetActiveRegister = (activeRegister) => {
    return async (dispatch) => {
        dispatch(setActiveRegister(activeRegister));
    }
}

export const startLogoutApp = () => {
    return async (dispatch) => {
        dispatch(appLogout());
    }
}

export const startLoadingDoctorPats = () => {
    return async (dispatch, getState) => {

        try {
            // Obtener del backend
            const { resp: auth } = getState().auth; // Usurio que esta en la sesion actual (doctor)
            const { data } = await api.get(`medico/pats/${auth.user.cedula}`); // Obtener los pacientes de este doctor con esta cedula
            dispatch(getRegisters(data));

        } catch (error) {
            console.error(error);
        }

    }
}

export const startSearchPat = (patient_ced) => {
    return async (dispatch) => {
        try {

            // Buscar
            const { data } = await api.get(`medico/pat/${parseInt(patient_ced)}`); // Obtener el paciente con la cedula que se requiere
            dispatch(setActiveRegister(data.results[0]));

        } catch (error) {
            // console.error(error);
            dispatch(setActiveRegister('Error, no se ha encontrado ese paciente'));
        }
    }
}

export const startAddDoctorPat = () => {
    return async (dispatch, getState) => {

        try {

            // Añdir
            const { activeRegister } = getState().medico; // Paciente activo
            const { resp: authResp } = getState().auth; // Usurio que esta en la sesion actual (doctor)
            await api.put(`medico/${activeRegister.cedula}`, { cedula_doc: parseInt(authResp.user.cedula) }); // Añadir este paciente a la lista de pacientes del doctor
            dispatch(addRegister(activeRegister));

            Swal.fire({
                title: "¡Asignado!",
                text: `El paciente con numero de cédula ${activeRegister.cedula} se te ha asignado formalmente`,
                icon: "success"
            });

        } catch (err) {
            const errorMessage = await err.response.data.msg;
            await Swal.fire('Error', errorMessage, 'error');
        }
    }
}