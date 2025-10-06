import { api } from './apiService';
import { Zaposleni, ZaposleniDto, Odsek, FileUploadResponse } from '../types';

export const zaposleniService = {
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

  // 🔧 ALIAS za kompatibilnost
  async getPaginated(params: any) {
    return this.get(params.page, params.pageSize, params.search, params.sortBy, params.ascending);
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

  // 🔧 ALIAS za image upload funkciju 
  async uploadImage(zaposleniId: number, file: File): Promise<FileUploadResponse> {
    return this.uploadProfileImage(zaposleniId, file);
  },

  // 🆕 NOVE FUNKCIJE ZA UPLOAD SLIKA
  async uploadProfileImage(id: number, file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileUploadResponse>(
      `/zaposleni/${id}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

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
