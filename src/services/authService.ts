import axios from 'axios';

// ✅ ISPRAVKA: Tipovi za authentication
export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  Token: string;
  UserName: string;
  Email: string;
  Role: string;
  ZaposleniId?: number;
  ExpiresAt: string;
}

export interface User {
  Id: number;
  UserName: string;
  Email: string;
  Role: string;
  ZaposleniId?: number;
  Zaposleni?: {
    Id: number;
    PunoIme: string;
    Pozicija: string;
    Email: string;
    Odsek: string;
  };
}

// ✅ ISPRAVKA: Axios instance sa interceptors
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ ISPRAVKA: Request interceptor za token
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

// ✅ ISPRAVKA: Response interceptor za 401 greške
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ne automatski uklanjaj token ovde - ostavi AuthContext-u da odluči
      console.warn('401 Unauthorized - token možda nije valjan');
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // ✅ ISPRAVKA: Login funkcija sa boljim error handling-om
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Pokušaj prijavljivanja...', credentials.UserName);
      
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const loginData = response.data;
      
      if (loginData.Token) {
        // Sačuvaj podatke u localStorage
        localStorage.setItem('token', loginData.Token);
        localStorage.setItem('user', JSON.stringify({
          UserName: loginData.UserName,
          Email: loginData.Email,
          Role: loginData.Role,
          ZaposleniId: loginData.ZaposleniId
        }));
        localStorage.setItem('tokenExpiry', loginData.ExpiresAt);
        
        console.log('Uspešno prijavljivanje:', loginData.UserName);
        return loginData;
      } else {
        throw new Error('Token nije dobavljen sa servera');
      }
    } catch (error: any) {
      console.error('Greška pri prijavljivanju:', error);
      
      if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error('Nema odgovora sa servera. Proverite konekciju.');
      } else {
        throw new Error('Greška pri prijavljivanju: ' + error.message);
      }
    }
  }

  // ✅ ISPRAVKA: Logout sa čišćenjem localStorage-a
  logout(): void {
    console.log('Odjavljujem korisnika...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  // ✅ ISPRAVKA: Validacija tokena sa backend-om
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // Prvo proveri da li je token istekao lokalno
      if (this.isTokenExpired()) {
        console.log('Token je istekao lokalno');
        return false;
      }

      // Zatim validuj sa backend-om
      const response = await api.get('/auth/validate-token');
      return response.status === 200;
    } catch (error) {
      console.error('Greška pri validaciji tokena:', error);
      return false;
    }
  }

  // ✅ ISPRAVKA: Provera da li je token istekao
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) {
      return true;
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    
    // Dodaj 5 minuta buffer
    const bufferTime = 5 * 60 * 1000; // 5 minuta u milisekundama
    return now.getTime() > (expiryDate.getTime() - bufferTime);
  }

  // ✅ ISPRAVKA: Refresh token funkcija
  async refreshToken(): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh');
      const loginData = response.data;
      
      if (loginData.Token) {
        // Updateuj localStorage
        localStorage.setItem('token', loginData.Token);
        localStorage.setItem('tokenExpiry', loginData.ExpiresAt);
        console.log('Token je uspešno osvežen');
        return loginData;
      }
      
      return null;
    } catch (error) {
      console.error('Greška pri refresh tokena:', error);
      return null;
    }
  }

  // ✅ ISPRAVKA: Get user profile
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Greška pri dobijanju profila:', error);
      return null;
    }
  }

  // Helper functions
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }
}

export const authService = new AuthService();
export default authService;
