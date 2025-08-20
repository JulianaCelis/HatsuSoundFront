import { checkoutService } from '../../services/checkout.service';

// Mock del servicio de autenticación
jest.mock('../../services/auth.service', () => ({
  refreshToken: jest.fn(),
}));

describe('CheckoutService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Mock de fetch global
    (global.fetch as jest.Mock).mockClear();
  });

  describe('validateCreditCard', () => {
    it('should validate VISA card correctly', () => {
      const visaCard = '4242424242424242';
      const result = checkoutService.validateCreditCard(visaCard);
      
      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('visa');
    });

    it('should validate Mastercard correctly', () => {
      const mastercard = '5555555555554444';
      const result = checkoutService.validateCreditCard(mastercard);
      
      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('mastercard');
    });

    it('should validate American Express correctly', () => {
      const amex = '378282246310005';
      const result = checkoutService.validateCreditCard(amex);
      
      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('amex');
    });

    it('should reject invalid card numbers', () => {
      const invalidCard = '1234567890123456';
      const result = checkoutService.validateCreditCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.cardType).toBe('unknown');
    });

    it('should reject cards with wrong length', () => {
      const shortCard = '424242424242424';
      const longCard = '42424242424242424';
      
      expect(checkoutService.validateCreditCard(shortCard).isValid).toBe(false);
      expect(checkoutService.validateCreditCard(longCard).isValid).toBe(false);
    });

    it('should reject cards with non-numeric characters', () => {
      const cardWithLetters = '424242424242424a';
      const result = checkoutService.validateCreditCard(cardWithLetters);
      
      expect(result.isValid).toBe(false);
    });

    it('should handle empty string', () => {
      const result = checkoutService.validateCreditCard('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCVC', () => {
    it('should validate VISA CVC correctly', () => {
      expect(checkoutService.validateCVC('123', 'visa')).toBe(true);
      expect(checkoutService.validateCVC('1234', 'visa')).toBe(false);
      expect(checkoutService.validateCVC('12', 'visa')).toBe(false);
    });

    it('should validate Mastercard CVC correctly', () => {
      expect(checkoutService.validateCVC('123', 'mastercard')).toBe(true);
      expect(checkoutService.validateCVC('1234', 'mastercard')).toBe(false);
    });

    it('should validate American Express CVC correctly', () => {
      expect(checkoutService.validateCVC('1234', 'amex')).toBe(true);
      expect(checkoutService.validateCVC('123', 'amex')).toBe(false);
    });

    it('should reject non-numeric CVC', () => {
      expect(checkoutService.validateCVC('12a', 'visa')).toBe(false);
      expect(checkoutService.validateCVC('abc', 'visa')).toBe(false);
    });

    it('should handle empty CVC', () => {
      expect(checkoutService.validateCVC('', 'visa')).toBe(false);
    });
  });

  describe('validateExpiryDate', () => {
    it('should validate future expiry dates', () => {
      const currentYear = new Date().getFullYear();
      const nextYear = (currentYear + 1).toString();
      
      expect(checkoutService.validateExpiryDate('12', nextYear)).toBe(true);
      expect(checkoutService.validateExpiryDate('01', nextYear)).toBe(true);
    });

    it('should reject past expiry dates', () => {
      const currentYear = new Date().getFullYear();
      const lastYear = (currentYear - 1).toString();
      
      expect(checkoutService.validateExpiryDate('12', lastYear)).toBe(false);
    });

    it('should reject current month in current year', () => {
      const now = new Date();
      const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = now.getFullYear().toString();
      
      expect(checkoutService.validateExpiryDate(currentMonth, currentYear)).toBe(false);
    });

    it('should validate month format', () => {
      const currentYear = new Date().getFullYear();
      const nextYear = (currentYear + 1).toString();
      
      expect(checkoutService.validateExpiryDate('01', nextYear)).toBe(true);
      expect(checkoutService.validateExpiryDate('12', nextYear)).toBe(true);
      expect(checkoutService.validateExpiryDate('00', nextYear)).toBe(false);
      expect(checkoutService.validateExpiryDate('13', nextYear)).toBe(false);
    });

    it('should handle invalid month/year format', () => {
      expect(checkoutService.validateExpiryDate('ab', '2025')).toBe(false);
      expect(checkoutService.validateExpiryDate('12', 'abcd')).toBe(false);
    });
  });

  describe('formatPrice', () => {
    it('should format COP prices correctly', () => {
      expect(checkoutService.formatPrice(1000, 'COP')).toBe('$10.00');
      expect(checkoutService.formatPrice(1500, 'COP')).toBe('$15.00');
      expect(checkoutService.formatPrice(0, 'COP')).toBe('$0.00');
    });

    it('should format USD prices correctly', () => {
      expect(checkoutService.formatPrice(1000, 'USD')).toBe('$10.00');
      expect(checkoutService.formatPrice(1500, 'USD')).toBe('$15.00');
    });

    it('should format EUR prices correctly', () => {
      expect(checkoutService.formatPrice(1000, 'EUR')).toBe('€10.00');
      expect(checkoutService.formatPrice(1500, 'EUR')).toBe('€15.00');
    });

    it('should handle large amounts', () => {
      expect(checkoutService.formatPrice(1000000, 'COP')).toBe('$10,000.00');
      expect(checkoutService.formatPrice(999999, 'USD')).toBe('$9,999.99');
    });

    it('should handle decimal amounts', () => {
      expect(checkoutService.formatPrice(1050, 'COP')).toBe('$10.50');
      expect(checkoutService.formatPrice(1099, 'USD')).toBe('$10.99');
    });
  });

  describe('calculateCheckoutSummary', () => {
    it('should calculate summary for COP correctly', () => {
      const summary = checkoutService.calculateCheckoutSummary(5000, 'COP');
      
      expect(summary.subtotal).toBe(5000);
      expect(summary.baseFee).toBe(500); // 10% base fee
      expect(summary.deliveryFee).toBe(2000); // $20.00 delivery fee
      expect(summary.total).toBe(7500); // 5000 + 500 + 2000
    });

    it('should calculate summary for USD correctly', () => {
      const summary = checkoutService.calculateCheckoutSummary(1000, 'USD');
      
      expect(summary.subtotal).toBe(1000);
      expect(summary.baseFee).toBe(100); // 10% base fee
      expect(summary.deliveryFee).toBe(500); // $5.00 delivery fee
      expect(summary.total).toBe(1600); // 1000 + 100 + 500
    });

    it('should calculate summary for EUR correctly', () => {
      const summary = checkoutService.calculateCheckoutSummary(2000, 'EUR');
      
      expect(summary.subtotal).toBe(2000);
      expect(summary.baseFee).toBe(200); // 10% base fee
      expect(summary.deliveryFee).toBe(1000); // €10.00 delivery fee
      expect(summary.total).toBe(3200); // 2000 + 200 + 1000
    });

    it('should handle zero amount', () => {
      const summary = checkoutService.calculateCheckoutSummary(0, 'COP');
      
      expect(summary.subtotal).toBe(0);
      expect(summary.baseFee).toBe(0);
      expect(summary.deliveryFee).toBe(2000);
      expect(summary.total).toBe(2000);
    });

    it('should handle minimum amount', () => {
      const summary = checkoutService.calculateCheckoutSummary(100, 'COP');
      
      expect(summary.subtotal).toBe(100);
      expect(summary.baseFee).toBe(10);
      expect(summary.deliveryFee).toBe(2000);
      expect(summary.total).toBe(2110);
    });
  });

  describe('createPaymentMethodToken', () => {
    it('should create payment method token successfully', async () => {
      const mockResponse = {
        token: 'tok_test_123456789',
        status: 'success'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const cardData = {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolderName: 'John Doe'
      };

      const result = await checkoutService.createPaymentMethodToken(cardData);
      
      expect(result).toBe('tok_test_123456789');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/wompi/create-token'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(cardData)
        })
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const cardData = {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolderName: 'John Doe'
      };

      await expect(
        checkoutService.createPaymentMethodToken(cardData)
      ).rejects.toThrow('Failed to create payment method token');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const cardData = {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolderName: 'John Doe'
      };

      await expect(
        checkoutService.createPaymentMethodToken(cardData)
      ).rejects.toThrow('Network error');
    });
  });

  describe('createDirectPaymentCheckout', () => {
    it('should create direct payment checkout successfully', async () => {
      const mockResponse = {
        transactionId: 'txn_123456789',
        status: 'pending',
        paymentType: 'direct',
        wompiTransactionId: 'wompi_txn_987654321'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const checkoutData = {
        amount: 5000,
        currency: 'COP',
        customerEmail: 'test@example.com',
        paymentMethodToken: 'tok_test_123456789'
      };

      const result = await checkoutService.createDirectPaymentCheckout(checkoutData);
      
      expect(result).toEqual(mockResponse);
      expect(result.paymentType).toBe('direct');
      expect(result.wompiTransactionId).toBeDefined();
    });

    it('should reject non-direct payment responses', async () => {
      const mockResponse = {
        transactionId: 'txn_123456789',
        status: 'pending',
        paymentType: 'intent',
        checkoutUrl: 'https://checkout.wompi.co'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const checkoutData = {
        amount: 5000,
        currency: 'COP',
        customerEmail: 'test@example.com',
        paymentMethodToken: 'tok_test_123456789'
      };

      await expect(
        checkoutService.createDirectPaymentCheckout(checkoutData)
      ).rejects.toThrow('Direct payment checkout failed');
    });
  });

  describe('createIntentCheckout', () => {
    it('should create intent checkout successfully', async () => {
      const mockResponse = {
        transactionId: 'txn_123456789',
        status: 'pending',
        paymentType: 'intent',
        checkoutUrl: 'https://checkout.wompi.co'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const checkoutData = {
        amount: 5000,
        currency: 'COP',
        customerEmail: 'test@example.com'
      };

      const result = await checkoutService.createIntentCheckout(checkoutData);
      
      expect(result).toEqual(mockResponse);
      expect(result.paymentType).toBe('intent');
      expect(result.checkoutUrl).toBeDefined();
    });

    it('should reject non-intent payment responses', async () => {
      const mockResponse = {
        transactionId: 'txn_123456789',
        status: 'pending',
        paymentType: 'direct',
        wompiTransactionId: 'wompi_txn_987654321'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const checkoutData = {
        amount: 5000,
        currency: 'COP',
        customerEmail: 'test@example.com'
      };

      await expect(
        checkoutService.createIntentCheckout(checkoutData)
      ).rejects.toThrow('Intent checkout failed');
    });
  });

  describe('getTransactionStatus', () => {
    it('should get transaction status successfully', async () => {
      const mockResponse = {
        transactionId: 'txn_123456789',
        status: 'approved',
        amount: 5000,
        currency: 'COP'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await checkoutService.getTransactionStatus('txn_123456789');
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/status/txn_123456789'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('getWompiTransactionStatus', () => {
    it('should get Wompi transaction status successfully', async () => {
      const mockResponse = {
        data: {
          id: 'wompi_txn_987654321',
          status: 'APPROVED',
          reference: 'txn_123456789'
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await checkoutService.getWompiTransactionStatus('wompi_txn_987654321');
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/checkout/wompi/status/wompi_txn_987654321'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });
});
