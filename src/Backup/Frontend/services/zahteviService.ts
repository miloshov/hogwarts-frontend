import api from './api';
import { ZahtevZaOdmor } from '../types';

export const zahteviService = {
  getAll: async (): Promise<ZahtevZaOdmor[]> => {
    const response = await api.get('/zahteviZaOdmor');
    return response.data;
  },

  getByZaposleniId: async (zaposleniId: number): Promise<ZahtevZaOdmor[]> => {
    const response = await api.get(`/zahteviZaOdmor/zaposleni/${zaposleniId}`);
    return response.data;
  },

  create: async (zahtev: Omit<ZahtevZaOdmor, 'id'>): Promise<ZahtevZaOdmor> => {
    const response = await api.post('/zahteviZaOdmor', zahtev);
    return response.data;
  },

  update: async (id: number, zahtev: Partial<ZahtevZaOdmor>): Promise<ZahtevZaOdmor> => {
    const response = await api.put(`/zahteviZaOdmor/${id}`, zahtev);
    return response.data;
  },

  approve: async (id: number): Promise<ZahtevZaOdmor> => {
    const response = await api.patch(`/zahteviZaOdmor/${id}/approve`);
    return response.data;
  },

  reject: async (id: number): Promise<ZahtevZaOdmor> => {
    const response = await api.patch(`/zahteviZaOdmor/${id}/reject`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/zahteviZaOdmor/${id}`);
  },
};

export default zahteviService;