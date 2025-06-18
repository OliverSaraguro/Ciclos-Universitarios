import Swal from "sweetalert2";
import { appLogout } from "../../../historias_clinicas/store/historySlice";
import { onChecking, onLogin, onLogout } from "./authSlice";
import api from "../../../../api/api";

export const startLogin = ({ password, cedula, navigate }) => {

    return async (dispatch) => {

        try {

            if (password === '') {
                const { data } = await api.get(`auth/validateCedula/${cedula}`);
                // Si todo sale bien
                dispatch(onLogin(data));

            } else {
                const { data } = await api.post('auth/validateCredenciales', { cedula, password });
                // Obligar cambio de contraseña en caso de ser la primera vez que se accede
                if (data.user.password && (parseInt(data.user.password) === parseInt(data.user.cedula))) {
                    // Llevar a pagina de cambio de contraseña
                    navigate('/auth/resetPassword', { state: data.user.cedula });
                    return;
                } else {
                    dispatch(onLogin(data));
                }
            }


        } catch (err) {
            const errorMessage = err.response.data.msg;
            console.log(errorMessage);
            Swal.fire('Error al iniciar sesión', errorMessage, 'info');
            dispatch(onLogout());

        }
    }
}

export const startChangePassword = (newPassword, cedula) => {
    return async (dispatch) => {
        try {
            // dispatch(onChecking());
            await api.put(`auth/changePassword/${cedula}`, { newPassword });
            // Si todo sale bien logearse
            const { data } = await api.get(`auth/primerAcceso/${parseInt(cedula)}`);
            // Simulacion de respuesta exitosa
            /* const data = {
                ok: true,
                user: {
                    id: 1,
                    nombres: 'Luis Mora',
                    cedula: '123102',
                    email: 'johndoe@example.com',
                    rol: 'doctor',  // doctor, nurse, patient, admin, recepcionist
                }
            } */
            dispatch(onLogin(data)); 


        } catch (err) {
            const errorMessage = err.response.data.msg;
            console.log(err);
            Swal.fire('Error al iniciar sesión', errorMessage, 'info');
            dispatch(onLogout());
        }
    }
}

export const startLogout = () => {
    return async (dispatch) => {
        dispatch(appLogout());
        dispatch(onLogout());
    }
}