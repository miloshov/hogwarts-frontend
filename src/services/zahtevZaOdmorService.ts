import { api } from './apiService';
import { ZahtevZaOdmor, ZahtevZaOdmorDto } from '../types';

export const zahtevZaOdmorService = {
  async getAll(): Promise<ZahtevZaOdmor[]> {
    const response = await api.get<ZahtevZaOdmor[]>('/zahtevzaodmor');
    return response.data;
  },

  async getByZaposleniId(zaposleniId: number): Promise<ZahtevZaOdmor[]> {
    const response = await api.get<ZahtevZaOdmor[]>(`/zahtevzaodmor/zaposleni/${zaposleniId}`);
    return response.data;
  },

  async create(zahtev: ZahtevZaOdmorDto): Promise<ZahtevZaOdmor> {
    const response = await api.post<ZahtevZaOdmor>('/zahtevzaodmor', zahtev);
    return response.data;
  },

  async approve(id: number, napomena?: string): Promise<ZahtevZaOdmor> {
    const response = await api.patch<ZahtevZaOdmor>(`/zahtevzaodmor/${id}/approve`, {
      napomenaOdgovora: napomena,
    });
    return response.data;
  },

  async reject(id: number, napomena?: string): Promise<ZahtevZaOdmor> {
    const response = await api.patch<ZahtevZaOdmor>(`/zahtevzaodmor/${id}/reject`, {
      napomenaOdgovora: napomena,
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/zahtevzaodmor/${id}`);
  },
};
