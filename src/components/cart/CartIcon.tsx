import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import './CartIcon.css';

interface CartIconProps {
  onClick?: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { cart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="cart-icon-container"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cart-icon">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
        
        {/* Contador de items */}
        {cart.itemCount > 0 && (
          <span className="cart-badge">
            {cart.itemCount > 99 ? '99+' : cart.itemCount}
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="cart-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-title">Carrito de Compras</span>
            <span className="tooltip-count">{cart.itemCount} items</span>
          </div>
          <div className="tooltip-total">
            Total: ${cart.total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};
