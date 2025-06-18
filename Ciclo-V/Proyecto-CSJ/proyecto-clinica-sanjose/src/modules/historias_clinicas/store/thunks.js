import api from "../../../api/api";
import {
  getHistories,
  loadingOff,
  loadingOn,
  setActiveForm,
  setActiveHistory,
  setError,
  updateHistory,
} from "./historySlice";

export const startSetActiveHistory = (activeHistory) => {
  return async (dispatch) => {
    dispatch(setActiveHistory(activeHistory));
  };
};

export const startSetActiveForm = (activeForm) => {
  return async (dispatch) => {
    dispatch(setActiveForm(activeForm));
  };
};

export const startLoadingHistories = () => {
  return async (dispatch, getState) => {
    try {

      dispatch(loadingOn());

      // Obtener del backend
      const { resp } = getState().auth;
      const userRol = resp.user.rol;
      let { resp: rolResp } = {};

      switch (userRol) {
        case 'doctor':
          rolResp = getState().medico;
          break;
        case 'nurse':
          rolResp = getState().enfermeria;
          break;
        case 'patient':
          rolResp = getState().paciente;
        default:
          break;
      }

      // console.log(rolResp.activeRegister.cedula);
      
     const { data } = await api.get(`historias/${parseInt(rolResp.activeRegister.cedula)}`); 

      dispatch(loadingOff());
      dispatch(getHistories(data));

    } catch (err) {
      console.error(err);
    }
  };
};

export const startUpdateHistory = (history) => {
  return async (dispatch) => {
    try {
      // Actualizar
      // Desde el backend a la BD
      await api.put(`historias/${history.unique_id}`, history);
      await dispatch(updateHistory(history));
    } catch (error) {
      console.error(error);
    }
  };
};
