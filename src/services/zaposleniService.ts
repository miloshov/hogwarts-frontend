import { api } from './authService';
import { Zaposleni, ZaposleniDto, Odsek } from '../types';
import { PaginatedResponse, SearchAndSortParams } from '../types/dashboard';

export const zaposleniService = {
  async getPaginated(params: SearchAndSortParams): Promise<PaginatedResponse<Zaposleni>> {
    const response = await api.get<PaginatedResponse<Zaposleni>>('/zaposleni', { params });
    return response.data;
  },

  async getAll(): Promise<Zaposleni[]> {
    const response = await api.get<Zaposleni[]>('/zaposleni/all');
    return response.data;
  },

  async getById(id: number): Promise<Zaposleni> {
    const response = await api.get<Zaposleni>(`/zaposleni/${id}`);
    return response.data;
  },

  async create(zaposleni: ZaposleniDto): Promise<Zaposleni> {
    const response = await api.post<Zaposleni>('/zaposleni', zaposleni);
    return response.data;
  },

  async update(id: number, zaposleni: ZaposleniDto): Promise<Zaposleni> {
    const response = await api.put<Zaposleni>(`/zaposleni/${id}`, zaposleni);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/zaposleni/${id}`);
  },
};

export const odsekService = {
  async getAll(): Promise<Odsek[]> {
    const response = await api.get<Odsek[]>('/odsek');
    return response.data;
  },
};
