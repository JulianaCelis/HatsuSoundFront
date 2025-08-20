import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { CheckoutModal } from '../checkout';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Elementos decorativos musicales */}
        <div className="music-notes">
          <div className="note note-1">♪</div>
          <div className="note note-2">♫</div>
          <div className="note note-3">♪</div>
          <div className="note note-4">♬</div>
        </div>

        {/* Header del modal */}
        <div className="cart-modal-header">
          <div className="cart-header-content">
            <div className="cart-icon-wrapper">
              <div className="cart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="m1 1 4 4 6.9 6.3a1.8 1.8 0 0 0 1.3.6h8.7a2 2 0 0 0 2-1.8L22 8H7"/>
                </svg>
                <div className="cart-badge">{getTotalItems()}</div>
              </div>
            </div>
            <div className="cart-title-section">
              <h2 className="cart-modal-title">Mi Colección Musical</h2>
              <p className="cart-subtitle">{cart.items.length} canciones seleccionadas</p>
            </div>
          </div>
          
          <button className="cart-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m6 6 12 12M6 18 18 6"/>
            </svg>
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="cart-modal-content">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-animation">
                <div className="empty-vinyl">
                  <div className="vinyl-disc empty">
                    <div className="vinyl-center"></div>
                    <div className="vinyl-grooves">
                      <div className="groove"></div>
                      <div className="groove"></div>
                      <div className="groove"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="cart-empty-title">Tu biblioteca está silenciosa</h3>
              <p className="cart-empty-message">
                Agrega algunas canciones para llenar tu mundo de música
              </p>
              <div className="sound-wave">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de items */}
              <div className="cart-items">
                {cart.items.map((item, index) => (
                  <div key={item.product.id} className="cart-item" style={{'--item-delay': `${index * 0.1}s`} as React.CSSProperties}>
                    <div className="cart-item-vinyl">
                      <div className="vinyl-disc playing">
                        <div className="vinyl-center">
                          <div className="center-hole"></div>
                        </div>
                        <div className="vinyl-grooves">
                          <div className="groove"></div>
                          <div className="groove"></div>
                          <div className="groove"></div>
                          <div className="groove"></div>
                        </div>
                      </div>
                      <div className="play-indicator">
                        <div className="equalizer">
                          <div className="eq-bar"></div>
                          <div className="eq-bar"></div>
                          <div className="eq-bar"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cart-item-content">
                      <div className="cart-item-info">
                        <h4 className="cart-item-title">{item.product.title}</h4>
                        <p className="cart-item-artist">{item.product.artist}</p>
                        <div className="cart-item-tags">
                          <span className="genre-tag">{item.product.genre}</span>
                          <span className="duration-tag">
                            {Math.floor(item.product.duration / 60)}:
                            {(item.product.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <button 
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.product.id, (item.quantity - 1).toString())}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.product.id, (item.quantity + 1).toString())}
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="price-section">
                          <div className="item-total-price">{formatPrice(item.product.price * item.quantity)}</div>
                          <div className="item-unit-price">{formatPrice(item.product.price)} c/u</div>
                        </div>
                        
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.product.id)}
                          title="Remover canción"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen del carrito */}
              <div className="cart-summary">
                <div className="summary-header">
                  <h3>Resumen de tu compra</h3>
                  <div className="summary-icon">♪</div>
                </div>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Canciones ({getTotalItems()})</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Descarga digital</span>
                    <span className="free">GRATIS</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>
              </div>

              {/* Acciones del carrito */}
              <div className="cart-actions">
                <button className="action-btn clear-btn" onClick={clearCart}>
                  <div className="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    </svg>
                  </div>
                  <span>Limpiar</span>
                </button>
                
                <button className="action-btn checkout-btn" onClick={handleCheckout}>
                  <div className="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                    </svg>
                  </div>
                  <span>Comprar Música</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modal de Checkout */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </div>
  );
};