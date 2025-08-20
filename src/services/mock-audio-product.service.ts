import { AudioProduct, ProductListResponse, ProductFilters as ProductFiltersType, SearchFilters } from '../types/audio-product.model';
import { mockProducts, mockProductListResponse } from '../data/mock-products';

export class MockAudioProductService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProducts(filters: ProductFiltersType = {}): Promise<ProductListResponse> {
    // Simulate API delay
    await this.delay(500);

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (filters.genre) {
      filteredProducts = filteredProducts.filter(p => 
        p.genre.toLowerCase() === filters.genre!.toLowerCase()
      );
    }

    if (filters.artist) {
      filteredProducts = filteredProducts.filter(p => 
        p.artist.toLowerCase().includes(filters.artist!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.isActive !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isActive === filters.isActive);
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any = a[filters.sortBy!];
        let bValue: any = b[filters.sortBy!];

        // Handle special cases
        if (filters.sortBy === 'releaseDate') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

  async searchProducts(searchFilters: SearchFilters): Promise<ProductListResponse> {
    // Simulate API delay
    await this.delay(600);

    const { query, genre, artist, minPrice, maxPrice, page = 1, limit = 20 } = searchFilters;

    let filteredProducts = mockProducts.filter(product => {
      // Text search
      const searchText = query.toLowerCase();
      const matchesQuery = 
        product.title.toLowerCase().includes(searchText) ||
        product.artist.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchText)) ||
        product.genre.toLowerCase().includes(searchText);

      if (!matchesQuery) return false;

      // Additional filters
      if (genre && product.genre.toLowerCase() !== genre.toLowerCase()) return false;
      if (artist && !product.artist.toLowerCase().includes(artist.toLowerCase())) return false;
      if (minPrice !== undefined && product.price < minPrice) return false;
      if (maxPrice !== undefined && product.price > maxPrice) return false;

      return true;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

  async getProductById(id: string): Promise<AudioProduct> {
    // Simulate API delay
    await this.delay(300);

    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async incrementPlayCount(id: string): Promise<void> {
    // Simulate API delay
    await this.delay(200);

    const product = mockProducts.find(p => p.id === id);
    if (product) {
      product.playCount++;
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    // Simulate API delay
    await this.delay(200);

    const product = mockProducts.find(p => p.id === id);
    if (product) {
      product.downloadCount++;
    }
  }
}

export const mockAudioProductService = new MockAudioProductService();
