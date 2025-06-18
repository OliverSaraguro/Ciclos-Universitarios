import api from "../../../../api/api";
import { appLogout, getRegisters, setActiveRegister } from "./enfermeriaSlice";



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

export const startLoadingPats = () => {
    return async (dispatch) => {

        try {
            // Obtener del backend
            const { data } = await api.get('enfermeria/'); 

            // Simulacion de datos para pruebas
            /* const pats = {
                ok: true,
                results: [
                    { id: 7,  nombres: 'Oliver Saraguro', email: 'johndoe@example.com', tipo_sangre: 'A+', sexo: 'Masculino', ult_adm: '2023-10-05', cedula: '1321231', fechanac: '01/01/2004', edad: '18' },
                    { id: 8,  nombres: 'Renato Rojas', email: 'johndoe@example.com', tipo_sangre: 'AB-', sexo: 'Femenino', ult_adm: '2022-12-10', cedula: '1561561', fechanac: '01/01/2004', edad: '20' },
                    { id: 9,  nombres: 'John Doe 3', email: 'johndoe@example.com', tipo_sangre: 'O+', sexo: 'Masculino', ult_adm: '2024-05-30', cedula: '564546', fechanac: '01/01/2004', edad: '55' },
                    { id: 91, nombres: 'Jose de Mora', email: 'johndoe@example.com', tipo_sangre: 'O+', sexo: 'Masculino', ult_adm: '2024-05-30', cedula: '456456', fechanac: '01/01/2004', edad: '55' },
                    { id: 1,  nombres: 'Jose SS', email: 'johndoe@example.com', tipo_sangre: 'C-', sexo: 'Femenino', ult_adm: '2024-05-30', cedula: '4786732', fechanac: '01/01/2004', edad: '55' },
                    { id: 10, nombres: 'Josue C', email: 'johndoe@example.com', tipo_sangre: 'AS+', sexo: 'Femenino', ult_adm: '2024-05-30', cedula: '014683648', fechanac: '01/01/2004', edad: '55' },
                ]
            } */
            dispatch(getRegisters(data));

        } catch (error) {
            console.error(error);
        }

    }
}