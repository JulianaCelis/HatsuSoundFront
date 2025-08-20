import { buildAudioProductsUrl, API_CONFIG } from '../config/api';
import { AudioProduct, AudioProductFilters, AudioProductsResponse, AudioProductStats } from '../types/audio-product.model';

class AudioProductsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(API_CONFIG.TOKEN.STORAGE_KEYS.ACCESS_TOKEN);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      if (response.status === 429) {
        throw new Error('Demasiadas solicitudes. Intenta más tarde');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }
    return response.json();
  }

  async getProducts(filters: AudioProductFilters = {}): Promise<AudioProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${buildAudioProductsUrl(API_CONFIG.ENDPOINTS.AUDIO_PRODUCTS.LIST)}?${params}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AudioProductsResponse>(response);
  }

  async searchProducts(filters: AudioProductFilters = {}): Promise<AudioProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${buildAudioProductsUrl(API_CONFIG.ENDPOINTS.AUDIO_PRODUCTS.SEARCH)}?${params}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AudioProductsResponse>(response);
  }

  async getProductById(id: string): Promise<AudioProduct> {
    const url = buildAudioProductsUrl(API_CONFIG.ENDPOINTS.AUDIO_PRODUCTS.BY_ID, id);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AudioProduct>(response);
  }

  async incrementPlayCount(id: string): Promise<AudioProductStats> {
    const url = buildAudioProductsUrl(API_CONFIG.ENDPOINTS.AUDIO_PRODUCTS.PLAY, id);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AudioProductStats>(response);
  }

  async incrementDownloadCount(id: string): Promise<AudioProductStats> {
    const url = buildAudioProductsUrl(API_CONFIG.ENDPOINTS.AUDIO_PRODUCTS.DOWNLOAD, id);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AudioProductStats>(response);
  }
}

export const audioProductsService = new AudioProductsService();
export default audioProductsService;
