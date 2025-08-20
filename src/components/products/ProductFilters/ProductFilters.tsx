import React from 'react';
import { ProductFilters as ProductFiltersType } from '../../../types/audio-product.model';
import './ProductFilters.css';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (key: keyof ProductFiltersType, value: any) => void;
  onResetFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const genres = [
    'rock', 'pop', 'jazz', 'classical', 'electronic', 
    'hip-hop', 'country', 'blues', 'reggae', 'folk', 'other'
  ];

  const sortOptions = [
    { value: 'title', label: 'Título' },
    { value: 'artist', label: 'Artista' },
    { value: 'price', label: 'Precio' },
    { value: 'releaseDate', label: 'Fecha de lanzamiento' },
    { value: 'playCount', label: 'Reproducciones' }
  ];

  const handleInputChange = (key: keyof ProductFiltersType, value: any) => {
    // Convert numeric values
    if (key === 'page' || key === 'limit' || key === 'minPrice' || key === 'maxPrice') {
      const numValue = value === '' ? undefined : Number(value);
      onFilterChange(key, numValue);
    } else {
      onFilterChange(key, value);
    }
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3 className="filters-title">Filtros y Ordenamiento</h3>
        <button 
          className="btn-reset"
          onClick={onResetFilters}
        >
          Limpiar filtros
        </button>
      </div>

      <div className="filters-grid">
        {/* Género */}
        <div className="filter-group">
          <label className="filter-label">Género musical</label>
          <select 
            className="filter-select"
            value={filters.genre || ''} 
            onChange={(e) => handleInputChange('genre', e.target.value)}
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
            placeholder="Buscar por artista..."
            value={filters.artist || ''}
            onChange={(e) => handleInputChange('artist', e.target.value)}
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
            value={filters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
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
            value={filters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
          />
        </div>

        {/* Elementos por página */}
        <div className="filter-group">
          <label className="filter-label">Elementos por página</label>
          <select 
            className="filter-select"
            value={filters.limit || 20} 
            onChange={(e) => handleInputChange('limit', e.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Estado activo */}
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select 
            className="filter-select"
            value={filters.isActive === undefined ? '' : filters.isActive.toString()} 
            onChange={(e) => handleInputChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
          >
            <option value="">Todos</option>
            <option value="true">Solo activos</option>
            <option value="false">Solo inactivos</option>
          </select>
        </div>
      </div>

      <div className="sorting-section">
        <h4 className="sorting-title">Ordenamiento</h4>
        <div className="sorting-controls">
          <select 
            className="filter-select"
            value={filters.sortBy || 'title'} 
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button 
            className={`btn-sort ${filters.sortOrder === 'desc' ? 'desc' : 'asc'}`}
            onClick={() => handleInputChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Ordenar ${filters.sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};
