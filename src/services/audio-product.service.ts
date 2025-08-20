import { AudioProduct, ProductListResponse, ProductFilters as ProductFiltersType, SearchFilters } from '../types/audio-product.model';

const API_BASE_URL = '/api/audio-products';

export class AudioProductService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwt_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getProducts(filters: ProductFiltersType = {}): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    return response.json();
  }

  async searchProducts(searchFilters: SearchFilters): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/search?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error searching products: ${response.statusText}`);
    }

    return response.json();
  }

  async getProductById(id: string): Promise<AudioProduct> {
    const url = `${API_BASE_URL}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }

    return response.json();
  }

  async incrementPlayCount(id: string): Promise<void> {
    const url = `${API_BASE_URL}/${id}/play`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error incrementing play count: ${response.statusText}`);
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const url = `${API_BASE_URL}/${id}/download`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error incrementing download count: ${response.statusText}`);
    }
  }
}

// Use mock service for development/testing
// Switch to real service when backend is available
import { mockAudioProductService } from './mock-audio-product.service';

export const audioProductService = mockAudioProductService;
