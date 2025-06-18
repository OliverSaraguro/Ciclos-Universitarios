import { createSlice } from '@reduxjs/toolkit';

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        resp: {}, // { ok: true/false, results: [registers], type: 'doctors, nurses, patients ' }
        isLoading: true,
        activeRegister: {},
    },
    reducers: {
        setIsLoading: (state) => {
            state.isLoading = true;
        },
        setActiveRegister: (state, { payload }) => {
            state.activeRegister = payload;
        },
        getRegisters: (state, { payload } ) => {
            state.isLoading = false;
            state.resp = payload;
        },
        addRegister: (state, { payload }) => {
            state.resp.results.push(payload);
            state.activeRegister = null;
        },
        editRegister: (state, { payload }) => {
            state.resp.results = state.resp.results.map( reg => {
                if (reg.id === payload.id) {
                    return payload;
                }

                return reg;
            });

            state.activeRegister = payload;
        },
        deleteRegister: (state, { payload }) => {
            state.resp.results = state.resp.results.filter( reg => reg.cedula !== payload );
            state.activeRegister = {};
        },
        appLogout: (state) => {
            state.resp = {};
            state.isLoading = true;
            state.activeRegister = {};
        }


    }
});


export const { setActiveRegister, setIsLoading, getRegisters, editRegister, deleteRegister, addRegister, appLogout } = adminSlice.actions;