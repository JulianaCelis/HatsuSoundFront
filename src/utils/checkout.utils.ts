import { CheckoutData, ValidationResult } from '../types/checkout.types';

/**
 * Validates email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates credit card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check length (13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm - start from right to left
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates expiry date format and ensures it's in the future
 */
export function validateExpiryDate(expiryDate: string): boolean {
  // Accept formats: MM/YY, MM/YYYY, MM-YY, MM-YYYY
  const dateRegex = /^(\d{1,2})[\/\-](\d{2,4})$/;
  const match = expiryDate.match(dateRegex);
  
  if (!match) {
    return false;
  }
  
  const month = parseInt(match[1]);
  const year = parseInt(match[2]);
  
  // Validate month (1-12)
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Convert 2-digit year to 4-digit
  const fullYear = year < 100 ? 2000 + year : year;
  
  // Check if date is in the future
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  
  if (fullYear < currentYear) {
    return false;
  }
  
  if (fullYear === currentYear && month <= currentMonth) {
    return false;
  }
  
  return true;
}

/**
 * Validates CVV code
 */
export function validateCVV(cvv: string): boolean {
  // CVV should be 3-4 digits
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
}

/**
 * Formats price with currency symbol and proper formatting
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Calculates total from cart items
 */
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Validates complete checkout data
 */
export function validateCheckoutData(data: CheckoutData): ValidationResult {
  const errors: string[] = [];
  
  // Validate email
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Invalid email address');
  }
  
  // Validate card number
  if (!data.cardNumber || !validateCardNumber(data.cardNumber)) {
    errors.push('Invalid card number');
  }
  
  // Validate expiry date
  if (!data.expiryDate || !validateExpiryDate(data.expiryDate)) {
    errors.push('Invalid expiry date');
  }
  
  // Validate CVV
  if (!data.cvv || !validateCVV(data.cvv)) {
    errors.push('Invalid CVV');
  }
  
  // Validate cart items
  if (!data.items || data.items.length === 0) {
    errors.push('Cart cannot be empty');
  }
  
  // Validate total matches calculated total
  const calculatedTotal = calculateTotal(data.items);
  if (Math.abs(data.total - calculatedTotal) > 0.01) {
    errors.push('Total amount mismatch');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
