import { renderHook, act } from '@testing-library/react';
import { useCheckout } from '../../hooks/useCheckout';
import { checkoutService } from '../../services/checkout.service';

// Mock del servicio de checkout
jest.mock('../../services/checkout.service');
const mockCheckoutService = checkoutService as jest.Mocked<typeof checkoutService>;

// Mock del contexto de autenticación
const mockAuthContext = {
  user: { id: 'user123', email: 'test@example.com' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
};

// Mock del contexto del carrito
const mockCartContext = {
  items: [
    {
      product: {
        id: 'product1',
        title: 'Test Product',
        price: 1000,
        currency: 'COP'
      },
      quantity: 2
    }
  ],
  total: 2000,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
  updateQuantity: jest.fn(),
};

// Mock de los contextos
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn((context) => {
    if (context.displayName === 'AuthContext') {
      return mockAuthContext;
    }
    if (context.displayName === 'CartContext') {
      return mockCartContext;
    }
    return null;
  }),
}));

describe('useCheckout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Resetear los mocks del servicio
    Object.keys(mockCheckoutService).forEach(key => {
      if (typeof mockCheckoutService[key] === 'function') {
        (mockCheckoutService[key] as jest.Mock).mockClear();
      }
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useCheckout());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.formData).toEqual({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        cardNumber: '',
        cardCVC: '',
        cardExpiryMonth: '',
        cardExpiryYear: '',
        cardHolderName: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryCountry: 'Colombia',
        deliveryPostalCode: ''
      });
      expect(result.current.paymentType).toBe('intent');
    });
  });

  describe('updateFormData', () => {
    it('should update form data correctly', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.updateFormData('customerName', 'John Doe');
      });

      expect(result.current.formData.customerName).toBe('John Doe');
    });

    it('should update multiple form fields', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      expect(result.current.formData.customerName).toBe('John Doe');
      expect(result.current.formData.customerEmail).toBe('john@example.com');
      expect(result.current.formData.customerPhone).toBe('+573001234567');
    });

    it('should preserve other form fields when updating one', () => {
      const { result } = renderHook(() => useCheckout());

      // Llenar algunos campos primero
      act(() => {
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
      });

      // Actualizar solo el teléfono
      act(() => {
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      expect(result.current.formData.customerName).toBe('John Doe');
      expect(result.current.formData.customerEmail).toBe('john@example.com');
      expect(result.current.formData.customerPhone).toBe('+573001234567');
    });
  });

  describe('setPaymentType', () => {
    it('should change payment type correctly', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.setPaymentType('direct');
      });

      expect(result.current.paymentType).toBe('direct');
    });

    it('should toggle between intent and direct', () => {
      const { result } = renderHook(() => useCheckout());

      expect(result.current.paymentType).toBe('intent');

      act(() => {
        result.current.setPaymentType('direct');
      });
      expect(result.current.paymentType).toBe('direct');

      act(() => {
        result.current.setPaymentType('intent');
      });
      expect(result.current.paymentType).toBe('intent');
    });
  });

  describe('nextStep', () => {
    it('should advance to next step', () => {
      const { result } = renderHook(() => useCheckout());

      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should not advance beyond maximum steps', () => {
      const { result } = renderHook(() => useCheckout());

      // Avanzar al último paso
      act(() => {
        result.current.currentStep = 4;
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(4); // No debe cambiar
    });
  });

  describe('prevStep', () => {
    it('should go back to previous step', () => {
      const { result } = renderHook(() => useCheckout());

      // Avanzar primero
      act(() => {
        result.current.currentStep = 2;
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should not go below step 0', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });
  });

  describe('goToStep', () => {
    it('should jump to specific step', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.goToStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });

    it('should not go to invalid steps', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.goToStep(-1);
      });
      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.goToStep(10);
      });
      expect(result.current.currentStep).toBe(0);
    });
  });

  describe('validateCurrentStep', () => {
    it('should validate step 0 (product selection) correctly', () => {
      const { result } = renderHook(() => useCheckout());

      // Step 0 siempre es válido si hay items en el carrito
      expect(result.current.validateCurrentStep()).toBe(true);
    });

    it('should validate step 1 (information) correctly', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.currentStep = 1;
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      expect(result.current.validateCurrentStep()).toBe(true);
    });

    it('should reject step 1 with missing required fields', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.currentStep = 1;
        // Solo llenar algunos campos
        result.current.updateFormData('customerName', 'John Doe');
        // Falta email y teléfono
      });

      expect(result.current.validateCurrentStep()).toBe(false);
    });

    it('should validate step 1 with direct payment type and card data', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.currentStep = 1;
        result.current.setPaymentType('direct');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
        result.current.updateFormData('cardNumber', '4242424242424242');
        result.current.updateFormData('cardCVC', '123');
        result.current.updateFormData('cardExpiryMonth', '12');
        result.current.updateFormData('cardExpiryYear', '2025');
        result.current.updateFormData('cardHolderName', 'John Doe');
      });

      expect(result.current.validateCurrentStep()).toBe(true);
    });

    it('should reject step 1 with direct payment type but missing card data', () => {
      const { result } = renderHook(() => useCheckout());

      act(() => {
        result.current.currentStep = 1;
        result.current.setPaymentType('direct');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
        // Falta información de tarjeta
      });

      expect(result.current.validateCurrentStep()).toBe(false);
    });
  });

  describe('processCheckout', () => {
    beforeEach(() => {
      // Mock exitoso para createIntentCheckout
      mockCheckoutService.createIntentCheckout.mockResolvedValue({
        transactionId: 'txn_123',
        status: 'pending',
        paymentType: 'intent',
        checkoutUrl: 'https://checkout.wompi.co'
      });

      // Mock exitoso para createDirectPaymentCheckout
      mockCheckoutService.createDirectPaymentCheckout.mockResolvedValue({
        transactionId: 'txn_456',
        status: 'pending',
        paymentType: 'direct',
        wompiTransactionId: 'wompi_txn_789'
      });
    });

    it('should process intent checkout successfully', async () => {
      const { result } = renderHook(() => useCheckout());

      // Configurar para intent checkout
      act(() => {
        result.current.setPaymentType('intent');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      await act(async () => {
        await result.current.processCheckout();
      });

      expect(mockCheckoutService.createIntentCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2000, // Total del carrito mock
          currency: 'COP',
          customerEmail: 'john@example.com',
          customerName: 'John Doe',
          customerPhone: '+573001234567'
        })
      );

      expect(result.current.currentStep).toBe(3); // Debe ir al paso de procesamiento
    });

    it('should process direct payment checkout successfully', async () => {
      const { result } = renderHook(() => useCheckout());

      // Configurar para direct payment
      act(() => {
        result.current.setPaymentType('direct');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
        result.current.updateFormData('cardNumber', '4242424242424242');
        result.current.updateFormData('cardCVC', '123');
        result.current.updateFormData('cardExpiryMonth', '12');
        result.current.updateFormData('cardExpiryYear', '2025');
        result.current.updateFormData('cardHolderName', 'John Doe');
      });

      await act(async () => {
        await result.current.processCheckout();
      });

      expect(mockCheckoutService.createDirectPaymentCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2000,
          currency: 'COP',
          customerEmail: 'john@example.com',
          customerName: 'John Doe',
          customerPhone: '+573001234567',
          paymentMethodToken: expect.any(String)
        })
      );

      expect(result.current.currentStep).toBe(3);
    });

    it('should handle checkout errors', async () => {
      const { result } = renderHook(() => useCheckout());

      // Mock de error
      mockCheckoutService.createIntentCheckout.mockRejectedValue(
        new Error('Checkout failed')
      );

      act(() => {
        result.current.setPaymentType('intent');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      await act(async () => {
        await result.current.processCheckout();
      });

      expect(result.current.error).toBe('Checkout failed');
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during checkout', async () => {
      const { result } = renderHook(() => useCheckout());

      // Mock de checkout lento
      mockCheckoutService.createIntentCheckout.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      act(() => {
        result.current.setPaymentType('intent');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.updateFormData('customerPhone', '+573001234567');
      });

      // Iniciar checkout
      const checkoutPromise = act(async () => {
        await result.current.processCheckout();
      });

      // Verificar que está cargando
      expect(result.current.isLoading).toBe(true);

      // Esperar a que termine
      await checkoutPromise;

      // Verificar que ya no está cargando
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useCheckout());

      // Establecer un error
      act(() => {
        result.current.error = 'Test error';
      });

      expect(result.current.error).toBe('Test error');

      // Limpiar el error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('resetCheckout', () => {
    it('should reset all checkout state to initial values', () => {
      const { result } = renderHook(() => useCheckout());

      // Modificar el estado
      act(() => {
        result.current.currentStep = 3;
        result.current.setPaymentType('direct');
        result.current.updateFormData('customerName', 'John Doe');
        result.current.updateFormData('customerEmail', 'john@example.com');
        result.current.error = 'Test error';
      });

      // Verificar que el estado cambió
      expect(result.current.currentStep).toBe(3);
      expect(result.current.paymentType).toBe('direct');
      expect(result.current.formData.customerName).toBe('John Doe');
      expect(result.current.error).toBe('Test error');

      // Resetear
      act(() => {
        result.current.resetCheckout();
      });

      // Verificar que volvió al estado inicial
      expect(result.current.currentStep).toBe(0);
      expect(result.current.paymentType).toBe('intent');
      expect(result.current.formData.customerName).toBe('');
      expect(result.current.error).toBe(null);
    });
  });

  describe('getCurrentStepTitle', () => {
    it('should return correct step titles', () => {
      const { result } = renderHook(() => useCheckout());

      expect(result.current.getCurrentStepTitle()).toBe('Productos');

      act(() => {
        result.current.currentStep = 1;
      });
      expect(result.current.getCurrentStepTitle()).toBe('Información');

      act(() => {
        result.current.currentStep = 2;
      });
      expect(result.current.getCurrentStepTitle()).toBe('Resumen');

      act(() => {
        result.current.currentStep = 3;
      });
      expect(result.current.getCurrentStepTitle()).toBe('Procesando');

      act(() => {
        result.current.currentStep = 4;
      });
      expect(result.current.getCurrentStepTitle()).toBe('Completado');
    });
  });

  describe('getCurrentStepDescription', () => {
    it('should return correct step descriptions', () => {
      const { result } = renderHook(() => useCheckout());

      expect(result.current.getCurrentStepDescription()).toBe('Revisa los productos en tu carrito');

      act(() => {
        result.current.currentStep = 1;
      });
      expect(result.current.getCurrentStepDescription()).toBe('Completa tu información personal y de pago');

      act(() => {
        result.current.currentStep = 2;
      });
      expect(result.current.getCurrentStepDescription()).toBe('Confirma los detalles de tu compra');

      act(() => {
        result.current.currentStep = 3;
      });
      expect(result.current.getCurrentStepDescription()).toBe('Procesando tu pago...');

      act(() => {
        result.current.currentStep = 4;
      });
      expect(result.current.getCurrentStepDescription()).toBe('¡Tu compra ha sido procesada exitosamente!');
    });
  });
});
