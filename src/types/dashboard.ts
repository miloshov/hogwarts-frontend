// Dashboard specific types

export interface DashboardStatistics {
  ukupnoZaposlenih: number;
  ukupnoOdseka: number;
  prosecnaPlata: number;
  ukupneMesecnePlate: number;
  aktivniZahtevi: number;
  odobrenihZahteva: number;
  odbacenihZahteva: number;
  noviZaposleni: number;
}

export interface RecentActivity {
  id: number;
  tip: string;
  naslov: string;
  opis: string;
  datum: string;
  zaposleniId: number;
  zaposleni: string;
}

export interface ChartData {
  zaposleniPoOdsecima: {
    naziv: string;
    brojZaposlenih: number;
  }[];
  mesecneStatistike: {
    mesec: string;
    ukupnePlate: number;
    brojZahteva: number;
    noviZaposleni: number;
  }[];
  platneGrupe: {
    grupa: string;
    broj: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface SearchAndSortParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  ascending?: boolean;
}