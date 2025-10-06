// Osnovni tipovi za backend modele

export interface Odsek {
  id: number;
  naziv: string;
  opis: string;
  datumKreiranja: string;
  isActive: boolean;
}

export interface Zaposleni {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  trenutnaPlata: number;
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  isActive: boolean;
  datumKreiranja: string;
  odsekId?: number;
  odsek?: Odsek;
}

export interface Plata {
  id: number;
  zaposleniId: number;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  period: string;
  datumKreiranja: string;
  napomene?: string;
  zaposleni?: Zaposleni;
  neto: number; // Computed property
}

export interface ZahtevZaOdmor {
  id: number;
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog?: string;
  status: 'Na_Cekanju' | 'Odobren' | 'Odbijen';
  tipOdmora: string;
  datumZahteva: string;
  datumOdgovora?: string;
  odobrioKorisnikId?: number;
  napomenaOdgovora?: string;
  zaposleni?: Zaposleni;
  brojDana: number; // Computed property
}

export interface Korisnik {
  id: number;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
  datumRegistracije: string;
  poslednjePrijavljivanje?: string;
  zaposleniId?: number;
  zaposleni?: Zaposleni;
}

// DTO tipovi za kreiranje i ažuriranje
export interface ZaposleniDto {
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  odsekId?: number;
}

export interface PlataDto {
  zaposleniId: number;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  period: string;
  napomene?: string;
}

export interface ZahtevZaOdmorDto {
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog?: string;
  tipOdmora: string;
}

// Auth tipovi
export interface LoginDto {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  email: string;
  role: string;
  zaposleniId?: number;
  expiresAt: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  zaposleniId?: number;
}

export interface AuthResponse {
  token: string;
  user: Korisnik;
}

export * from './types';