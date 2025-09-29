import api from './api';
import { Zaposleni } from '../types';

export const zaposleniService = {
  getAll: async (): Promise<Zaposleni[]> => {
    const response = await api.get('/zaposleni');
    return response.data;
  },

  getById: async (id: number): Promise<Zaposleni> => {
    const response = await api.get(`/zaposleni/${id}`);
    return response.data;
  },

  create: async (zaposleni: Omit<Zaposleni, 'id'>): Promise<Zaposleni> => {
    const response = await api.post('/zaposleni', zaposleni);
    return response.data;
  },

  update: async (id: number, zaposleni: Partial<Zaposleni>): Promise<Zaposleni> => {
    const response = await api.put(`/zaposleni/${id}`, zaposleni);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/zaposleni/${id}`);
  },
};

export default zaposleniService;