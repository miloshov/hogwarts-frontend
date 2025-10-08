import { api } from './apiService';
import { Zaposleni, ZaposleniDto, Odsek, FileUploadResponse } from '../types';

const API_BASE_URL = 'http://localhost:5241/api';

// 🆕 NOVI TIP ZA DROPDOWN - jednostavan objekat
interface ZaposleniDropdownItem {
  id: number;
  ime: string;
  prezime: string;
  punoIme: string;
  pozicija: string;
}

export const zaposleniService = {
  // 🆕 NOVI DROPDOWN METOD - optimizovan za padajuće menije
  async getDropdown(): Promise<ZaposleniDropdownItem[]> {
    const response = await api.get<ZaposleniDropdownItem[]>('/zaposleni/dropdown');
    return response.data;
  },

  async getAll(): Promise<Zaposleni[]> {
    const response = await api.get<Zaposleni[]>('/zaposleni/all');
    return response.data;
  },

  async get(page: number = 1, pageSize: number = 10, search: string = '', sortBy: string = 'ime', ascending: boolean = true) {
    const response = await api.get('/zaposleni', {
      params: { page, pageSize, search, sortBy, ascending }
    });
    return response.data;
  },

  async getById(id: number): Promise<Zaposleni> {
    const response = await api.get<Zaposleni>(`/zaposleni/${id}`);
    return response.data;
  },

  async create(zaposleni: ZaposleniDto): Promise<Zaposleni> {
    // 🔧 FIX: Ne wrappuj u noviZaposleni - šalji direktno sa PascalCase nazivima
    const requestData = {
      Ime: zaposleni.ime,
      Prezime: zaposleni.prezime,
      Email: zaposleni.email,
      Pozicija: zaposleni.pozicija,
      DatumZaposlenja: zaposleni.datumZaposlenja,
      DatumRodjenja: zaposleni.datumRodjenja,
      ImeOca: zaposleni.imeOca,
      Jmbg: zaposleni.jmbg,
      Adresa: zaposleni.adresa,
      BrojTelefon: zaposleni.brojTelefon,
      OdsekId: zaposleni.odsekId,
      Pol: zaposleni.pol ? (zaposleni.pol === 'Muski' ? 1 : 2) : undefined
    };
    
    console.log('Sending to API (DIREKTNO PascalCase):', requestData); // 🔍 DEBUG
    const response = await api.post<Zaposleni>('/zaposleni', requestData);
    return response.data;
  },

  async update(id: number, zaposleni: ZaposleniDto): Promise<void> {
    // 🔧 FIX: Map camelCase to PascalCase for backend
    const requestData = {
      Ime: zaposleni.ime,
      Prezime: zaposleni.prezime,
      Email: zaposleni.email,
      Pozicija: zaposleni.pozicija,
      DatumZaposlenja: zaposleni.datumZaposlenja,
      DatumRodjenja: zaposleni.datumRodjenja,
      ImeOca: zaposleni.imeOca,
      Jmbg: zaposleni.jmbg,
      Adresa: zaposleni.adresa,
      BrojTelefon: zaposleni.brojTelefon,
      OdsekId: zaposleni.odsekId,
      Pol: zaposleni.pol ? (zaposleni.pol === 'Muski' ? 1 : 2) : undefined
    };
    
    await api.put(`/zaposleni/${id}`, requestData);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/zaposleni/${id}`);
  },

  async getOdseci(): Promise<Odsek[]> {
    const response = await api.get<Odsek[]>('/odsek');
    return response.data;
  },

  async getMojiPodaci(): Promise<Zaposleni> {
    const response = await api.get<Zaposleni>('/zaposleni/moji-podaci');
    return response.data;
  },

  // 🆕 NOVE FUNKCIJE ZA UPLOAD SLIKA
  // ⚠️ ISPRAVKA: Ruta MORA biti `/zaposleni/${id}/upload-image` 
  // kao što je definisano u ZaposleniController.cs linija 191
  async uploadProfileImage(id: number, file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileUploadResponse>(
      `/zaposleni/${id}/upload-image`, // ✅ ISPRAVNA RUTA
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ⚠️ ISPRAVKA: Ruta MORA biti `/zaposleni/${id}/delete-image`
  // kao što je definisano u ZaposleniController.cs linija 259
  async deleteProfileImage(id: number): Promise<FileUploadResponse> {
    const response = await api.delete<FileUploadResponse>(`/zaposleni/${id}/delete-image`);
    return response.data;
  },

  // 🆕 HELPER FUNKCIJA ZA AVATAR URL
  getAvatarUrl(zaposleni: Zaposleni): string {
    if (zaposleni.profileImageUrl) {
      return zaposleni.profileImageUrl;
    }
    
    // Placeholder slike
    return zaposleni.pol === 1 
      ? '/images/avatars/default-male.png' 
      : '/images/avatars/default-female.png';
  },
};

// 🆕 EXPORT NOVOG TIPA ZA KORIŠĆENJE U KOMPONENTAMA
export type { ZaposleniDropdownItem };