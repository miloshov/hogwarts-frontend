// 🏗️ STRUKTURA TIPOVI

// Osnovna pozicija u organizaciji
export interface Pozicija {
  id: number;
  naziv: string;
  opis?: string;
  nivo: number;
  boja?: string; // Hex color kod za vizuelno predstavljanje
  isActive: boolean;
  datumKreiranja: string;
}

// Organizacioni čvor za hijerarhijski prikaz
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

// Request za ažuriranje hijerarhije
export interface UpdateHijerarhijeRequest {
  zaposleniId: number;
  noviNadredjeniId?: number;
  novaPozicijaId?: number;
}

// Kompletan hijerarhijski prikaz zaposlenog
export interface ZaposleniHijerarhija {
  zaposleni: OrgChartNode;
  nadredjeni?: OrgChartNode;
  podredjeni: OrgChartNode[];
}

// Form tipovi
export interface PozicijaFormData {
  naziv: string;
  opis: string;
  nivo: number;
  boja: string;
}

export interface HijerarhijaFormData {
  zaposleniId: number;
  nadredjeniId?: number;
  pozicijaId?: number;
}

// Enums
export enum PozicijaNivo {
  IZVRSNI = 1,
  DIREKTORSKI = 2,
  MENADZFERSKI = 3,
  SENIOR = 4,
  REGULARNI = 5,
}

export const POZICIJA_NIVOI = {
  [PozicijaNivo.IZVRSNI]: 'Izvršni nivo',
  [PozicijaNivo.DIREKTORSKI]: 'Direktorski nivo',
  [PozicijaNivo.MENADZFERSKI]: 'Menadžerski nivo',
  [PozicijaNivo.SENIOR]: 'Senior nivo',
  [PozicijaNivo.REGULARNI]: 'Regularni nivo',
} as const;

export const DEFAULT_POZICIJA_BOJE = {
  [PozicijaNivo.IZVRSNI]: '#e74c3c',     // CEO - crvena
  [PozicijaNivo.DIREKTORSKI]: '#9b59b6', // Director - ljubičasta
  [PozicijaNivo.MENADZFERSKI]: '#3498db', // Manager - plava
  [PozicijaNivo.SENIOR]: '#2ecc71',      // Senior - zelena
  [PozicijaNivo.REGULARNI]: '#34495e',   // Regular - tamno siva
} as const;
