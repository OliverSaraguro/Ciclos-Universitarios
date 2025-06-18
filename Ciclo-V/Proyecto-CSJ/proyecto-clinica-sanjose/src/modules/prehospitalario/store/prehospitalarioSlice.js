import { createSlice } from '@reduxjs/toolkit';

export const prehospitalarioSlice = createSlice({
    name: 'prehospitalario',
    initialState: {
        paciente: {
            nombres: '',
            sexo: '',
            cedula: '',
            fechanac: '',
            lugarnac: '',
            estadoCivil: '',
            email: '',
            contacto: '',
            tipo_sangre: ''
        },
        normalFormData: {},
        emergenciaFormData: {},
    },
    reducers: {
        setPaciente: (state, { payload }) => {
            state.paciente = payload;
        },
        setNormalFormData: (state, { payload }) => {
            state.normalFormData = payload;
        },
        setEmergenciaFormData: (state, { payload }) => {
            state.emergenciaFormData = payload;
        },
    }
});


export const { setPaciente, setEmergenciaFormData, setNormalFormData } = prehospitalarioSlice.actions;
