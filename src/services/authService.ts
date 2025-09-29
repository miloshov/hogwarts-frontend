import axios from 'axios';
import { LoginResponse, LoginDto, RegisterDto, AuthResponse } from '../types';

const API_BASE_URL = 'https://localhost:7249/api';

// Kreiranje axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor za dodavanje token-a u zahteve
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor za handling 401 grešaka
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(loginData: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', loginData);
    
    // Čuvanje token-a i korisnika u localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      userName: response.data.userName,
      email: response.data.email,
      role: response.data.role,
      zaposleniId: response.data.zaposleniId
    }));
    
    return response.data;
  },

  async register(registerData: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', registerData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};
