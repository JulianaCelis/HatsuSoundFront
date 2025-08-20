import React, { useState } from 'react';
import { AudioProduct } from '../../types/audio-product.model';
import './AudioProductCard.css';

interface AudioProductCardProps {
  product: AudioProduct;
  onPlay?: (product: AudioProduct) => void;
  onAddToCart?: (product: AudioProduct) => void;
}

export const AudioProductCard: React.FC<AudioProductCardProps> = ({
  product,
  onPlay,
  onAddToCart,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getGenreColor = (genre: string): string => {
    const genreColors: Record<string, string> = {
      rock: 'bg-red-500',
      pop: 'bg-pink-500',
      jazz: 'bg-purple-500',
      classical: 'bg-blue-500',
      electronic: 'bg-cyan-500',
      hip_hop: 'bg-orange-500',
      country: 'bg-green-500',
      blues: 'bg-indigo-500',
      reggae: 'bg-yellow-500',
      folk: 'bg-emerald-500',
      other: 'bg-gray-500',
    };
    return genreColors[genre] || 'bg-gray-500';
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(product);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setShowAddedNotification(true);
      setTimeout(() => setShowAddedNotification(false), 2000);
    }
  };

  return (
    <div
      className="audio-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Notificación de agregado al carrito */}
      {showAddedNotification && (
        <div className="added-notification">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          ¡Agregado al carrito!
        </div>
      )}
      
      {/* Disco giratorio */}
      <div className="vinyl-container">
        <div className={`vinyl-disc ${isHovered ? 'spinning' : ''}`}>
          <div className="vinyl-center">
            <div className="vinyl-label">
              <span className="vinyl-title">{product.title}</span>
              <span className="vinyl-artist">{product.artist}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-title">{product.title}</h3>
          {product.isExplicit && (
            <span className="explicit-badge">EXPLÍCITO</span>
          )}
        </div>
        
        <p className="product-artist">{product.artist}</p>
        
        <div className="product-meta">
          <span className={`genre-badge ${getGenreColor(product.genre)}`}>
            {product.genre.replace('_', ' ').toUpperCase()}
          </span>
          <span className="duration-badge">
            {formatDuration(product.duration)}
          </span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-stats">
          <div className="stat">
            <span className="stat-label">Reproducciones</span>
            <span className="stat-value">{product.playCount.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Descargas</span>
            <span className="stat-value">{product.downloadCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="product-footer">
          <div className="price-section">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="stock-info">
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </span>
          </div>

          <div className="action-buttons">
            <button
              className="btn-play"
              onClick={handlePlay}
              disabled={product.stock === 0}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Reproducir
            </button>
            
            <button
              className="btn-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒
            </button>
          </div>
        </div>

        <div className="product-tags">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
