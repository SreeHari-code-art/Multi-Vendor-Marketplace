import axios from 'axios';

/**
 * Centralized Axios instance for backend communication.
 * Relative paths such as '/api/v1' automatically use the Vite dev proxy,
 * which forwards requests to the backend running on port 5000.
 */
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ==========================================
 * Request Interceptor
 * ==========================================
 * Injects the JWT token from localStorage into the Authorization header
 * for outgoing requests when it exists.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('marketplace_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ==========================================
 * Response Interceptor
 * ==========================================
 * Handles global responses, especially expired or invalid JWT tokens
 * when the server returns HTTP 401 Unauthorized.
 */
api.interceptors.response.use(
  (response) => {
    // Retornar directamente los datos de la respuesta si todo es exitoso
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      // Sesión expirada o token no válido
      console.warn('Sesión expirada o no autorizada. Limpiando credenciales...');
      
      // Limpiar datos sensibles del almacenamiento local
      localStorage.removeItem('marketplace_token');
      localStorage.removeItem('marketplace_user');
      
      // Redirigir al usuario al login si no se encuentra ya en esa ruta
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Retornar el error estructurado para que pueda ser capturado en los componentes o thunks de Redux
    const errorMessage = response?.data?.message || error.message || 'Ocurrió un error en la petición';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;