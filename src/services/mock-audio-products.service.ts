import { AudioProduct, AudioProductFilters, AudioProductsResponse } from '../types/audio-product.model';

// Datos mock de productos de audio
const mockProducts: AudioProduct[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    description: 'Una experiencia musical nocturna que te transportará a un mundo de ensueños y melodías etéreas.',
    artist: 'Luna Echo',
    genre: 'electronic',
    audioUrl: 'https://example.com/midnight-dreams.mp3',
    duration: 245,
    format: 'mp3',
    bitrate: 320,
    price: 9.99,
    stock: 150,
    isActive: true,
    tags: ['ambient', 'chill', 'electronic', 'dreamy'],
    releaseDate: '2024-01-15T00:00:00.000Z',
    language: 'Instrumental',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 15420,
    downloadCount: 3240,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Rock Anthem',
    description: 'Poderoso riff de guitarra que despertará tu espíritu rockero y te hará sentir invencible.',
    artist: 'Thunder Road',
    genre: 'rock',
    audioUrl: 'https://example.com/rock-anthem.mp3',
    duration: 198,
    format: 'mp3',
    bitrate: 320,
    price: 12.99,
    stock: 89,
    isActive: true,
    tags: ['rock', 'guitar', 'powerful', 'anthem'],
    releaseDate: '2024-01-10T00:00:00.000Z',
    language: 'English',
    isExplicit: true,
    ageRestriction: 18,
    playCount: 28940,
    downloadCount: 5670,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Jazz in the Rain',
    description: 'Melodías suaves de jazz que se mezclan perfectamente con el sonido de la lluvia.',
    artist: 'Blue Note Collective',
    genre: 'jazz',
    audioUrl: 'https://example.com/jazz-rain.mp3',
    duration: 312,
    format: 'wav',
    bitrate: 1411,
    price: 15.99,
    stock: 45,
    isActive: true,
    tags: ['jazz', 'smooth', 'rain', 'relaxing'],
    releaseDate: '2024-01-08T00:00:00.000Z',
    language: 'Instrumental',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 8760,
    downloadCount: 1890,
    createdAt: '2024-01-08T00:00:00.000Z',
    updatedAt: '2024-01-08T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Pop Sensation',
    description: 'Catchy hooks y melodías contagiosas que se quedarán en tu cabeza por días.',
    artist: 'Star Light',
    genre: 'pop',
    audioUrl: 'https://example.com/pop-sensation.mp3',
    duration: 187,
    format: 'mp3',
    bitrate: 320,
    price: 8.99,
    stock: 200,
    isActive: true,
    tags: ['pop', 'catchy', 'upbeat', 'radio-friendly'],
    releaseDate: '2024-01-12T00:00:00.000Z',
    language: 'English',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 45670,
    downloadCount: 8920,
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-12T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Classical Symphony No. 7',
    description: 'Una obra maestra clásica que te transportará a la época dorada de la música orquestal.',
    artist: 'Vienna Philharmonic',
    genre: 'classical',
    audioUrl: 'https://example.com/symphony-7.flac',
    duration: 1245,
    format: 'flac',
    bitrate: 1411,
    price: 24.99,
    stock: 67,
    isActive: true,
    tags: ['classical', 'orchestra', 'symphony', 'masterpiece'],
    releaseDate: '2024-01-05T00:00:00.000Z',
    language: 'Instrumental',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 12340,
    downloadCount: 2340,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Hip Hop Revolution',
    description: 'Ritmos urbanos y letras que cuentan historias de la vida real en la ciudad.',
    artist: 'Urban Flow',
    genre: 'hip_hop',
    audioUrl: 'https://example.com/hip-hop-revolution.mp3',
    duration: 234,
    format: 'mp3',
    bitrate: 320,
    price: 11.99,
    stock: 120,
    isActive: true,
    tags: ['hip-hop', 'urban', 'beats', 'lyrics'],
    releaseDate: '2024-01-14T00:00:00.000Z',
    language: 'English',
    isExplicit: true,
    ageRestriction: 18,
    playCount: 34560,
    downloadCount: 6780,
    createdAt: '2024-01-14T00:00:00.000Z',
    updatedAt: '2024-01-14T00:00:00.000Z',
  },
  {
    id: '7',
    title: 'Country Roads',
    description: 'Melodías country que te harán sentir en casa, sin importar dónde estés.',
    artist: 'Wild West Band',
    genre: 'country',
    audioUrl: 'https://example.com/country-roads.mp3',
    duration: 267,
    format: 'mp3',
    bitrate: 320,
    price: 10.99,
    stock: 78,
    isActive: true,
    tags: ['country', 'folk', 'acoustic', 'home'],
    releaseDate: '2024-01-11T00:00:00.000Z',
    language: 'English',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 15670,
    downloadCount: 3120,
    createdAt: '2024-01-11T00:00:00.000Z',
    updatedAt: '2024-01-11T00:00:00.000Z',
  },
  {
    id: '8',
    title: 'Blues in the Night',
    description: 'Soul blues que te hará sentir cada nota en tu corazón y alma.',
    artist: 'Delta Blues Trio',
    genre: 'blues',
    audioUrl: 'https://example.com/blues-night.mp3',
    duration: 298,
    format: 'mp3',
    bitrate: 320,
    price: 13.99,
    stock: 56,
    isActive: true,
    tags: ['blues', 'soul', 'guitar', 'emotional'],
    releaseDate: '2024-01-09T00:00:00.000Z',
    language: 'English',
    isExplicit: false,
    ageRestriction: 0,
    playCount: 9870,
    downloadCount: 1980,
    createdAt: '2024-01-09T00:00:00.000Z',
    updatedAt: '2024-01-09T00:00:00.000Z',
  },
];

