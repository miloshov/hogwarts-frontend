import axios from 'axios';

const API_BASE_URL = 'http://localhost:5241/api';

// 🏗️ STRUKTURA API TIPOVI
export interface OrgChartNode {
  id: number;
  ime: string;
  prezime: string;
  punoIme: string;
  email: string;
  pozicija: string;
  odsek?: string;
  avatarUrl: string;
  nadredjeniId?: number;
  pozicijaNivo: number;
  pozicijaBoja: string;
  podredjeni: OrgChartNode[];
  datumZaposlenja: string;
  isActive: boolean;
}

export interface Pozicija {
  id: number;
  naziv: string;
  opis?: string;
  nivo: number;
  boja?: string;
  isActive: boolean;
  datumKreiranja: string;
}

export interface Odsek {
  id: number;
  naziv: string;
  opis?: string;
  lokacija?: string;
  boja?: string;
  budzetKod?: string;
  isActive: boolean;
  datumKreiranja: string;
}

export interface UpdateHijerarhijeRequest {
  zaposleniId: number;
  noviNadredjeniId?: number;
  novaPozicijaId?: number;
  noviOdsekId?: number;
}

export interface ZaposleniHijerarhija {
  zaposleni: OrgChartNode;
  nadredjeni?: OrgChartNode;
  podredjeni: OrgChartNode[];
}

// 🔐 Helper za dobijanje auth headera
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Nema JWT tokena - korisnik nije ulogovan');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// 🏗️ STRUKTURA API SERVICE
class StrukturaService {
  private baseUrl = `${API_BASE_URL}/struktura`;

  /**
   * 🌳 Dohvata kompletnu organizacionu strukturu
   */
  getOrganizationChart = async (): Promise<OrgChartNode[]> => {
    try {
      const response = await axios.get(`${this.baseUrl}/org-chart`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching organization chart:', error);
      throw new Error('Greška pri učitavanju organizacione strukture');
    }
  }

  /**
   * 📋 Dohvata sve dostupne pozicije
   */
  getPozicije = async (): Promise<Pozicija[]> => {
    try {
      const response = await axios.get(`${this.baseUrl}/pozicije`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching positions:', error);
      throw new Error('Greška pri učitavanju pozicija');
    }
  }

  /**
   * 🏢 Dohvata sve dostupne odseke
   */
  getOdseci = async (): Promise<Odsek[]> => {
    try {
      const response = await axios.get(`${this.baseUrl}/odseci`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
      throw new Error('Greška pri učitavanju odseka');
    }
  }

  /**
   * 👤 Dohvata hijerarhiju za određenog zaposlenog
   */
  getZaposleniHijerarhija = async (zaposleniId: number): Promise<ZaposleniHijerarhija> => {
    try {
      const response = await axios.get(`${this.baseUrl}/zaposleni/${zaposleniId}/hijerarhija`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching hierarchy for employee ${zaposleniId}:`, error);
      throw new Error('Greška pri učitavanju hijerarhije zaposlenog');
    }
  }

  /**
   * 🔄 Ažurira hijerarhiju zaposlenog
   */
  updateHijerarhija = async (request: UpdateHijerarhijeRequest): Promise<void> => {
    try {
      await axios.put(`${this.baseUrl}/update-hijerarhija`, request, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('❌ Error updating hierarchy:', error);
      throw new Error('Greška pri ažuriranju hijerarhije');
    }
  }

  // 📋 POZICIJE CRUD OPERACIJE

  /**
   * ➕ Kreira novu poziciju
   */
  createPozicija = async (pozicija: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Pozicija> => {
    try {
      const response = await axios.post(`${this.baseUrl}/pozicije`, pozicija, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating position:', error);
      throw new Error('Greška pri kreiranju pozicije');
    }
  }

  /**
   * ✏️ Ažurira postojeću poziciju
   */
  updatePozicija = async (id: number, pozicija: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Pozicija> => {
    try {
      const response = await axios.put(`${this.baseUrl}/pozicije/${id}`, pozicija, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating position ${id}:`, error);
      throw new Error('Greška pri ažuriranju pozicije');
    }
  }

  /**
   * 🗑️ Briše poziciju
   */
  deletePozicija = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${this.baseUrl}/pozicije/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error(`❌ Error deleting position ${id}:`, error);
      throw new Error('Greška pri brisanju pozicije');
    }
  }

  // 🏢 ODSECI CRUD OPERACIJE

  /**
   * ➕ Kreira novi odsek
   */
  createOdsek = async (odsek: Omit<Odsek, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Odsek> => {
    try {
      const response = await axios.post(`${this.baseUrl}/odseci`, odsek, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating department:', error);
      throw new Error('Greška pri kreiranju odseka');
    }
  }

  /**
   * ✏️ Ažurira postojeći odsek
   */
  updateOdsek = async (id: number, odsek: Omit<Odsek, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Odsek> => {
    try {
      const response = await axios.put(`${this.baseUrl}/odseci/${id}`, odsek, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating department ${id}:`, error);
      throw new Error('Greška pri ažuriranju odseka');
    }
  }

  /**
   * 🗑️ Briše odsek
   */
  deleteOdsek = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${this.baseUrl}/odseci/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error(`❌ Error deleting department ${id}:`, error);
      throw new Error('Greška pri brisanju odseka');
    }
  }

  // 🎨 HELPER FUNKCIJE

  /**
   * 🎨 Helper: Dobija default boju za poziciju na osnovu nivoa
   */
  getDefaultColorForLevel = (nivo: number): string => {
    const levelColors: Record<number, string> = {
      1: '#e74c3c', // CEO - crvena
      2: '#9b59b6', // Director - ljubičasta
      3: '#3498db', // Manager - plava
      4: '#2ecc71', // Senior - zelena
      5: '#34495e', // Regular - tamno siva
    };
    
    return levelColors[nivo] || '#95a5a6'; // Default siva
  }

  /**
   * 🏷️ Helper: Dobija string label za nivo pozicije
   */
  getLevelLabel = (nivo: number): string => {
    const levelLabels: Record<number, string> = {
      1: 'Izvršni nivo',
      2: 'Direktorski nivo', 
      3: 'Menadžerski nivo',
      4: 'Senior nivo',
      5: 'Regularni nivo'
    };
    
    return levelLabels[nivo] || `Nivo ${nivo}`;
  }

  /**
   * 🎨 Helper: Dobija default boju za odseke
   */
  getDefaultColorForDepartment = (): string => {
    const departmentColors = [
      '#3498db', // Plava
      '#e74c3c', // Crvena
      '#2ecc71', // Zelena
      '#f39c12', // Narandžasta
      '#9b59b6', // Ljubičasta
      '#1abc9c', // Tirkizna
      '#34495e', // Tamno siva
    ];
    
    return departmentColors[Math.floor(Math.random() * departmentColors.length)];
  }
}

// Singleton instance
export const strukturaService = new StrukturaService();
export default strukturaService;

// React Query keys
export const strukturaQueries = {
  all: ['struktura'] as const,
  orgChart: () => [...strukturaQueries.all, 'org-chart'] as const,
  pozicije: () => [...strukturaQueries.all, 'pozicije'] as const,
  odseci: () => [...strukturaQueries.all, 'odseci'] as const,
  hijerarhija: (zaposleniId: number) => [...strukturaQueries.all, 'hijerarhija', zaposleniId] as const,
};