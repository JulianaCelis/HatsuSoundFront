export interface AudioProduct {
  id: string;
  title: string;
  description: string;
  artist: string;
  genre: string;
  audioUrl: string;
  duration: number;
  format: string;
  bitrate: number;
  price: number;
  stock: number;
  isActive: boolean;
  tags: string[];
  releaseDate: string;
  language: string;
  isExplicit: boolean;
  ageRestriction: number;
  playCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: AudioProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  genre?: string;
  artist?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: 'title' | 'artist' | 'price' | 'releaseDate' | 'playCount';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query: string;
  genre?: string;
  artist?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
