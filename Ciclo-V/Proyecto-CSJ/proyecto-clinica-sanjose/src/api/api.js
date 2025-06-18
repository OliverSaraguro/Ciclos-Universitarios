import axios from "axios";
import { getEnvVariables } from "./getEnvVariables";
// Acceder a la variable de entorno que tiene el URL base para conectarnos al backend
// Para acceder se necesita hacer uso del archivo getEnvVariables
const { VITE_API_URL } = getEnvVariables();

const api = axios.create({
    // baseURL: 'http://localhost:3000/api/',
    baseURL: VITE_API_URL,
    maxContentLength: Infinity, // Deshabilita el límite para el contenido
    maxBodyLength: Infinity,
});

export default api;