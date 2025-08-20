import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { checkoutService } from '../services/checkout.service';
import { 
  CheckoutFormData, 
  CheckoutResponse, 
  CheckoutSummary 
} from '../types/checkout.model';

export const useCheckout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  
  // Estados del checkout
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutResponse, setCheckoutResponse] = useState<CheckoutResponse | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string>('pending');
  
  // Estados del formulario
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerEmail: user?.email || '',
    customerName: user ? `${user.firstName} ${user.lastName}` : '',
    customerPhone: '',
    cardData: {
      number: '',
      cvc: '',
      expMonth: '',
      expYear: '',
      cardHolderName: ''
    }
  });

  // Estados de UI
  const [paymentType, setPaymentType] = useState<'intent' | 'direct'>('intent');

  // Calcular resumen del checkout
  const checkoutSummary: CheckoutSummary = checkoutService.calculateCheckoutSummary(
    cart.total * 100, // Convertir a centavos
    'COP'
  );

  // Actualizar datos del formulario
  const updateFormData = useCallback((field: keyof CheckoutFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Actualizar datos de tarjeta
  const updateCardData = useCallback((field: keyof typeof formData.cardData, value: string) => {
    if (formData.cardData) {
      setFormData(prev => ({
        ...prev,
        cardData: {
          ...prev.cardData!,
          [field]: value
        }
      }));
    }
  }, [formData.cardData]);

  // Navegar entre pasos
  const goToStep = useCallback((step: number) => {
    if (step < currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      setError(null);
    }
  }, [currentStep]);

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    if (!formData.customerEmail || !formData.customerName || !formData.customerPhone) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (paymentType === 'direct') {
      if (!formData.cardData?.number || !formData.cardData?.cvc || 
          !formData.cardData?.expMonth || !formData.cardData?.expYear || 
          !formData.cardData?.cardHolderName) {
        setError('Por favor completa todos los datos de la tarjeta');
        return false;
      }

      const cardValidation = checkoutService.validateCreditCard(formData.cardData.number);
      if (!cardValidation.isValid) {
        setError('Número de tarjeta inválido');
        return false;
      }

      if (!checkoutService.validateCVC(formData.cardData.cvc, cardValidation.cardType)) {
        setError('CVC inválido');
        return false;
      }

      if (!checkoutService.validateExpiryDate(formData.cardData.expMonth, formData.cardData.expYear)) {
        setError('Fecha de expiración inválida');
        return false;
      }
    }

    return true;
  }, [formData, paymentType]);

  // Procesar checkout
  const processCheckout = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setCurrentStep(4);

    try {
      // Preparar datos del checkout
      const checkoutData = {
        amount: checkoutSummary.total,
        currency: checkoutSummary.currency,
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        productId: cart.items.map(item => item.product.id).join(','),
        productName: cart.items.map(item => item.product.title).join(', '),
        productCategory: 'Música Digital',
        productArtist: cart.items.map(item => item.product.artist).join(', '),
        productGenre: cart.items.map(item => item.product.genre).join(', '),
        productFormat: cart.items.map(item => item.product.format).join(', '),
        description: `Compra de ${cart.items.length} producto(s) musical(es)`,
        metadata: {
          cartItems: cart.items.length,
          totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          purchaseDate: new Date().toISOString()
        },
        reference: `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      let result: CheckoutResponse;

      if (paymentType === 'direct') {
        // Crear token de método de pago
        const paymentToken = await checkoutService.createPaymentMethodToken(formData.cardData!);
        
        // Procesar pago directo
        result = await checkoutService.createDirectPaymentCheckout({
          ...checkoutData,
          paymentMethodToken: paymentToken.token
        });
      } else {
        // Crear checkout de intención
        result = await checkoutService.createIntentCheckout(checkoutData);
      }

      setCheckoutResponse(result);

      if (result.paymentType === 'direct') {
        // Pago directo procesado
        if (result.status === 'approved') {
          setTransactionStatus('approved');
          setCurrentStep(5);
          clearCart();
        } else {
          setTransactionStatus(result.status);
          setError(`Pago ${result.status}: ${result.status === 'declined' ? 'rechazado' : 'fallido'}`);
        }
      } else if (result.paymentType === 'intent' && result.checkoutUrl) {
        // Redirigir a Wompi
        window.location.href = result.checkoutUrl;
      }

    } catch (error: any) {
      setError(error.message || 'Error al procesar el checkout');
      setCurrentStep(3); // Volver al resumen
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, checkoutSummary, formData, paymentType, cart, clearCart]);

  // Resetear checkout
  const resetCheckout = useCallback(() => {
    setCurrentStep(1);
    setError(null);
    setCheckoutResponse(null);
    setTransactionStatus('pending');
    setFormData({
      customerEmail: user?.email || '',
      customerName: user ? `${user.firstName} ${user.lastName}` : '',
      customerPhone: '',
      cardData: {
        number: '',
        cvc: '',
        expMonth: '',
        expYear: '',
        cardHolderName: ''
      }
    });
    setPaymentType('intent');
  }, [user]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    isLoading,
    error,
    currentStep,
    checkoutResponse,
    transactionStatus,
    formData,
    paymentType,
    checkoutSummary,
    
    // Acciones
    updateFormData,
    updateCardData,
    setPaymentType,
    goToStep,
    processCheckout,
    resetCheckout,
    clearError,
    
    // Validaciones
    validateForm,
    
    // Utilidades
    isAuthenticated
  };
};
