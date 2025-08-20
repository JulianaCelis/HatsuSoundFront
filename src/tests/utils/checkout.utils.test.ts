import {
  validateCheckoutData,
  formatPrice,
  calculateTotal,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateEmail
} from '../../utils/checkout.utils';
import { CheckoutData } from '../../types/checkout.types';

describe('checkout.utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateCardNumber', () => {
    it('should validate correct card numbers', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true);
      expect(validateCardNumber('4000056655665556')).toBe(true);
      expect(validateCardNumber('5555555555554444')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false);
      expect(validateCardNumber('123456789012')).toBe(false); // Too short
      expect(validateCardNumber('12345678901234567890')).toBe(false); // Too long
      expect(validateCardNumber('')).toBe(false);
      expect(validateCardNumber('abc123def456ghi')).toBe(false);
    });

    it('should handle spaces and dashes in card numbers', () => {
      expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
      expect(validateCardNumber('4242-4242-4242-4242')).toBe(true);
    });
  });

  describe('validateExpiryDate', () => {
    it('should validate correct expiry dates', () => {
      expect(validateExpiryDate('12/25')).toBe(true);
      expect(validateExpiryDate('01/30')).toBe(true);
      expect(validateExpiryDate('06/26')).toBe(true); // Future date
    });

    it('should reject invalid expiry dates', () => {
      expect(validateExpiryDate('13/25')).toBe(false); // Invalid month
      expect(validateExpiryDate('00/25')).toBe(false); // Invalid month
      expect(validateExpiryDate('12/20')).toBe(false); // Expired
      expect(validateExpiryDate('12/5')).toBe(false); // Missing leading zero
      expect(validateExpiryDate('1/25')).toBe(false); // Missing leading zero
      expect(validateExpiryDate('')).toBe(false);
    });

    it('should handle different date formats', () => {
      expect(validateExpiryDate('12/2025')).toBe(true);
      expect(validateExpiryDate('12-25')).toBe(true);
    });
  });

  describe('validateCVV', () => {
    it('should validate correct CVV codes', () => {
      expect(validateCVV('123')).toBe(true);
      expect(validateCVV('456')).toBe(true);
      expect(validateCVV('789')).toBe(true);
      expect(validateCVV('1234')).toBe(true); // 4-digit CVV
    });

    it('should reject invalid CVV codes', () => {
      expect(validateCVV('12')).toBe(false); // Too short
      expect(validateCVV('12345')).toBe(false); // Too long
      expect(validateCVV('abc')).toBe(false); // Non-numeric
      expect(validateCVV('')).toBe(false);
    });
  });

  describe('formatPrice', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(1000)).toBe('$1,000.00');
      expect(formatPrice(1234.56)).toBe('$1,234.56');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
    });

    it('should handle negative prices', () => {
      expect(formatPrice(-99.99)).toBe('-$99.99');
      expect(formatPrice(-1000)).toBe('-$1,000.00');
    });

    it('should handle decimal precision', () => {
      expect(formatPrice(99.999)).toBe('$100.00'); // Rounds up
      expect(formatPrice(99.001)).toBe('$99.00'); // Rounds down
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const items = [
        { id: '1', name: 'Product 1', price: 50.00, quantity: 2, image: 'img1.jpg' },
        { id: '2', name: 'Product 2', price: 25.00, quantity: 1, image: 'img2.jpg' }
      ];

      expect(calculateTotal(items)).toBe(125.00);
    });

    it('should handle empty cart', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should handle single item', () => {
      const items = [
        { id: '1', name: 'Product 1', price: 99.99, quantity: 1, image: 'img1.jpg' }
      ];

      expect(calculateTotal(items)).toBe(99.99);
    });

    it('should handle large quantities', () => {
      const items = [
        { id: '1', name: 'Product 1', price: 10.00, quantity: 100, image: 'img1.jpg' }
      ];

      expect(calculateTotal(items)).toBe(1000.00);
    });
  });

  describe('validateCheckoutData', () => {
    const validCheckoutData: CheckoutData = {
      email: 'test@example.com',
      cardNumber: '4242424242424242',
      expiryDate: '12/25',
      cvv: '123',
      items: [
        { id: '1', name: 'Product 1', price: 50.00, quantity: 1, image: 'img1.jpg' }
      ],
      total: 50.00
    };

    it('should validate correct checkout data', () => {
      const result = validateCheckoutData(validCheckoutData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject checkout data with invalid email', () => {
      const invalidData = { ...validCheckoutData, email: 'invalid-email' };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email address');
    });

    it('should reject checkout data with invalid card number', () => {
      const invalidData = { ...validCheckoutData, cardNumber: '1234567890123456' };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid card number');
    });

    it('should reject checkout data with invalid expiry date', () => {
      const invalidData = { ...validCheckoutData, expiryDate: '13/25' };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid expiry date');
    });

    it('should reject checkout data with invalid CVV', () => {
      const invalidData = { ...validCheckoutData, cvv: '12' };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid CVV');
    });

    it('should reject checkout data with empty cart', () => {
      const invalidData = { ...validCheckoutData, items: [], total: 0 };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cart cannot be empty');
    });

    it('should reject checkout data with mismatched total', () => {
      const invalidData = { ...validCheckoutData, total: 100.00 };
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Total amount mismatch');
    });

    it('should return multiple errors for multiple validation failures', () => {
      const invalidData = {
        ...validCheckoutData,
        email: 'invalid-email',
        cardNumber: '1234567890123456',
        cvv: '12'
      };
      
      const result = validateCheckoutData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Invalid email address');
      expect(result.errors).toContain('Invalid card number');
      expect(result.errors).toContain('Invalid CVV');
    });
  });
});
