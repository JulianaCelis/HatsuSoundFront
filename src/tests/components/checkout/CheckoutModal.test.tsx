import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutModal } from '../../../components/checkout/CheckoutModal';

// Mock del hook useCheckout
const mockUseCheckout = {
  isLoading: false,
  error: null,
  currentStep: 0,
  formData: {
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
  },
  paymentType: 'intent' as 'intent' | 'direct',
  updateFormData: jest.fn(),
  setPaymentType: jest.fn(),
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  goToStep: jest.fn(),
  validateCurrentStep: jest.fn(),
  processCheckout: jest.fn(),
  clearError: jest.fn(),
  resetCheckout: jest.fn(),
  getCurrentStepTitle: jest.fn(() => 'Productos'),
  getCurrentStepDescription: jest.fn(() => 'Revisa los productos en tu carrito')
};

jest.mock('../../../hooks/useCheckout', () => ({
  useCheckout: () => mockUseCheckout
}));

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

// Mock del servicio de checkout
jest.mock('../../../services/checkout.service', () => ({
  checkoutService: {
    validateCreditCard: jest.fn(),
    validateCVC: jest.fn(),
    validateExpiryDate: jest.fn(),
    formatPrice: jest.fn((amount: number) => `$${(amount / 100).toFixed(2)}`),
    calculateCheckoutSummary: jest.fn(() => ({
      subtotal: 2000,
      baseFee: 200,
      deliveryFee: 2000,
      total: 4200
    }))
  }
}));

