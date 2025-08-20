import React, { useState, useEffect } from 'react';
import { AudioProduct, ProductListResponse, ProductFilters as ProductFiltersType } from '../../types/audio-product.model';
import { audioProductService } from '../../services/audio-product.service';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { ProductSearch } from './ProductSearch';
import { Pagination } from '../ui/common/Pagination';
import './ProductList.css';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<AudioProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12
  });

  const [filters, setFilters] = useState<ProductFiltersType>({
    page: 1,
    limit: 12,
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, [filters, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ProductListResponse = await audioProductService.getProducts(filters);
      
      setProducts(response.products);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.page,
        limit: response.limit
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'title',
      sortOrder: 'asc'
    });
    setSearchQuery('');
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (searchUrl: string) => {
    // Extract query from URL and update search
    const urlParams = new URLSearchParams(searchUrl.split('?')[1]);
    const query = urlParams.get('query') || '';
    setSearchQuery(query);
    
    // Update filters with search parameters
    const newFilters = { ...filters, page: 1 };
    
    const genre = urlParams.get('genre');
    if (genre) newFilters.genre = genre;
    
    const artist = urlParams.get('artist');
    if (artist) newFilters.artist = artist;
    
    const minPrice = urlParams.get('minPrice');
    if (minPrice) newFilters.minPrice = Number(minPrice);
    
    const maxPrice = urlParams.get('maxPrice');
    if (maxPrice) newFilters.maxPrice = Number(maxPrice);
    
    setFilters(newFilters);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters(prev => ({
      ...prev,
      genre: undefined,
      artist: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1
    }));
  };

  const handlePlay = (productId: string) => {
    console.log('Playing product:', productId);
    // Implement audio playback logic
  };

  const handleDownload = (productId: string) => {
    console.log('Downloading product:', productId);
    // Implement download logic
  };

  const handleAddToCart = (product: AudioProduct) => {
    console.log('Adding to cart:', product);
    // Implement add to cart logic
  };

  if (loading) {
    return (
      <div className="product-list-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <p>Error: {error}</p>
        <button onClick={loadProducts}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Catálogo de Productos</h2>
        <p>Encuentra tu música favorita en alta calidad</p>
      </div>

      <ProductSearch 
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />

      <div className="product-list-content">
        <aside className="filters-sidebar">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </aside>

        <main className="products-main">
          {products.length === 0 ? (
            <div className="no-products">
              <p>No se encontraron productos con los filtros seleccionados.</p>
              <button onClick={handleResetFilters}>Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPlay={handlePlay}
                    onDownload={handleDownload}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
