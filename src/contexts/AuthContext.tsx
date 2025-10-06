import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest, LoginResponse, User } from '../services/authService';

// ✅ ISPRAVKA: AuthContext tipovi
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// ✅ ISPRAVKA: AuthProvider sa poboljšanim lifecycle managementom
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ ISPRAVKA: Inicijalizacija auth state-a
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      console.log('Inicijalizujem authentication...');
      
      // Proveri da li postoji token u localStorage
      const token = authService.getToken();
      if (!token) {
        console.log('Nema tokena u localStorage');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Proveri da li je token istekao
      if (authService.isTokenExpired()) {
        console.log('Token je istekao');
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Pokušaj da validiraj token sa backend-om
      const isValid = await authService.validateToken();
      if (!isValid) {
        console.log('Token nije valjan sa backend-om');
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Dobij podatke o korisniku
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        console.log('Korisnik je automatski prijavljen:', currentUser.UserName);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log('Nije moguće dobiti podatke o korisniku');
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Greška pri inicijalizaciji auth:', error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ISPRAVKA: useEffect sa dependency array
  useEffect(() => {
    initializeAuth();
  }, []); // Prazan dependency array - izvršava se samo jednom

  // ✅ ISPRAVKA: Login funkcija
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      console.log('Pokušavam login...');
      
      const loginResponse = await authService.login(credentials);
      
      // Dobij pun profil korisnika nakon login-a
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        console.log('Login je uspešan:', currentUser.UserName);
      } else {
        throw new Error('Nije moguće dobiti podatke o korisniku nakon login-a');
      }
    } catch (error: any) {
      console.error('Login greška:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw da komponenta može da prikaže greške
    } finally {
      setLoading(false);
    }
  };

  // ✅ ISPRAVKA: Logout funkcija
  const logout = (): void => {
    console.log('Logout pozvan');
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ ISPRAVKA: Auto refresh token pre isteka
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiry = async () => {
      if (authService.isTokenExpired()) {
        console.log('Token će uskoro da istekne, pokušavam refresh...');
        
        const refreshedToken = await authService.refreshToken();
        if (!refreshedToken) {
          console.log('Refresh token nije uspešan, odjavljujem korisnika');
          logout();
        } else {
          console.log('Token je uspešno osvežen');
        }
      }
    };

    // Proveri svake 5 minuta
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ ISPRAVKA: useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
