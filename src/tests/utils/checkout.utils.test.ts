import { checkoutService } from '../../services/checkout.service';

describe('Checkout Utilities', () => {
  describe('Credit Card Validation', () => {
    describe('VISA Cards', () => {
      it('should validate valid VISA card numbers', () => {
        const validVisaCards = [
          '4242424242424242',
          '4000056655665556',
          '4000000000000002',
          '4000000000009999'
        ];

        validVisaCards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(true);
          expect(result.cardType).toBe('visa');
        });
      });

      it('should reject invalid VISA card numbers', () => {
        const invalidVisaCards = [
          '4242424242424241', // Luhn check fails
          '424242424242424',  // Too short
          '42424242424242424', // Too long
          '5242424242424242'  // Wrong prefix
        ];

        invalidVisaCards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(false);
        });
      });
    });

    describe('Mastercard Cards', () => {
      it('should validate valid Mastercard numbers', () => {
        const validMastercards = [
          '5555555555554444',
          '5105105105105100',
          '5200828282828210',
          '5105105105105100'
        ];

        validMastercards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(true);
          expect(result.cardType).toBe('mastercard');
        });
      });

      it('should reject invalid Mastercard numbers', () => {
        const invalidMastercards = [
          '5555555555554443', // Luhn check fails
          '555555555555444',  // Too short
          '55555555555544444', // Too long
          '4555555555554444'  // Wrong prefix
        ];

        invalidMastercards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(false);
        });
      });
    });

    describe('American Express Cards', () => {
      it('should validate valid AMEX numbers', () => {
        const validAmexCards = [
          '378282246310005',
          '371449635398431',
          '378734493671000'
        ];

        validAmexCards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(true);
          expect(result.cardType).toBe('amex');
        });
      });

      it('should reject invalid AMEX numbers', () => {
        const invalidAmexCards = [
          '378282246310004', // Luhn check fails
          '37828224631000',  // Too short
          '3782822463100000', // Too long
          '278282246310005'  // Wrong prefix
        ];

        invalidAmexCards.forEach(cardNumber => {
          const result = checkoutService.validateCreditCard(cardNumber);
          expect(result.isValid).toBe(false);
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty string', () => {
        const result = checkoutService.validateCreditCard('');
        expect(result.isValid).toBe(false);
        expect(result.cardType).toBe('unknown');
      });

      it('should handle null and undefined', () => {
        expect(() => checkoutService.validateCreditCard(null as any)).toThrow();
        expect(() => checkoutService.validateCreditCard(undefined as any)).toThrow();
      });

      it('should handle non-numeric characters', () => {
        const result = checkoutService.validateCreditCard('4242-4242-4242-4242');
        expect(result.isValid).toBe(false);
      });

      it('should handle spaces', () => {
        const result = checkoutService.validateCreditCard('4242 4242 4242 4242');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('CVC Validation', () => {
    describe('VISA and Mastercard CVC', () => {
      it('should validate 3-digit CVC for VISA', () => {
        expect(checkoutService.validateCVC('123', 'visa')).toBe(true);
        expect(checkoutService.validateCVC('000', 'visa')).toBe(true);
        expect(checkoutService.validateCVC('999', 'visa')).toBe(true);
      });

      it('should reject invalid CVC for VISA', () => {
        expect(checkoutService.validateCVC('12', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('1234', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('12a', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('', 'visa')).toBe(false);
      });

      it('should validate 3-digit CVC for Mastercard', () => {
        expect(checkoutService.validateCVC('123', 'mastercard')).toBe(true);
        expect(checkoutService.validateCVC('000', 'mastercard')).toBe(true);
        expect(checkoutService.validateCVC('999', 'mastercard')).toBe(true);
      });
    });

    describe('American Express CVC', () => {
      it('should validate 4-digit CVC for AMEX', () => {
        expect(checkoutService.validateCVC('1234', 'amex')).toBe(true);
        expect(checkoutService.validateCVC('0000', 'amex')).toBe(true);
        expect(checkoutService.validateCVC('9999', 'amex')).toBe(true);
      });

      it('should reject invalid CVC for AMEX', () => {
        expect(checkoutService.validateCVC('123', 'amex')).toBe(false);
        expect(checkoutService.validateCVC('12345', 'amex')).toBe(false);
        expect(checkoutService.validateCVC('123a', 'amex')).toBe(false);
        expect(checkoutService.validateCVC('', 'amex')).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty CVC', () => {
        expect(checkoutService.validateCVC('', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('', 'mastercard')).toBe(false);
        expect(checkoutService.validateCVC('', 'amex')).toBe(false);
      });

      it('should handle non-numeric CVC', () => {
        expect(checkoutService.validateCVC('abc', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('12a', 'visa')).toBe(false);
        expect(checkoutService.validateCVC('a12', 'visa')).toBe(false);
      });

      it('should handle unknown card types', () => {
        expect(checkoutService.validateCVC('123', 'unknown')).toBe(false);
        expect(checkoutService.validateCVC('1234', 'unknown')).toBe(false);
      });
    });
  });

  describe('Expiry Date Validation', () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    describe('Valid Dates', () => {
      it('should validate future dates', () => {
        // Next month, current year
        expect(checkoutService.validateExpiryDate(
          (currentMonth + 1).toString().padStart(2, '0'),
          currentYear.toString()
        )).toBe(true);

        // Any month, next year
        expect(checkoutService.validateExpiryDate('01', (currentYear + 1).toString())).toBe(true);
        expect(checkoutService.validateExpiryDate('12', (currentYear + 1).toString())).toBe(true);

        // Far future
        expect(checkoutService.validateExpiryDate('01', (currentYear + 10).toString())).toBe(true);
      });

      it('should validate edge case dates', () => {
        // First month of next year
        expect(checkoutService.validateExpiryDate('01', (currentYear + 1).toString())).toBe(true);
        
        // Last month of next year
        expect(checkoutService.validateExpiryDate('12', (currentYear + 1).toString())).toBe(true);
      });
    });

    describe('Invalid Dates', () => {
      it('should reject past dates', () => {
        // Past year
        expect(checkoutService.validateExpiryDate('12', (currentYear - 1).toString())).toBe(false);
        
        // Past month in current year
        if (currentMonth > 1) {
          expect(checkoutService.validateExpiryDate(
            (currentMonth - 1).toString().padStart(2, '0'),
            currentYear.toString()
          )).toBe(false);
        }
      });

      it('should reject current month in current year', () => {
        expect(checkoutService.validateExpiryDate(
          currentMonth.toString().padStart(2, '0'),
          currentYear.toString()
        )).toBe(false);
      });

      it('should reject invalid month values', () => {
        expect(checkoutService.validateExpiryDate('00', (currentYear + 1).toString())).toBe(false);
        expect(checkoutService.validateExpiryDate('13', (currentYear + 1).toString())).toBe(false);
        expect(checkoutService.validateExpiryDate('99', (currentYear + 1).toString())).toBe(false);
      });

      it('should reject invalid year values', () => {
        expect(checkoutService.validateExpiryDate('12', '0')).toBe(false);
        expect(checkoutService.validateExpiryDate('12', '99')).toBe(false);
        expect(checkoutService.validateExpiryDate('12', 'abcd')).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty values', () => {
        expect(checkoutService.validateExpiryDate('', (currentYear + 1).toString())).toBe(false);
        expect(checkoutService.validateExpiryDate('12', '')).toBe(false);
        expect(checkoutService.validateExpiryDate('', '')).toBe(false);
      });

      it('should handle non-numeric values', () => {
        expect(checkoutService.validateExpiryDate('ab', (currentYear + 1).toString())).toBe(false);
        expect(checkoutService.validateExpiryDate('12', 'abcd')).toBe(false);
      });

      it('should handle single digit months', () => {
        expect(checkoutService.validateExpiryDate('1', (currentYear + 1).toString())).toBe(false);
        expect(checkoutService.validateExpiryDate('9', (currentYear + 1).toString())).toBe(false);
      });
    });
  });

  describe('Price Formatting', () => {
    describe('COP Currency', () => {
      it('should format COP prices correctly', () => {
        expect(checkoutService.formatPrice(0, 'COP')).toBe('$0.00');
        expect(checkoutService.formatPrice(100, 'COP')).toBe('$1.00');
        expect(checkoutService.formatPrice(1500, 'COP')).toBe('$15.00');
        expect(checkoutService.formatPrice(1599, 'COP')).toBe('$15.99');
        expect(checkoutService.formatPrice(100000, 'COP')).toBe('$1,000.00');
        expect(checkoutService.formatPrice(1000000, 'COP')).toBe('$10,000.00');
      });

      it('should handle edge cases for COP', () => {
        expect(checkoutService.formatPrice(1, 'COP')).toBe('$0.01');
        expect(checkoutService.formatPrice(99, 'COP')).toBe('$0.99');
        expect(checkoutService.formatPrice(999999, 'COP')).toBe('$9,999.99');
      });
    });

    describe('USD Currency', () => {
      it('should format USD prices correctly', () => {
        expect(checkoutService.formatPrice(0, 'USD')).toBe('$0.00');
        expect(checkoutService.formatPrice(100, 'USD')).toBe('$1.00');
        expect(checkoutService.formatPrice(1500, 'USD')).toBe('$15.00');
        expect(checkoutService.formatPrice(1599, 'USD')).toBe('$15.99');
        expect(checkoutService.formatPrice(100000, 'USD')).toBe('$1,000.00');
      });
    });

    describe('EUR Currency', () => {
      it('should format EUR prices correctly', () => {
        expect(checkoutService.formatPrice(0, 'EUR')).toBe('€0.00');
        expect(checkoutService.formatPrice(100, 'EUR')).toBe('€1.00');
        expect(checkoutService.formatPrice(1500, 'EUR')).toBe('€15.00');
        expect(checkoutService.formatPrice(1599, 'EUR')).toBe('€15.99');
        expect(checkoutService.formatPrice(100000, 'EUR')).toBe('€1,000.00');
      });
    });

    describe('Edge Cases', () => {
      it('should handle negative amounts', () => {
        expect(checkoutService.formatPrice(-100, 'COP')).toBe('-$1.00');
        expect(checkoutService.formatPrice(-1500, 'USD')).toBe('-$15.00');
        expect(checkoutService.formatPrice(-2000, 'EUR')).toBe('-€20.00');
      });

      it('should handle very large amounts', () => {
        expect(checkoutService.formatPrice(999999999, 'COP')).toBe('$9,999,999.99');
        expect(checkoutService.formatPrice(1000000000, 'USD')).toBe('$10,000,000.00');
      });

      it('should handle decimal precision', () => {
        expect(checkoutService.formatPrice(1001, 'COP')).toBe('$10.01');
        expect(checkoutService.formatPrice(1009, 'USD')).toBe('$10.09');
        expect(checkoutService.formatPrice(1090, 'EUR')).toBe('€10.90');
      });
    });
  });

  describe('Checkout Summary Calculation', () => {
    describe('COP Currency', () => {
      it('should calculate summary correctly for COP', () => {
        const summary = checkoutService.calculateCheckoutSummary(5000, 'COP');
        
        expect(summary.subtotal).toBe(5000);
        expect(summary.baseFee).toBe(500); // 10% of 5000
        expect(summary.deliveryFee).toBe(2000); // Fixed $20.00
        expect(summary.total).toBe(7500); // 5000 + 500 + 2000
      });

      it('should handle zero subtotal for COP', () => {
        const summary = checkoutService.calculateCheckoutSummary(0, 'COP');
        
        expect(summary.subtotal).toBe(0);
        expect(summary.baseFee).toBe(0);
        expect(summary.deliveryFee).toBe(2000);
        expect(summary.total).toBe(2000);
      });

      it('should handle minimum amounts for COP', () => {
        const summary = checkoutService.calculateCheckoutSummary(100, 'COP');
        
        expect(summary.subtotal).toBe(100);
        expect(summary.baseFee).toBe(10); // 10% of 100
        expect(summary.deliveryFee).toBe(2000);
        expect(summary.total).toBe(2110);
      });
    });

    describe('USD Currency', () => {
      it('should calculate summary correctly for USD', () => {
        const summary = checkoutService.calculateCheckoutSummary(1000, 'USD');
        
        expect(summary.subtotal).toBe(1000);
        expect(summary.baseFee).toBe(100); // 10% of 1000
        expect(summary.deliveryFee).toBe(500); // Fixed $5.00
        expect(summary.total).toBe(1600); // 1000 + 100 + 500
      });

      it('should handle different amounts for USD', () => {
        const summary = checkoutService.calculateCheckoutSummary(2500, 'USD');
        
        expect(summary.subtotal).toBe(2500);
        expect(summary.baseFee).toBe(250); // 10% of 2500
        expect(summary.deliveryFee).toBe(500);
        expect(summary.total).toBe(3250);
      });
    });

    describe('EUR Currency', () => {
      it('should calculate summary correctly for EUR', () => {
        const summary = checkoutService.calculateCheckoutSummary(2000, 'EUR');
        
        expect(summary.subtotal).toBe(2000);
        expect(summary.baseFee).toBe(200); // 10% of 2000
        expect(summary.deliveryFee).toBe(1000); // Fixed €10.00
        expect(summary.total).toBe(3200); // 2000 + 200 + 1000
      });
    });

    describe('Edge Cases', () => {
      it('should handle very small amounts', () => {
        const summary = checkoutService.calculateCheckoutSummary(1, 'COP');
        
        expect(summary.subtotal).toBe(1);
        expect(summary.baseFee).toBe(0); // Rounded down
        expect(summary.deliveryFee).toBe(2000);
        expect(summary.total).toBe(2001);
      });

      it('should handle very large amounts', () => {
        const summary = checkoutService.calculateCheckoutSummary(1000000, 'COP');
        
        expect(summary.subtotal).toBe(1000000);
        expect(summary.baseFee).toBe(100000); // 10% of 1000000
        expect(summary.deliveryFee).toBe(2000);
        expect(summary.total).toBe(1102000);
      });

      it('should handle negative amounts', () => {
        const summary = checkoutService.calculateCheckoutSummary(-1000, 'COP');
        
        expect(summary.subtotal).toBe(-1000);
        expect(summary.baseFee).toBe(-100); // 10% of -1000
        expect(summary.deliveryFee).toBe(2000);
        expect(summary.total).toBe(900); // -1000 + (-100) + 2000
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work together for a complete checkout flow', () => {
      // Simulate a complete checkout validation
      const cardNumber = '4242424242424242';
      const cvc = '123';
      const expMonth = '12';
      const expYear = '2025';
      const amount = 5000;
      const currency = 'COP';

      // Validate card
      const cardValidation = checkoutService.validateCreditCard(cardNumber);
      expect(cardValidation.isValid).toBe(true);
      expect(cardValidation.cardType).toBe('visa');

      // Validate CVC
      expect(checkoutService.validateCVC(cvc, cardValidation.cardType)).toBe(true);

      // Validate expiry date
      expect(checkoutService.validateExpiryDate(expMonth, expYear)).toBe(true);

      // Calculate summary
      const summary = checkoutService.calculateCheckoutSummary(amount, currency);
      expect(summary.total).toBeGreaterThan(amount);

      // Format prices
      const formattedTotal = checkoutService.formatPrice(summary.total, currency);
      expect(formattedTotal).toContain('$');
      expect(formattedTotal).toContain('.00');
    });

    it('should handle invalid checkout data gracefully', () => {
      // Invalid card
      const invalidCard = '1234567890123456';
      const cardValidation = checkoutService.validateCreditCard(invalidCard);
      expect(cardValidation.isValid).toBe(false);

      // Invalid CVC for the card type
      expect(checkoutService.validateCVC('1234', cardValidation.cardType)).toBe(false);

      // Invalid expiry date
      expect(checkoutService.validateExpiryDate('13', '2025')).toBe(false);

      // Still calculate summary (business logic continues)
      const summary = checkoutService.calculateCheckoutSummary(1000, 'COP');
      expect(summary.total).toBeGreaterThan(0);
    });
  });
});
