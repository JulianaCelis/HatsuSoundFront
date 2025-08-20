import { useState, useEffect, useCallback } from 'react';
import { AudioProduct, AudioProductFilters, AudioProductsResponse } from '../types/audio-product.model';
import mockAudioProductsService from '../services/mock-audio-products.service';

interface UseAudioProductsReturn {
  products: AudioProduct[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
  setFilters: (filters: AudioProductFilters) => void;
  clearFilters: () => void;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const useAudioProducts = (initialFilters: AudioProductFilters = {}): UseAudioProductsReturn => {
  const [products, setProducts] = useState<AudioProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<AudioProductFilters>({
    page: 1,
    limit: 12,
    ...initialFilters
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const currentFilters = { ...filters, page: currentPage };
      
      // Por ahora usamos el servicio mock, cuando tengas el backend cambia a audioProductsService
      const response: AudioProductsResponse = await mockAudioProductsService.getProducts(currentFilters);
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...response.products]);
        setPage(currentPage);
      } else {
        setProducts(response.products);
        setPage(1);
      }
      
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const setFilters = useCallback((newFilters: AudioProductFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({ page: 1, limit: 12 });
  }, []);

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      await fetchProducts(true);
    }
  }, [page, totalPages, loading, fetchProducts]);

  const refetch = useCallback(async () => {
    await fetchProducts(false);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(false);
  }, [filters]);

  const hasMore = page < totalPages;

  return {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
    setFilters,
    clearFilters,
    loadMore,
    hasMore,
  };
};
