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

export interface UpdateHijerarhijeRequest {
  zaposleniId: number;
  noviNadredjeniId?: number;
  novaPozicijaId?: number;
}

export interface ZaposleniHijerarhija {
  zaposleni: OrgChartNode;
  nadredjeni?: OrgChartNode;
  podredjeni: OrgChartNode[];
}

// 🏗️ STRUKTURA API SERVICE
class StrukturaService {
  private baseUrl = `${API_BASE_URL}/struktural`;

  /**
   * 🌳 Dohvata kompletnu organizacionu strukturu
   */
  async getOrganizationChart(): Promise<OrgChartNode[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/org-chart`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching organization chart:', error);
      throw new Error('Greška pri učitavanju organizacione strukture');
    }
  }

  /**
   * 📋 Dohvata sve dostupne pozicije
   */
  async getPozicije(): Promise<Pozicija[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/pozicije`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching positions:', error);
      throw new Error('Greška pri učitavanju pozicija');
    }
  }

  /**
   * 👤 Dohvata hijerarhiju za određenog zaposlenog
   */
  async getZaposleniHijerarhija(zaposleniId: number): Promise<ZaposleniHijerarhija> {
    try {
      const response = await axios.get(`${this.baseUrl}/zaposleni/${zaposleniId}/hijerarhija`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching hierarchy for employee ${zaposleniId}:`, error);
      throw new Error('Greška pri učitavanju hijerarhije zaposlenog');
    }
  }

  /**
   * 🔄 Ažurira hijerarhiju zaposlenog
   */
  async updateHijerarhija(request: UpdateHijerarhijeRequest): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/update-hijerarhija`, request);
    } catch (error) {
      console.error('❌ Error updating hierarchy:', error);
      throw new Error('Greška pri ažuriranju hijerarhije');
    }
  }

  /**
   * ➕ Kreira novu poziciju
   */
  async createPozicija(pozicija: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Pozicija> {
    try {
      const response = await axios.post(`${this.baseUrl}/pozicije`, pozicija);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating position:', error);
      throw new Error('Greška pri kreiranju pozicije');
    }
  }

  /**
   * ✏️ Ažurira postojeću poziciju
   */
  async updatePozicija(id: number, pozicija: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'>): Promise<Pozicija> {
    try {
      const response = await axios.put(`${this.baseUrl}/pozicije/${id}`, pozicija);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating position ${id}:`, error);
      throw new Error('Greška pri ažuriranju pozicije');
    }
  }

  /**
   * 🗑️ Briše poziciju
   */
  async deletePozicija(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/pozicije/${id}`);
    } catch (error) {
      console.error(`❌ Error deleting position ${id}:`, error);
      throw new Error('Greška pri brisanju pozicije');
    }
  }

  /**
   * 🎨 Helper: Dobija default boju za poziciu na osnovu nivoa
   */
  getDefaultColorForLevel(nivo: number): string {
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
  getLevelLabel(nivo: number): string {
    const levelLabels: Record<number, string> = {
      1: 'Izvršni nivo',
      2: 'Direktorski nivo', 
      3: 'Menadžerski nivo',
      4: 'Senior nivo',
      5: 'Regularni nivo'
    };
    
    return levelLabels[nivo] || `Nivo ${nivo}`;
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
  hijerarhija: (zaposleniId: number) => [...strukturaQueries.all, 'hijerarhija', zaposleniId] as const,
};
