import { createSlice } from '@reduxjs/toolkit';

export const medicoSlice = createSlice({
    name: 'medico',
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
        addRegister: (state, { payload }) => {
            state.resp.results.push(payload);
            state.activeRegister = payload;
        },
        appLogout: (state) => {
            state.resp = {};
            state.isLoading = true;
            state.activeRegister = {};
        }


    }
});


export const { setActiveRegister, getRegisters, addRegister, appLogout } = medicoSlice.actions;