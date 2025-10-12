import { api } from './apiService';

// ✅ KONAČNO REŠENJE - KORISTI ISTI PATTERN KAO zaposleniService

// Servis za upravljanje korisničkim profilom
interface UserProfile {
  // Lični podaci
  id: number;
  ime: string;
  prezime: string;
  punoIme: string;
  email: string;
  avatarUrl: string;

  // Poslovni podaci
  odsek: string;
  pozicija: string;
  pozicijaDisplay: string;
  plata: number;
  preostaliDaniOdmora: number;
  primarniMenadzer: {
    id: number;
    punoIme: string;
    pozicija: string;
  } | null;
  sekundarniMenadzer: {
    id: number;
    punoIme: string;
    pozicija: string;
  } | null;

  // Opšti podaci
  datumZaposlenja: string;
  stazUKompaniji: string;
  zaduzeniInventar: InventarItem[];
}

interface InventarItem {
  id: number;
  naziv: string;
  kategorija: string;
  datumDodeljivanja: string;
}

interface UpdateProfileDto {
  email?: string;
}

interface ChangePasswordDto {
  staraLozinka: string;
  novaLozinka: string;
}

interface SalaryHistory {
  id: number;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  period: string;
  napomene: string;
  total: number;
}

interface VacationRequest {
  id: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  status: string;
  brojDana: number;
}

class ProfileService {
  // ✅ ISPRAVKA: Koristi '/profile' umesto '/zaposleni/moji-podaci'
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/profile');
    const data = response.data;
    
    // Mapiramo odgovor na UserProfile format
    return {
      id: data.id || 0,
      ime: data.ime || '',
      prezime: data.prezime || '',
      punoIme: data.punoIme || `${data.ime || ''} ${data.prezime || ''}`.trim(),
      email: data.email || '',
      avatarUrl: data.avatarUrl || '',
      odsek: data.odsek || '',
      pozicija: data.pozicija || '',
      pozicijaDisplay: data.pozicijaDisplay || data.pozicija || '',
      plata: data.plata || 0,
      preostaliDaniOdmora: data.preostaliDaniOdmora || 0,
      datumZaposlenja: data.datumZaposlenja || '',
      stazUKompaniji: data.stazUKompaniji || '',
      zaduzeniInventar: data.zaduzeniInventar || [],
      primarniMenadzer: data.primarniMenadzer || null,
      sekundarniMenadzer: data.sekundarniMenadzer || null,
    };
  }

  // Ažuriraj korisnički profil
  async updateProfile(profileData: UpdateProfileDto): Promise<{ message: string }> {
    try {
      const response = await api.put('/profile', profileData); // ✅ ISPRAVLJEN ENDPOINT
      return response.data;
    } catch (error) {
      return { message: 'Ažuriranje profila još nije implementirano na backend-u' };
    }
  }

  // Promeni lozinku
  async changePassword(passwordData: ChangePasswordDto): Promise<{ message: string }> {
    try {
      const response = await api.put('/profile/password', passwordData); // ✅ ISPRAVLJEN ENDPOINT
      return response.data;
    } catch (error) {
      return { message: 'Promena lozinke još nije implementirana na backend-u' };
    }
  }

  // Dobij istoriju plata
  async getSalaryHistory(): Promise<SalaryHistory[]> {
    try {
      const response = await api.get('/profile/salary-history');
      return response.data;
    } catch (error) {
      // Mock podaci
      return [
        {
          id: 1,
          osnovna: 80000,
          bonusi: 10000,
          otkazi: 5000,
          period: '2024-01',
          napomene: 'Mock podaci - endpoint nije implementiran',
          total: 85000
        }
      ];
    }
  }

  // Dobij zahteve za odmor
  async getVacationRequests(): Promise<VacationRequest[]> {
    try {
      const response = await api.get('/profile/vacation-requests');
      return response.data;
    } catch (error) {
      // Mock podaci
      return [
        {
          id: 1,
          datumOd: '2024-06-01',
          datumDo: '2024-06-15',
          razlog: 'Godišnji odmor',
          status: 'Odobren',
          brojDana: 14
        }
      ];
    }
  }
}

export const profileService = new ProfileService();
export type { 
  UserProfile, 
  UpdateProfileDto, 
  ChangePasswordDto, 
  SalaryHistory, 
  VacationRequest, 
  InventarItem 
};
