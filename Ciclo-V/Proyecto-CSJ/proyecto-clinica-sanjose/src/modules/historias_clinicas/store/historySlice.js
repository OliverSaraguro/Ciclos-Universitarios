import { createSlice } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  /*
    ok: true/false,
    patient: { cedula: ..., nombres: ... },
    histories: [
    {
      id: 1,
      archivo: "archivo.excel",
      fechacreacion: "2024-01-01",
      fecha_ult_mod: "2024-02-01",
      nroforms: 4,
      estado: "enEspera", // activa, cerrada
      formularios: [
        {
          nombre: "Ingreso Prehospitalario", // Nombre o tipo es lo mismo
          autor: "Dr. Pete Rodriguez",
          fecha_creacion: "2024-01-01",
          fecha_ult_mod: "2024-01-01",
          archivo: "archivo.excel",
        },
        ...
      ],
    },
    {
      id: 2,
      archivo: "archivopdf2",
      fechacreacion: "2024-03-01",
      fecha_ult_mod: "2024-03-15",
      nroforms: 2,
      estado: "enEspera", // activa, cerrada
      formularios: [....
    },
    ...,
 ]
        */
  initialState: {
    resp: {
      ok: false,
      histories: [], 
    },
    onLoading: true,
    activeHistory: {},
    activeForm: {},
    error: "",
  },

  reducers: {
    setActiveHistory: (state, { payload }) => {
      state.activeHistory = payload;
    },

    setActiveForm: (state, { payload }) => {
      state.activeForm = payload;
    },

    setError: (state, { payload }) => {
      state.error = payload;
    },

    loadingOn: (state) => {
      state.onLoading = true;
    },

    loadingOff: (state) => {
      state.onLoading = false;
    },

    getHistories: (state, { payload }) => {
      state.resp = payload;
    },

    updateHistory: (state, { payload }) => {
      state.resp.histories = state.resp.histories.map((h) => {
        if (h.id === payload.id) {
          return payload;
        }

        return h;
      });

      state.activeHistory = payload;
    },

    appLogout: (state) => {
      state.resp = {};
      state.onLoading = true;
      state.activeHistory = {};
      state.error = "";
    }
  },
});

export const {
  setActiveHistory,
  setActiveForm,
  setError,
  loadingOn,
  loadingOff,
  getHistories,
  updateHistory,
  appLogout,
} = historySlice.actions;
