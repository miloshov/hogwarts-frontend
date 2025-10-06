import { api } from './apiService';
import { Plata, PlataDto } from '../types';

export const plataService = {
  async getAll(): Promise<Plata[]> {
    const response = await api.get<Plata[]>('/plata');
    return response.data;
  },

  async getByZaposleniId(zaposleniId: number): Promise<Plata[]> {
    const response = await api.get<Plata[]>(`/plata/zaposleni/${zaposleniId}`);
    return response.data;
  },

  async create(plata: PlataDto): Promise<Plata> {
    const response = await api.post<Plata>('/plata', plata);
    return response.data;
  },

  async update(id: number, plata: PlataDto): Promise<Plata> {
    const response = await api.put<Plata>(`/plata/${id}`, plata);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/plata/${id}`);
  },
};
