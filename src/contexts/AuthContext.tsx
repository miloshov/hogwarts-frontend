import React, { createContext, useContext, useState, useEffect } from 'react';
import { Korisnik } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Korisnik | null;
  login: (userNameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Korisnik | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proveri da li postoji sačuvani korisnik pri pokretanju aplikacije
    const savedUser = authService.getCurrentUser();
    const token = authService.getToken();
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (userNameOrEmail: string, password: string) => {
    try {
      const response = await authService.login({ userName: userNameOrEmail, password });
      // Kreiraj user objekat iz response podataka
      const user: Korisnik = {
        id: 0, // Ovo ćemo popuniti kada budemo imali user ID u response
        userName: response.userName,
        email: response.email,
        role: response.role,
        isActive: true,
        datumRegistracije: new Date().toISOString(),
        zaposleniId: response.zaposleniId
      };
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