describe('CheckoutModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Resetear el estado del hook
    mockUseCheckout.currentStep = 0;
    mockUseCheckout.paymentType = 'intent';
    mockUseCheckout.error = null;
    mockUseCheckout.isLoading = false;
    
    // Resetear los mocks de las funciones
    Object.keys(mockUseCheckout).forEach(key => {
      if (typeof mockUseCheckout[key] === 'function') {
        (mockUseCheckout[key] as jest.Mock).mockClear();
      }
    });
  });

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Productos')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<CheckoutModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
    });

    it('should show close button', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should display step indicator', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      // Verificar que se muestran los 5 pasos
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('should show step 0 (Product Selection) by default', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Productos')).toBeInTheDocument();
      expect(screen.getByText('Revisa los productos en tu carrito')).toBeInTheDocument();
    });

    it('should show step 1 (Information) when currentStep is 1', () => {
      mockUseCheckout.currentStep = 1;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Información');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Completa tu información personal y de pago');
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Información')).toBeInTheDocument();
      expect(screen.getByText('Completa tu información personal y de pago')).toBeInTheDocument();
    });

    it('should show step 2 (Summary) when currentStep is 2', () => {
      mockUseCheckout.currentStep = 2;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Resumen');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Confirma los detalles de tu compra');
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Resumen')).toBeInTheDocument();
      expect(screen.getByText('Confirma los detalles de tu compra')).toBeInTheDocument();
    });

    it('should show step 3 (Processing) when currentStep is 3', () => {
      mockUseCheckout.currentStep = 3;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Procesando');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Procesando tu pago...');
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Procesando')).toBeInTheDocument();
      expect(screen.getByText('Procesando tu pago...')).toBeInTheDocument();
    });

    it('should show step 4 (Success) when currentStep is 4', () => {
      mockUseCheckout.currentStep = 4;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Completado');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('¡Tu compra ha sido procesada exitosamente!');
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Completado')).toBeInTheDocument();
      expect(screen.getByText('¡Tu compra ha sido procesada exitosamente!')).toBeInTheDocument();
    });
  });

  describe('Step 0: Product Selection', () => {
    it('should display cart items', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('x2')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument();
    });

    it('should show continue button', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      expect(continueButton).toBeInTheDocument();
    });

    it('should call nextStep when continue button is clicked', () => {
      mockUseCheckout.validateCurrentStep.mockReturnValue(true);
      
      render(<CheckoutModal {...defaultProps} />);
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(continueButton);
      
      expect(mockUseCheckout.validateCurrentStep).toHaveBeenCalled();
      expect(mockUseCheckout.nextStep).toHaveBeenCalled();
    });

    it('should not advance if validation fails', () => {
      mockUseCheckout.validateCurrentStep.mockReturnValue(false);
      
      render(<CheckoutModal {...defaultProps} />);
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(continueButton);
      
      expect(mockUseCheckout.validateCurrentStep).toHaveBeenCalled();
      expect(mockUseCheckout.nextStep).not.toHaveBeenCalled();
    });
  });

  describe('Step 1: Information', () => {
    beforeEach(() => {
      mockUseCheckout.currentStep = 1;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Información');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Completa tu información personal y de pago');
    });

    it('should display customer information form', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    });

    it('should display payment type selection', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByLabelText(/pago en wompi/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pago directo/i)).toBeInTheDocument();
    });

    it('should show card form when direct payment is selected', () => {
      mockUseCheckout.paymentType = 'direct';
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByLabelText(/número de tarjeta/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cvc/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mes de expiración/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/año de expiración/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre del titular/i)).toBeInTheDocument();
    });

    it('should hide card form when intent payment is selected', () => {
      mockUseCheckout.paymentType = 'intent';
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.queryByLabelText(/número de tarjeta/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/cvc/i)).not.toBeInTheDocument();
    });

    it('should call updateFormData when form fields change', async () => {
      const user = userEvent.setup();
      
      render(<CheckoutModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/nombre completo/i);
      await user.type(nameInput, 'John Doe');
      
      expect(mockUseCheckout.updateFormData).toHaveBeenCalledWith('customerName', 'John Doe');
    });

    it('should call setPaymentType when payment type changes', async () => {
      const user = userEvent.setup();
      
      render(<CheckoutModal {...defaultProps} />);
      
      const directPaymentRadio = screen.getByLabelText(/pago directo/i);
      await user.click(directPaymentRadio);
      
      expect(mockUseCheckout.setPaymentType).toHaveBeenCalledWith('direct');
    });

    it('should show navigation buttons', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
    });

    it('should call prevStep when back button is clicked', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const backButton = screen.getByRole('button', { name: /anterior/i });
      fireEvent.click(backButton);
      
      expect(mockUseCheckout.prevStep).toHaveBeenCalled();
    });

    it('should call nextStep when continue button is clicked', () => {
      mockUseCheckout.validateCurrentStep.mockReturnValue(true);
      
      render(<CheckoutModal {...defaultProps} />);
      
      const continueButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(continueButton);
      
      expect(mockUseCheckout.validateCurrentStep).toHaveBeenCalled();
      expect(mockUseCheckout.nextStep).toHaveBeenCalled();
    });
  });

  describe('Step 2: Summary', () => {
    beforeEach(() => {
      mockUseCheckout.currentStep = 2;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Resumen');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Confirma los detalles de tu compra');
    });

    it('should display order summary', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Subtotal
      expect(screen.getByText('$2.00')).toBeInTheDocument(); // Base fee
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Delivery fee
      expect(screen.getByText('$42.00')).toBeInTheDocument(); // Total
    });

    it('should display customer information', () => {
      mockUseCheckout.formData.customerName = 'John Doe';
      mockUseCheckout.formData.customerEmail = 'john@example.com';
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should show payment button', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const paymentButton = screen.getByRole('button', { name: /procesar pago/i });
      expect(paymentButton).toBeInTheDocument();
    });

    it('should call processCheckout when payment button is clicked', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const paymentButton = screen.getByRole('button', { name: /procesar pago/i });
      fireEvent.click(paymentButton);
      
      expect(mockUseCheckout.processCheckout).toHaveBeenCalled();
    });

    it('should show navigation buttons', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument();
    });
  });

  describe('Step 3: Processing', () => {
    beforeEach(() => {
      mockUseCheckout.currentStep = 3;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Procesando');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('Procesando tu pago...');
    });

    it('should display processing message', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Procesando tu pago...')).toBeInTheDocument();
      expect(screen.getByText('Por favor espera mientras procesamos tu transacción.')).toBeInTheDocument();
    });

    it('should show loading spinner', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should not show navigation buttons', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.queryByRole('button', { name: /anterior/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /continuar/i })).not.toBeInTheDocument();
    });
  });

  describe('Step 4: Success', () => {
    beforeEach(() => {
      mockUseCheckout.currentStep = 4;
      mockUseCheckout.getCurrentStepTitle.mockReturnValue('Completado');
      mockUseCheckout.getCurrentStepDescription.mockReturnValue('¡Tu compra ha sido procesada exitosamente!');
    });

    it('should display success message', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('¡Tu compra ha sido procesada exitosamente!')).toBeInTheDocument();
      expect(screen.getByText('Gracias por tu compra.')).toBeInTheDocument();
    });

    it('should show success icon', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    });

    it('should show finish button', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const finishButton = screen.getByRole('button', { name: /finalizar/i });
      expect(finishButton).toBeInTheDocument();
    });

    it('should call onClose when finish button is clicked', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const finishButton = screen.getByRole('button', { name: /finalizar/i });
      fireEvent.click(finishButton);
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      mockUseCheckout.error = 'Test error message';
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should show error close button', () => {
      mockUseCheckout.error = 'Test error message';
      
      render(<CheckoutModal {...defaultProps} />);
      
      const errorCloseButton = screen.getByRole('button', { name: /×/i });
      expect(errorCloseButton).toBeInTheDocument();
    });

    it('should call clearError when error close button is clicked', () => {
      mockUseCheckout.error = 'Test error message';
      
      render(<CheckoutModal {...defaultProps} />);
      
      const errorCloseButton = screen.getByRole('button', { name: /×/i });
      fireEvent.click(errorCloseButton);
      
      expect(mockUseCheckout.clearError).toHaveBeenCalled();
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when clicking outside modal', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const modalOverlay = screen.getByTestId('modal-overlay');
      fireEvent.click(modalOverlay);
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking inside modal content', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const modalContent = screen.getByTestId('modal-content');
      fireEvent.click(modalContent);
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when processing', () => {
      mockUseCheckout.isLoading = true;
      
      render(<CheckoutModal {...defaultProps} />);
      
      expect(screen.getByText('Procesando...')).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      mockUseCheckout.isLoading = true;
      
      render(<CheckoutModal {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        if (button.textContent !== '×' && button.textContent !== 'Cerrar') {
          expect(button).toBeDisabled();
        }
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have mobile-first responsive classes', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const modal = screen.getByTestId('modal-content');
      expect(modal).toHaveClass('w-full', 'max-w-md', 'md:max-w-lg', 'lg:max-w-2xl');
    });

    it('should have proper mobile padding', () => {
      render(<CheckoutModal {...defaultProps} />);
      
      const modal = screen.getByTestId('modal-content');
      expect(modal).toHaveClass('p-4', 'md:p-6');
    });
  });
});
