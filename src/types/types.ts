// Enum za pol zaposlenog
export enum Pol {
  Muski = 'Muski',
  Zenski = 'Zenski',
}

// Zadržavam Gender za kompatibilnost
export enum Gender {
  Muski = 1,
  Zenski = 2,
}

// Existing interfaces...
export interface Zaposleni {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  pozicijaId?: number; // Dodano za nova polja
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  punoIme: string;
  godine: number;
  odsekId: number | null;
  odsekNaziv?: string;
  isActive: boolean;
  datumKreiranja: string;
  
  // 🆕 NOVA POLJA ZA SLIKE
  profileImageUrl?: string | null;
  pol?: Pol; // Promenio na optional i koristim Pol umesto Gender
  avatarUrl?: string;
  odsek?: Odsek; // Dodao za odsek povezanost
}

export interface ZaposleniDto {
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  pozicijaId?: number; // Dodano za dropdown izbor pozicije
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  odsekId: number | null;
  pol?: Pol; // 🆕 DODANO i optional
}

export interface Odsek {
  id: number;
  naziv: string;
  opis?: string;
  datumKreiranja: string;
}

export interface Plata {
  id: number;
  zaposleniId: number;
  zaposleni?: Zaposleni;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  neto: number;
  period: string;
  napomene?: string;
  datumKreiranja: string;
}

export interface PlataDto {
  zaposleniId: number;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  period: string;
  napomene?: string;
}

export interface ZahtevZaOdmor {
  id: number;
  zaposleniId: number;
  zaposleni?: Zaposleni;
  datumOd: string;
  datumDo: string;
  razlog?: string;
  status: StatusZahteva;
  napomeneAdministratora?: string;
  datumKreiranja: string;
  datumOdobravanja?: string;
}

export interface ZahtevZaOdmorDto {
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog?: string;
}

export enum StatusZahteva {
  NaCekanju = 'NaCekanju',
  Odobren = 'Odobren',
  Odbijen = 'Odbijen',
}

export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  zaposleniId?: number;
  zaposleni?: Zaposleni; // 🆕 DODANO za avatar u header-u
}

export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  Token: string;
  UserName: string;
  Role: string;
  ZaposleniId?: number;
}

// 🆕 NOVI INTERFACE ZA FILE UPLOAD
export interface FileUploadResponse {
  message: string;
  imageUrl: string;
  avatarUrl?: string;
}

// Dashboard interfaces
export interface DashboardStatistics {
  ukupnoZaposlenih: number;
  ukupnoOdseka: number;
  ukupnePlate: number;
  aktivniZahtevi: number;
}

export interface RecentActivity {
  id: number;
  tip: string;
  opis: string;
  datum: string;
  korisnik: string;
}

export interface ChartData {
  plataPoOdsecima: Array<{
    odsek: string;
    iznos: number;
  }>;
  zaposleniPoGodinama: Array<{
    godina: number;
    broj: number;
  }>;
}