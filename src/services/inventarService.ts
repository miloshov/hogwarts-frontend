import { InventarItem, CreateInventarItem, UpdateInventarItem, InventarStats } from '../types/inventar';

const API_BASE_URL = 'http://localhost:5241/api';

// Helper funkcija za dobijanje JWT tokena
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper funkcija za kreiranje headers-a sa autentifikacijom
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper funkcija za handling API response-a
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token je istekao ili nije valjan - redirect na login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesija je istekla. Molimo prijavite se ponovo.');
    }
    
    let errorMessage = 'Došlo je do greške';
    try {
      const errorData = await response.text();
      errorMessage = errorData || `HTTP Error: ${response.status}`;
    } catch {
      errorMessage = `HTTP Error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  return response;
};

// 🔧 Helper funkcija za extractovanje data iz API response-a
const extractDataFromResponse = (responseData: any): any[] => {
  console.log('🔍 API Response structure:', responseData);
  
  // Ako je response direktno array
  if (Array.isArray(responseData)) {
    console.log('✅ Response je direktno array');
    return responseData;
  }
  
  // Ako je response objekat sa data property-jem
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.data)) {
    console.log('✅ Response je objekat sa data property-jem');
    return responseData.data;
  }
  
  // Ako je response objekat sa items property-jem (alternativno ime)
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.items)) {
    console.log('✅ Response je objekat sa items property-jem');
    return responseData.items;
  }
  
  // Ako je response objekat sa results property-jem (alternativno ime)
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.results)) {
    console.log('✅ Response je objekat sa results property-jem');
    return responseData.results;
  }
  
  console.warn('⚠️ Neočekivana struktura API response-a:', responseData);
  return [];
};

export class InventarService {
  // Dobij sve stavke inventara
  static async getAllStavke(): Promise<InventarItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      
      // 🔧 Extract array from response structure
      const data = extractDataFromResponse(responseData);
      return data;
    } catch (error) {
      console.error('Error fetching inventar stavke:', error);
      throw new Error('Greška pri preuzimanju stavki');
    }
  }

  // Dobij jednu stavku po ID-u
  static async getStavkaById(id: number): Promise<InventarItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      
      // Za single item, obično je direktno objekat
      return responseData;
    } catch (error) {
      console.error('Error fetching inventar stavka:', error);
      throw new Error('Greška pri preuzimanju stavke');
    }
  }

  // Kreiraj novu stavku
  static async createStavka(stavka: CreateInventarItem): Promise<InventarItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(stavka),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating inventar stavka:', error);
      throw new Error('Greška pri kreiranju stavke');
    }
  }

  // Ažuriraj postojeću stavku
  static async updateStavka(id: number, stavka: UpdateInventarItem): Promise<InventarItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(stavka),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error updating inventar stavka:', error);
      throw new Error('Greška pri ažuriranju stavke');
    }
  }

  // Obriši stavku
  static async deleteStavka(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
    } catch (error) {
      console.error('Error deleting inventar stavka:', error);
      throw new Error('Greška pri brisanju stavke');
    }
  }

  // Dobij statistike inventara
  static async getStatistike(): Promise<InventarStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/statistike`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching inventar statistike:', error);
      throw new Error('Greška pri preuzimanju statistika');
    }
  }

  // Pretraži stavke inventara
  static async searchStavke(query: string): Promise<InventarItem[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${API_BASE_URL}/inventar/search?q=${encodedQuery}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      
      // 🔧 Extract array from response structure
      const data = extractDataFromResponse(responseData);
      return data;
    } catch (error) {
      console.error('Error searching inventar stavke:', error);
      throw new Error('Greška pri pretraživanju stavki');
    }
  }

  // Ažuriraj količinu stavke
  static async updateKolicina(id: number, novaKolicina: number): Promise<InventarItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/${id}/kolicina`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ kolicina: novaKolicina }),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error updating kolicina:', error);
      throw new Error('Greška pri ažuriranju količine');
    }
  }

  // Dobij kategorije
  static async getKategorije(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/kategorije`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      
      // 🔧 Extract array from response structure
      const data = extractDataFromResponse(responseData);
      return data;
    } catch (error) {
      console.error('Error fetching kategorije:', error);
      throw new Error('Greška pri preuzimanju kategorija');
    }
  }

  // Eksportuj inventar u CSV
  static async exportToCSV(): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventar/export/csv`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      await handleApiResponse(response);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Greška pri eksportovanju u CSV');
    }
  }

  // Import inventara iz CSV
  static async importFromCSV(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/inventar/import/csv`, {
        method: 'POST',
        headers: headers, // Ne dodavamo Content-Type za FormData
        body: formData,
      });

      await handleApiResponse(response);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error importing from CSV:', error);
      throw new Error('Greška pri importovanju iz CSV');
    }
  }
}

export default InventarService;