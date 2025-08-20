// Tipos para el sistema de checkout con Wompi

export interface CheckoutRequest {
  amount: number; // en centavos
  currency: string; // COP, USD, EUR
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productCategory: string;
  productArtist?: string;
  productGenre?: string;
  productFormat?: string;
  description?: string;
  metadata?: Record<string, any>;
  reference?: string;
  paymentMethodToken?: string; // para pagos directos
}

export interface CheckoutResponse {
  id: string;
  transactionId: string;
  wompiTransactionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'failed';
  paymentType: 'direct' | 'intent';
  checkoutUrl?: string; // solo para pagos intent
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productCategory: string;
  productArtist?: string;
  productGenre?: string;
  productFormat?: string;
  description?: string;
  metadata?: Record<string, any>;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodTokenRequest {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolderName: string;
}

export interface PaymentMethodTokenResponse {
  token: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'unknown';
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
}

export interface TransactionStatus {
  id: string;
  transactionId: string;
  wompiTransactionId?: string;
  status: 'pending' | 'approved' | 'declined' | 'failed';
  amount: number;
  currency: string;
  customerEmail: string;
  productId: string;
  productName: string;
  createdAt: string;
  updatedAt: string;
}

export interface WompiTransactionStatus {
  data: {
    id: string;
    status: string;
    reference: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    status_message?: string;
    created_at: string;
    updated_at: string;
    payment_method?: {
      type: string;
      installments?: number;
    };
  };
  status: string;
}

export interface CheckoutFormData {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  cardData?: {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolderName: string;
  };
}

export interface CheckoutSummary {
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
  total: number;
  currency: string;
}

export interface CheckoutStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface WompiWebhookData {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      currency: string;
      customer_email: string;
      status_message?: string;
      created_at: string;
      updated_at: string;
    };
  };
  timestamp: number;
  signature: {
    checksum: string;
    properties: string[];
  };
}
