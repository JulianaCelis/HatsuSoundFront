import React from 'react';
import { AudioProductCard } from './AudioProductCard';
import { AudioProduct, AudioProductFilters } from '../../types/audio-product.model';
import { useAudioProducts } from '../../hooks/useAudioProducts';
import { useCart } from '../../contexts/CartContext';
import './AudioProductsList.css';

interface AudioProductsListProps {
  initialFilters?: AudioProductFilters;
  onProductAdded?: () => void; // Nueva prop para notificar cuando se agrega un producto
}

export const AudioProductsList: React.FC<AudioProductsListProps> = ({ 
  initialFilters = {}, 
  onProductAdded 
}) => {
  const {
    products,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    refetch,
  } = useAudioProducts(initialFilters);

  const { addToCart } = useCart();

  const handlePlay = (product: AudioProduct) => {
    console.log('Reproduciendo:', product.title);
    // Aquí implementarías la lógica de reproducción
  };

  const handleAddToCart = (product: AudioProduct) => {
    addToCart(product, 1);
    console.log('Producto agregado al carrito:', product.title);
    
    // Notificar que se agregó un producto para abrir el carrito
    if (onProductAdded) {
      onProductAdded();
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Error al cargar productos</h3>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={refetch}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">🎵</div>
        <h3 className="empty-title">No se encontraron productos</h3>
        <p className="empty-message">
          Intenta ajustar los filtros o busca con otros términos
        </p>
      </div>
    );
  }

  return (
    <div className="audio-products-container">
      {/* Header con estadísticas */}
      <div className="products-header">
        <div className="products-count">
          <span className="count-number">{total}</span>
          <span className="count-label">productos encontrados</span>
        </div>
        <div className="products-actions">
          <button className="refresh-button" onClick={refetch}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {products.map((product) => (
          <AudioProductCard
            key={product.id}
            product={product}
            onPlay={handlePlay}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Botón de cargar más */}
      {hasMore && (
        <div className="load-more-container">
          <button
            className="load-more-button"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-dots"></div>
                Cargando más...
              </>
            ) : (
              'Cargar más productos'
            )}
          </button>
        </div>
      )}

      {/* Indicador de carga para "cargar más" */}
      {loading && products.length > 0 && (
        <div className="loading-more-indicator">
          <div className="loading-spinner small"></div>
          <span>Cargando más productos...</span>
        </div>
      )}
    </div>
  );
};
