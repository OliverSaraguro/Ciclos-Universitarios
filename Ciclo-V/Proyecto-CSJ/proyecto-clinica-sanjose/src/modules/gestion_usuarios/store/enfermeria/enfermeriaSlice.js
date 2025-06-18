import { createSlice } from '@reduxjs/toolkit';

export const enfermeriaSlice = createSlice({
    name: 'enfermeria',
    initialState: {
        resp: {}, // { ok: true/false, list: [registers] }
        isLoading: true,
        activeRegister: {}
    },
    reducers: {
        setActiveRegister: (state, { payload }) => {
            state.activeRegister = payload;
        },
        getRegisters: (state, { payload } ) => {
            state.isLoading = false;
            state.resp = payload;
        },
        appLogout: (state) => {
            state.resp = {};
            state.isLoading = true;
            state.activeRegister = {};
        }
    }
});


export const { setActiveRegister, getRegisters, appLogout } = enfermeriaSlice.actions;