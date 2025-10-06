import axios from 'axios';
import { authService } from './authService';

// ✅ Centralizovan API service sa interceptors
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor za token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor za 401 greške
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - možda je potreban refresh token');
      
      // Pokušaj refresh token ako nije već u toku
      if (!error.config._retry) {
        error.config._retry = true;
        
        try {
          const refreshedToken = await authService.refreshToken();
          if (refreshedToken) {
            // Ponovi originalni zahtev sa novim token-om
            error.config.headers.Authorization = `Bearer ${refreshedToken.Token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          // Logout će biti pozvan iz AuthContext-a
        }
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
