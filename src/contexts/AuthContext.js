import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Kreiraj Context
const AuthContext = createContext();

// Custom hook za korišćenje AuthContext-a
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider komponenta
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Proveri da li postoji token pri učitavanju aplikacije
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Postavi token u axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Opcionalno: Verifikuj token sa serverom
          // const response = await axios.get('/api/Auth/verify');
          
          // Za sada, pretpostavimo da je token valjan ako postoji
          setIsAuthenticated(true);
          setUser({ 
            // Možeš dodati user podatke ako ih server vraća
            // username: response.data.username,
            token: token 
          });
        } catch (error) {
          console.error('Token verification failed:', error);
          // Ukloni nevažeći token
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login funkcija
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/Auth/login', {
        username,
        password
      });

      const { token } = response.data;
      
      if (token) {
        // Sačuvaj token
        localStorage.setItem('authToken', token);
        
        // Postavi token u axios headers za buduće pozive
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Ažuriraj state
        setUser({ 
          username, 
          token,
          // Dodaj ostale user podatke iz response-a ako postoje
          ...response.data.user 
        });
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Očisti stanje u slučaju greške
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout funkcija
  const logout = () => {
    // Ukloni token iz localStorage
    localStorage.removeItem('authToken');
    
    // Ukloni token iz axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Očisti state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('User logged out successfully');
  };

  // Register funkcija (ako je potrebna)
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/Auth/register', userData);
      
      // Automatski logiraj korisnika nakon registracije
      if (response.data.token) {
        const { token } = response.data;
        
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser({ 
          ...userData,
          token,
          ...response.data.user 
        });
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;