// Types for checkout utilities

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CheckoutData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  items: CartItem[];
  total: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
