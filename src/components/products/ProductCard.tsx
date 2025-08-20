import React, { useState } from 'react';
import { AudioProduct } from '../../types/audio-product.model';
import './ProductCard.css';

interface ProductCardProps {
  product: AudioProduct;
  onPlay: (productId: string) => void;
  onDownload: (productId: string) => void;
  onAddToCart: (product: AudioProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPlay, 
  onDownload, 
  onAddToCart 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
    onPlay(product.id);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    onAddToCart(product);
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="card-background" />
      
      {/* Header section */}
      <div className="card-header">
        <div className="genre-badge">
          <span className="genre-text">{product.genre}</span>
        </div>
        <div className="format-badge">
          <span className="format-text">{product.format.toUpperCase()}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="card-content">
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-artist">{product.artist}</p>
          
          <div className="product-meta">
            <span className="duration">
              <span className="meta-icon">⏱️</span>
              {formatDuration(product.duration)}
            </span>
            <span className="bitrate">
              <span className="meta-icon">🎵</span>
              {product.bitrate}kbps
            </span>
          </div>
        </div>

        {/* Spinning disc preview */}
        <div className="disc-container">
          <div 
            className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}
            onClick={handlePlayClick}
          >
            <div className="disc-center">
              <div className="disc-hole" />
            </div>
            <div className="disc-grooves" />
            <div className="disc-label">
              <span className="disc-title">{product.title.substring(0, 8)}</span>
              <span className="disc-artist">{product.artist.substring(0, 6)}</span>
            </div>
          </div>
          
          {/* Play indicator */}
          <div className={`play-indicator ${isPlaying ? 'active' : ''}`}>
            <div className="play-pulse" />
            <span className="play-text">PREVIEW</span>
          </div>
        </div>

        {/* Price and stats */}
        <div className="price-section">
          <div className="price-container">
            <span className="price-amount">{formatPrice(product.price)}</span>
            <span className="price-label">USD</span>
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-icon">▶️</span>
              <span className="stat-value">{product.playCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⬇️</span>
              <span className="stat-value">{product.downloadCount}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="tags-container">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={tag} 
              className="tag"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button 
            className={`cart-button ${isAddingToCart ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <span className="button-content">
              <span className="button-icon">🛒</span>
              <span className="button-text">
                {isAddingToCart ? 'Añadido!' : 'Añadir al Carrito'}
              </span>
            </span>
            <div className="button-ripple" />
          </button>
          
          <button 
            className="download-button"
            onClick={() => onDownload(product.id)}
          >
            <span className="button-content">
              <span className="button-icon">⬇️</span>
              <span className="button-text">Descargar</span>
            </span>
          </button>
        </div>
      </div>

      {/* Hover effects */}
      <div className="hover-effects">
        <div className="hover-glow" />
        <div className="hover-particles" />
      </div>
    </div>
  );
};
