import { api } from './apiService'; // ✅ ISPRAVKA: Koristi isti pattern kao profileService

export interface PodesavanjaDto {
  tema: string;
  jezik: string;
  emailNotifikacije: boolean;
  deadlineNotifikacije: boolean;
  stavkiPoStranici: number;
  autoSave: boolean;
  timeZone: string;
}

export interface PodesavanjaResponse {
  id: number;
  korisnikId: number;
  tema: string;
  jezik: string;
  emailNotifikacije: boolean;
  deadlineNotifikacije: boolean;
  stavkiPoStranici: number;
  autoSave: boolean;
  timeZone: string;
  datumKreiranja: string;
  datumIzmene: string;
}

export interface PromenaLozinkeDto {
  staraLozinka: string;
  novaLozinka: string;
  potvrdaLozinke: string;
}

class PodesavanjaService {
  /**
   * Dohvata korisnička podešavanja
   */
  async getPodesavanja(): Promise<PodesavanjaResponse> {
    const response = await api.get('/podesavanja');
    return response.data;
  }

  /**
   * Ažurira korisnička podešavanja
   */
  async updatePodesavanja(data: PodesavanjaDto): Promise<PodesavanjaResponse> {
    const response = await api.put('/podesavanja', data);
    return response.data;
  }

  /**
   * Menja lozinku korisnika
   */
  async promeniLozinku(data: PromenaLozinkeDto): Promise<{ message: string }> {
    const response = await api.post('/podesavanja/promeni-lozinku', data);
    return response.data;
  }

  /**
   * Resetuje podešavanja na default vrednosti
   */
  async resetPodesavanja(): Promise<PodesavanjaResponse> {
    const response = await api.post('/podesavanja/reset');
    return response.data;
  }
}

export const podesavanjaService = new PodesavanjaService();
