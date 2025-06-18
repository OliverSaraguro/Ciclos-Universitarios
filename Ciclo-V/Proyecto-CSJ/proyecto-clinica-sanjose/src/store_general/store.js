import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../modules/auth/store/auth/authSlice";
import { adminSlice } from "../modules/gestion_usuarios/store/admin/adminSlice";
import { historySlice } from "../modules/historias_clinicas/store/historySlice";
import { medicoSlice } from "../modules/gestion_usuarios/store/medico/medicoSlice";
import { enfermeriaSlice } from "../modules/gestion_usuarios/store/enfermeria/enfermeriaSlice";
import { pacienteSlice } from "../modules/gestion_usuarios/store/paciente/pacienteSlice";
import { prehospitalarioSlice } from "../modules/prehospitalario/store/prehospitalarioSlice";

export const store = configureStore({
    reducer: {
        auth:            authSlice.reducer,
        admin:           adminSlice.reducer,
        medico:          medicoSlice.reducer,
        enfermeria:      enfermeriaSlice.reducer,
        paciente:        pacienteSlice.reducer,
        history:         historySlice.reducer,
        prehospitalario: prehospitalarioSlice.reducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});