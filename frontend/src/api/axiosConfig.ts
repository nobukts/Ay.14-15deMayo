import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// --- EP 2.4: Interceptores de Petición ---
api.interceptors.request.use(async (config) => {
  const { value: token } = await Preferences.get({ key: 'token' });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- EP 2.4: Interceptores de Respuesta y Manejo de Errores ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Token expirado o no autorizado. Redirigiendo al login...');
      // Aquí se podría limpiar el storage y redirigir
      // Preferences.remove({ key: 'token' });
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
