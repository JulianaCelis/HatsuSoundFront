import React, { useState } from 'react';
import { SearchFilters } from '../../types/audio-product.model';
import './ProductSearch.css';

interface ProductSearchProps {
  onSearch: (searchUrl: string) => void;
  onClearSearch: () => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onSearch, 
  onClearSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<Omit<SearchFilters, 'query'>>({
    genre: '',
    artist: '',
    minPrice: undefined,
    maxPrice: undefined
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const genres = [
    'rock', 'pop', 'jazz', 'classical', 'electronic', 
    'hip-hop', 'country', 'blues', 'reggae', 'folk', 'other'
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams({
        query: searchQuery,
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, value]) => 
            value !== undefined && value !== null && value !== ''
          )
        )
      }).toString();
      
      onSearch(`/api/audio-products/search?${queryParams}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchFilters({
      genre: '',
      artist: '',
      minPrice: undefined,
      maxPrice: undefined
    });
    onClearSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof typeof searchFilters, value: any) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      const numValue = value === '' ? undefined : Number(value);
      setSearchFilters(prev => ({ ...prev, [key]: numValue }));
    } else {
      setSearchFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="product-search">
      <div className="search-main">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar canciones, artistas, géneros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="search-button"
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
          >
            <span className="search-icon">🔍</span>
            Buscar
          </button>
        </div>
        
        <button 
          className="btn-toggle-filters"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {isExpanded && (
        <div className="search-filters">
          <div className="search-filters-grid">
            {/* Género */}
            <div className="filter-group">
              <label className="filter-label">Género musical</label>
              <select 
                className="filter-select"
                value={searchFilters.genre || ''} 
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Artista */}
            <div className="filter-group">
              <label className="filter-label">Artista/Banda</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Filtrar por artista..."
                value={searchFilters.artist || ''}
                onChange={(e) => handleFilterChange('artist', e.target.value)}
              />
            </div>

            {/* Precio mínimo */}
            <div className="filter-group">
              <label className="filter-label">Precio mínimo</label>
              <input
                type="number"
                className="filter-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={searchFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            {/* Precio máximo */}
            <div className="filter-group">
              <label className="filter-label">Precio máximo</label>
              <input
                type="number"
                className="filter-input"
                placeholder="100.00"
                min="0"
                step="0.01"
                value={searchFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="search-actions">
            <button 
              className="btn-clear-search"
              onClick={handleClearSearch}
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
