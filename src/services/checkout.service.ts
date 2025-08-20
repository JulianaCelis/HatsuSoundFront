import { 
  CheckoutRequest, 
  CheckoutResponse, 
  PaymentMethodTokenRequest, 
  PaymentMethodTokenResponse,
  TransactionStatus,
  WompiTransactionStatus
} from '../types/checkout.model';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class CheckoutService {
  private getAuthHeaders(): HeadersInit {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private async refreshTokenIfNeeded(response: Response): Promise<Response> {
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          localStorage.setItem('accessToken', result.access_token);
          return response; // Retornar la respuesta original para reintentar
        } else {
          // Token expirado, redirigir a login
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Session expired');
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
        throw error;
      }
    }
    return response;
  }

  private async authenticatedRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getAuthHeaders()
      });

      // Manejar renovación de token si es necesario
      const finalResponse = await this.refreshTokenIfNeeded(response);
      
      if (finalResponse === response) {
        // No se renovó el token, procesar respuesta normal
        return this.handleResponse<T>(response);
      } else {
        // Se renovó el token, reintentar la request original
        const retryResponse = await fetch(url, {
          ...options,
          headers: this.getAuthHeaders()
        });
        return this.handleResponse<T>(retryResponse);
      }
    } catch (error) {
      console.error('Checkout service error:', error);
      throw error;
    }
  }

  // Crear token de método de pago (solo admin)
  async createPaymentMethodToken(cardData: PaymentMethodTokenRequest): Promise<PaymentMethodTokenResponse> {
    return this.authenticatedRequest<PaymentMethodTokenResponse>(
      `${API_BASE_URL}/checkout/wompi/create-token`,
      {
        method: 'POST',
        body: JSON.stringify(cardData)
      }
    );
  }

  // Crear checkout con pago directo
  async createDirectPaymentCheckout(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
    if (!checkoutData.paymentMethodToken) {
      throw new Error('Payment method token is required for direct payment');
    }

    return this.authenticatedRequest<CheckoutResponse>(
      `${API_BASE_URL}/checkout`,
      {
        method: 'POST',
        body: JSON.stringify(checkoutData)
      }
    );
  }

  // Crear checkout de intención (sin token)
  async createIntentCheckout(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
    // Asegurar que no hay token para pagos intent
    const { paymentMethodToken, ...intentData } = checkoutData;
    
    return this.authenticatedRequest<CheckoutResponse>(
      `${API_BASE_URL}/checkout`,
      {
        method: 'POST',
        body: JSON.stringify(intentData)
      }
    );
  }

  // Obtener estado de transacción local
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    return this.authenticatedRequest<TransactionStatus>(
      `${API_BASE_URL}/checkout/status/${transactionId}`
    );
  }

  // Obtener estado directo de Wompi
  async getWompiTransactionStatus(wompiTransactionId: string): Promise<WompiTransactionStatus> {
    return this.authenticatedRequest<WompiTransactionStatus>(
      `${API_BASE_URL}/checkout/wompi/status/${wompiTransactionId}`
    );
  }

  // Validar tarjeta de crédito
  validateCreditCard(cardNumber: string): {
    isValid: boolean;
    cardType: 'visa' | 'mastercard' | 'amex' | 'unknown';
    lastFourDigits: string;
  } {
    // Remover espacios y guiones
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    
    // Validar longitud básica
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return { isValid: false, cardType: 'unknown', lastFourDigits: '' };
    }

    // Algoritmo de Luhn para validar número de tarjeta
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
    
    const isValid = sum % 10 === 0;
    
    // Detectar tipo de tarjeta
    let cardType: 'visa' | 'mastercard' | 'amex' | 'unknown' = 'unknown';
    
    if (cleanNumber.startsWith('4')) {
      cardType = 'visa';
    } else if (cleanNumber.startsWith('5') && ['1', '2', '3', '4', '5'].includes(cleanNumber[1])) {
      cardType = 'mastercard';
    } else if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) {
      cardType = 'amex';
    }
    
    const lastFourDigits = cleanNumber.slice(-4);
    
    return { isValid, cardType, lastFourDigits };
  }

  // Validar CVC
  validateCVC(cvc: string, cardType: 'visa' | 'mastercard' | 'amex' | 'unknown'): boolean {
    const cleanCVC = cvc.replace(/\s+/g, '');
    
    if (cardType === 'amex') {
      return cleanCVC.length === 4;
    } else {
      return cleanCVC.length === 3;
    }
  }

  // Validar fecha de expiración
  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  // Formatear precio en centavos a moneda
  formatPrice(amountInCents: number, currency: string = 'COP'): string {
    const amount = amountInCents / 100;
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Calcular resumen del checkout
  calculateCheckoutSummary(subtotal: number, currency: string = 'COP'): {
    subtotal: number;
    baseFee: number;
    deliveryFee: number;
    total: number;
    currency: string;
  } {
    // Base fee: 1000 centavos (10.00)
    const baseFee = 1000;
    
    // Delivery fee: 500 centavos (5.00) para productos digitales
    const deliveryFee = 500;
    
    const total = subtotal + baseFee + deliveryFee;
    
    return {
      subtotal,
      baseFee,
      deliveryFee,
      total,
      currency
    };
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
