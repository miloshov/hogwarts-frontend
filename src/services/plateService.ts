import api from './api';
import { Plata } from '../types';

export const plateService = {
  getAll: async (): Promise<Plata[]> => {
    const response = await api.get('/plate');
    return response.data;
  },

  getByZaposleniId: async (zaposleniId: number): Promise<Plata[]> => {
    const response = await api.get(`/plate/zaposleni/${zaposleniId}`);
    return response.data;
  },

  create: async (plata: Omit<Plata, 'id'>): Promise<Plata> => {
    const response = await api.post('/plate', plata);
    return response.data;
  },

  update: async (id: number, plata: Partial<Plata>): Promise<Plata> => {
    const response = await api.put(`/plate/${id}`, plata);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/plate/${id}`);
  },
};

export default plateService;