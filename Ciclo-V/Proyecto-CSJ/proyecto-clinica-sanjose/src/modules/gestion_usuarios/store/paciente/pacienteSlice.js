import { createSlice } from '@reduxjs/toolkit';

export const pacienteSlice = createSlice({
    name: 'paciente',
    initialState: {
        activeRegister: {}
    },
    reducers: {
        setActiveRegister: (state, { payload }) => {
            state.activeRegister = payload;
        },
        appLogout: (state) => {
            state.resp = {};
            state.isLoading = true;
            state.activeRegister = {};
        }
    }
});


export const { setActiveRegister, appLogout } = pacienteSlice.actions;