class MockAudioProductsService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private filterProducts(products: AudioProduct[], filters: AudioProductFilters): AudioProduct[] {
    let filtered = [...products];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.artist.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.artist) {
      filtered = filtered.filter(product =>
        product.artist.toLowerCase().includes(filters.artist!.toLowerCase())
      );
    }

    if (filters.genre) {
      filtered = filtered.filter(product => product.genre === filters.genre);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(product => product.isActive === filters.isActive);
    }

    return filtered;
  }

  private sortProducts(products: AudioProduct[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): AudioProduct[] {
    if (!sortBy) return products;

    const sorted = [...products].sort((a, b) => {
      let aValue: any = a[sortBy as keyof AudioProduct];
      let bValue: any = b[sortBy as keyof AudioProduct];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  private paginateProducts(products: AudioProduct[], page: number = 1, limit: number = 10): AudioProductsResponse {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const total = products.length;
    const totalPages = Math.ceil(total / limit);

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getProducts(filters: AudioProductFilters = {}): Promise<AudioProductsResponse> {
    await this.delay(800); // Simular delay de red

    let filteredProducts = this.filterProducts(mockProducts, filters);
    
    if (filters.sortBy) {
      filteredProducts = this.sortProducts(filteredProducts, filters.sortBy, filters.sortOrder);
    }

    return this.paginateProducts(
      filteredProducts,
      filters.page || 1,
      filters.limit || 12
    );
  }

  async searchProducts(filters: AudioProductFilters = {}): Promise<AudioProductsResponse> {
    return this.getProducts(filters);
  }

  async getProductById(id: string): Promise<AudioProduct> {
    await this.delay(500);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  }

  async incrementPlayCount(id: string): Promise<{ playCount: number; downloadCount: number }> {
    await this.delay(300);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    product.playCount += 1;
    
    return {
      playCount: product.playCount,
      downloadCount: product.downloadCount,
    };
  }

  async incrementDownloadCount(id: string): Promise<{ playCount: number; downloadCount: number }> {
    await this.delay(300);
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    product.downloadCount += 1;
    
    return {
      playCount: product.playCount,
      downloadCount: product.downloadCount,
    };
  }
}

export const mockAudioProductsService = new MockAudioProductsService();
export default mockAudioProductsService;
