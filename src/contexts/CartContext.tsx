import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { AudioProduct } from '../types/audio-product.model';
import { Cart, CartItem, CartContextType } from '../types/cart.model';

// Constantes
const CART_STORAGE_KEY = 'hatsu_sound_cart';
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Acciones del carrito
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: AudioProduct; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SYNC_CART'; payload: Cart };

// Estado inicial
const initialState: Cart = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Función para calcular totales del carrito
const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Función para validar y limpiar datos del carrito
const validateCartData = (cartData: any): Cart | null => {
  try {
    // Validar estructura básica
    if (!cartData || typeof cartData !== 'object') return null;
    if (!Array.isArray(cartData.items)) return null;
    
    // Validar y limpiar items
    const validItems = cartData.items
      .filter((item: any) => 
        item && 
        item.product && 
        item.product.id && 
        typeof item.quantity === 'number' && 
        item.quantity > 0 &&
        item.product.price > 0
      )
      .map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt || Date.now()),
        quantity: Math.max(1, Math.floor(item.quantity)), // Asegurar cantidad válida
      }));

    // Recalcular totales
    const { total, itemCount } = calculateCartTotals(validItems);
    
    return {
      items: validItems,
      total: Math.max(0, total),
      itemCount: Math.max(0, itemCount),
    };
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ Error validating cart data:', error);
    }
    return null;
  }
};

// Función para cargar carrito desde localStorage
const loadCartFromStorage = (): Cart => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return initialState;

    const parsedCart = JSON.parse(savedCart);
    const validatedCart = validateCartData(parsedCart);
    
    if (validatedCart) {
      if (DEBUG_MODE) {
        console.log('✅ Cart loaded from localStorage:', validatedCart);
      }
      return validatedCart;
    }
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ Error loading cart from localStorage:', error);
    }
    // Limpiar localStorage corrupto
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  
  return initialState;
};

// Función para guardar carrito en localStorage
const saveCartToStorage = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    if (DEBUG_MODE) {
      console.log('💾 Cart saved to localStorage:', {
        itemsCount: cart.items.length,
        total: cart.total,
        itemCount: cart.itemCount,
      });
    }
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ Error saving cart to localStorage:', error);
    }
  }
};

// Reducer optimizado del carrito
function cartReducer(state: Cart, action: CartAction): Cart {
  if (DEBUG_MODE) {
    console.log('🔄 CartReducer:', action.type, 'payload' in action ? action.payload : 'no payload');
  }

  let newState: Cart;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Actualizar cantidad existente
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Agregar nuevo item
        newItems = [...state.items, {
          product,
          quantity,
          addedAt: new Date(),
        }];
      }
      
      const { total, itemCount } = calculateCartTotals(newItems);
      newState = { items: newItems, total, itemCount };
      break;
    }
    
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.product.id !== productId);
      const { total, itemCount } = calculateCartTotals(newItems);
      newState = { items: newItems, total, itemCount };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover del carrito
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
          : item
      );
      
      const { total, itemCount } = calculateCartTotals(newItems);
      newState = { items: newItems, total, itemCount };
      break;
    }
    
    case 'CLEAR_CART':
      newState = initialState;
      break;
    
    case 'SYNC_CART':
      newState = action.payload;
      break;
    
    default:
      return state;
  }

  if (DEBUG_MODE) {
    console.log('📤 New cart state:', newState);
  }

  return newState;
}

// Crear contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Proveedor del contexto optimizado
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización síncrona desde localStorage
  const [cart, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Funciones del carrito optimizadas con useCallback
  const addToCart = useCallback((product: AudioProduct, quantity: number = 1) => {
    if (quantity <= 0) return;
    
    if (DEBUG_MODE) {
      console.log('🛒 Adding to cart:', product.title, 'quantity:', quantity);
    }
    
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (DEBUG_MODE) {
      console.log('🗑️ Removing from cart:', productId);
    }
    
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (DEBUG_MODE) {
      console.log('📝 Updating quantity:', productId, 'to:', quantity);
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    if (DEBUG_MODE) {
      console.log('🧹 Clearing cart');
    }
    
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const isInCart = useCallback((productId: string): boolean => {
    return cart.items.some(item => item.product.id === productId);
  }, [cart.items]);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  // Valor del contexto memoizado
  const contextValue = useMemo<CartContextType>(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }), [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
