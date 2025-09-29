import api from './api';
import { LoginRequest, LoginResponse } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { token, userName, email, role, zaposleniId } = response.data;
    
    // Create user object from response data
    const user = {
      id: parseInt(zaposleniId) || 0,
      ime: userName, // Backend uses userName, frontend expects ime
      prezime: '', // Not provided by backend
      email: email,
      role: role
    };
    
    // Store auth data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      token,
      user
    };
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clean up invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },
};

export default authService;