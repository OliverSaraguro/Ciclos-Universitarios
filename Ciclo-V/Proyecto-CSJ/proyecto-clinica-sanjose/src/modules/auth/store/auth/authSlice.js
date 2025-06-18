import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'not-auth', // 'auth', 'not-auth' , 'checking', 'reset-password'
        resp: {}, // { ok: true/false, user: { ..., rol: 'admin'/'doctor'/'nurse'/'recepcionist'/'patient', cedula:.., id: .., email: .., nombres: ..  },  }
    },
    reducers: {
        onChecking: (state) => {
            state.status = 'checking';
            state.resp = {};
        },

        onLogin: (state, { payload }) => {
            state.status = 'auth';
            state.resp = payload;
        },

        onLogout: (state, { payload }) => {
            state.status = 'not-auth';
            state.resp = {};
        }
        
    }
});


export const { onChecking, onLogin, onLogout } = authSlice.actions;