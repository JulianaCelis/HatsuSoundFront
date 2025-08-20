export interface AudioProduct {
  id: string;
  title: string;
  description: string;
  artist: string;
  genre: 'rock' | 'pop' | 'jazz' | 'classical' | 'electronic' | 'hip_hop' | 'country' | 'blues' | 'reggae' | 'folk' | 'other';
  audioUrl: string;
  duration: number; // en segundos
  format: 'mp3' | 'wav' | 'flac' | 'aac' | 'ogg';
  bitrate: number; // en kbps
  price: number;
  stock: number;
  isActive: boolean;
  tags: string[];
  releaseDate: string; // ISO date string
  language: string;
  isExplicit: boolean;
  ageRestriction: 0 | 13 | 18 | 21; // 0 = ALL_AGES
  playCount: number;
  downloadCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AudioProductFilters {
  query?: string;
  artist?: string;
  genre?: AudioProduct['genre'];
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'artist' | 'price' | 'releaseDate' | 'playCount';
  sortOrder?: 'asc' | 'desc';
}

export interface AudioProductsResponse {
  products: AudioProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AudioProductStats {
  playCount: number;
  downloadCount: number;
}
