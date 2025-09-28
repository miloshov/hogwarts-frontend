export interface Zaposleni {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  datumRodjenja: string;
  datumZaposlenja: string;
  pozicija: string;
  odeljenje: string;
  trenutnaPlata: number;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    role: string;
  };
}

export interface Plata {
  id: number;
  zaposleniId: number;
  iznos: number;
  datum: string;
  tip: string;
  opis?: string;
}

export interface ZahtevZaOdmor {
  id: number;
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  tipOdmora: string;
  razlog: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  datumZahteva: string;
  odobrioPreposleni?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}