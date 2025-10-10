export interface InventarStavka {
  id?: number;
  naziv: string;
  opis?: string;
  kategorijaId: number;
  lokacijaId: number;
  serijskiBroj?: string;
  barKod?: string;
  stanje: string;
  nabavnaCena?: number;
  trenutnaVrednost?: number;
  datumNabavke?: string;
  garancijaDo?: string;
  dodeljenaKorisnikuId?: number;
  isActive: boolean;
  datumKreiranja?: string;
  datumIzmene?: string;
}

export interface InventarDto {
  id?: number;
  naziv: string;
  opis?: string;
  kategorijaId: number;
  lokacijaId: number;
  serijskiBroj?: string;
  barKod?: string;
  stanje: string;
  nabavnaCena?: number;
  trenutnaVrednost?: number;
  datumNabavke?: string;
  garancijaDo?: string;
  dodeljenaKorisnikuId?: number;
  isActive: boolean;
}

export interface InventarStatistike {
  ukupanBrojStavki: number;
  ukupnaVrednost: number;
  stavkePoStanju: { [key: string]: number };
  stavkePoKategoriji: { [key: string]: number };
  stavkePoLokaciji: { [key: string]: number };
}

export interface DodeljivanjeRequest {
  inventarStavkaId: number;
  korisnikId: number;
  napomena?: string;
}

class InventarService {
  private baseUrl = 'http://localhost:5241/api';

  // Kreiranje nove stavke
  createStavka = async (stavka: InventarDto): Promise<InventarStavka> => {
    const response = await fetch(`${this.baseUrl}/inventar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stavka),
    });

    if (!response.ok) {
      throw new Error('Greška pri kreiranju stavke');
    }

    return await response.json();
  };

  // Preuzimanje svih stavki
  getAllStavke = async (): Promise<InventarStavka[]> => {
    const response = await fetch(`${this.baseUrl}/inventar`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju stavki');
    }

    return await response.json();
  };

  // Preuzimanje stavke po ID
  getStavkaById = async (id: number): Promise<InventarStavka> => {
    const response = await fetch(`${this.baseUrl}/inventar/${id}`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju stavke');
    }

    return await response.json();
  };

  // Ažuriranje stavke
  updateStavka = async (id: number, stavka: InventarDto): Promise<InventarStavka> => {
    const response = await fetch(`${this.baseUrl}/inventar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stavka),
    });

    if (!response.ok) {
      throw new Error('Greška pri ažuriranju stavke');
    }

    return await response.json();
  };

  // Brisanje stavke
  deleteStavka = async (id: number): Promise<void> => {
    const response = await fetch(`${this.baseUrl}/inventar/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Greška pri brisanju stavke');
    }
  };

  // Preuzimanje stavki po kategoriji
  getStavkePoKategoriji = async (kategorijaId: number): Promise<InventarStavka[]> => {
    const response = await fetch(`${this.baseUrl}/inventar/kategorija/${kategorijaId}`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju stavki po kategoriji');
    }

    return await response.json();
  };

  // Preuzimanje stavki po lokaciji
  getStavkePoLokaciji = async (lokacijaId: number): Promise<InventarStavka[]> => {
    const response = await fetch(`${this.baseUrl}/inventar/lokacija/${lokacijaId}`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju stavki po lokaciji');
    }

    return await response.json();
  };

  // Preuzimanje dodeljenih stavki korisniku
  getDodeljeneStavke = async (korisnikId: number): Promise<InventarStavka[]> => {
    const response = await fetch(`${this.baseUrl}/inventar/korisnik/${korisnikId}`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju dodeljenih stavki');
    }

    return await response.json();
  };

  // Dodeljivanje stavke korisniku
  dodelilStavku = async (dodeljivanje: DodeljivanjeRequest): Promise<void> => {
    const response = await fetch(`${this.baseUrl}/inventar/dodeli`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dodeljivanje),
    });

    if (!response.ok) {
      throw new Error('Greška pri dodeljivanju stavke');
    }
  };

  // Vraćanje stavke
  vratiStavku = async (inventarStavkaId: number, napomena?: string): Promise<void> => {
    const response = await fetch(`${this.baseUrl}/inventar/vrati`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inventarStavkaId, napomena }),
    });

    if (!response.ok) {
      throw new Error('Greška pri vraćanju stavke');
    }
  };

  // Preuzimanje statistika
  getStatistike = async (): Promise<InventarStatistike> => {
    const response = await fetch(`${this.baseUrl}/inventar/statistike`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju statistika');
    }

    return await response.json();
  };

  // Generisanje QR koda
  generateQrCode = async (inventarStavkaId: number): Promise<Blob> => {
    const response = await fetch(`${this.baseUrl}/inventar/${inventarStavkaId}/qr`);
    
    if (!response.ok) {
      throw new Error('Greška pri generisanju QR koda');
    }

    return await response.blob();
  };

  // Preuzimanje stavke po bar kodu
  getStavkaPoBarKodu = async (barKod: string): Promise<InventarStavka> => {
    const response = await fetch(`${this.baseUrl}/inventar/barkod/${encodeURIComponent(barKod)}`);
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju stavke po bar kodu');
    }

    return await response.json();
  };
}

export default new InventarService();