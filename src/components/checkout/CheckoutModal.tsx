import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { checkoutService } from '../../services/checkout.service';
import { 
  CheckoutFormData, 
  CheckoutSummary, 
  CheckoutStep,
  CheckoutResponse 
} from '../../types/checkout.model';
import { AudioProduct } from '../../types/audio-product.model';
import './CheckoutModal.css';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  
  // Estados del checkout
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Estados de validación
  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    cardType: 'unknown' as 'visa' | 'mastercard' | 'amex' | 'unknown',
    lastFourDigits: ''
  });

  // Estados de UI
  const [paymentType, setPaymentType] = useState<'intent' | 'direct'>('intent');
  const [showCardForm, setShowCardForm] = useState(false);

  // Pasos del checkout
  const checkoutSteps: CheckoutStep[] = [
    {
      id: 1,
      title: 'Productos',
      description: 'Revisa tu selección',
      isCompleted: currentStep > 1,
      isActive: currentStep === 1
    },
    {
      id: 2,
      title: 'Información',
      description: 'Datos de contacto y pago',
      isCompleted: currentStep > 2,
      isActive: currentStep === 2
    },
    {
      id: 3,
      title: 'Resumen',
      description: 'Confirma tu compra',
      isCompleted: currentStep > 3,
      isActive: currentStep === 3
    },
    {
      id: 4,
      title: 'Procesando',
      description: 'Completando pago',
      isCompleted: currentStep > 4,
      isActive: currentStep === 4
    },
    {
      id: 5,
      title: 'Completado',
      description: '¡Compra exitosa!',
      isCompleted: currentStep === 5,
      isActive: currentStep === 5
    }
  ];

  // Calcular resumen del checkout
  const checkoutSummary: CheckoutSummary = checkoutService.calculateCheckoutSummary(
    cart.total * 100, // Convertir a centavos
    'COP'
  );

  // Validar tarjeta en tiempo real
  useEffect(() => {
    if (formData.cardData?.number) {
      const validation = checkoutService.validateCreditCard(formData.cardData.number);
      setCardValidation(validation);
    }
  }, [formData.cardData?.number]);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para continuar con el checkout');
    } else {
      setError(null);
    }
  }, [isAuthenticated]);

  // Prevenir cierre durante el proceso
  const handleClose = () => {
    if (currentStep === 4) {
      setError('No puedes cerrar el checkout mientras se procesa el pago');
      return;
    }
    onClose();
  };

  // Navegar entre pasos
  const goToStep = (step: number) => {
    if (step < currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      setError(null);
    }
  };

  // Actualizar datos del formulario
  const updateFormData = (field: keyof CheckoutFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Actualizar datos de tarjeta
  const updateCardData = (field: keyof typeof formData.cardData, value: string) => {
    if (formData.cardData) {
      setFormData(prev => ({
        ...prev,
        cardData: {
          ...prev.cardData!,
          [field]: value
        }
      }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
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
  };

  // Procesar checkout
  const processCheckout = async () => {
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
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ProductSelectionStep cart={cart} onNext={() => goToStep(2)} />;
      
      case 2:
        return (
          <InformationStep
            formData={formData}
            updateFormData={updateFormData}
            updateCardData={updateCardData}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            showCardForm={showCardForm}
            setShowCardForm={setShowCardForm}
            cardValidation={cardValidation}
            onNext={() => goToStep(3)}
          />
        );
      
      case 3:
        return (
          <SummaryStep
            cart={cart}
            checkoutSummary={checkoutSummary}
            formData={formData}
            paymentType={paymentType}
            onProcess={processCheckout}
            isLoading={isLoading}
          />
        );
      
      case 4:
        return (
          <ProcessingStep
            transactionStatus={transactionStatus}
            checkoutResponse={checkoutResponse}
          />
        );
      
      case 5:
        return (
          <SuccessStep
            checkoutResponse={checkoutResponse}
            onClose={onClose}
          />
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={handleClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="checkout-modal-header">
          <h2>Checkout - HatsuSound</h2>
          <button className="checkout-modal-close" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m6 6 12 12M6 18 18 6"/>
            </svg>
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="checkout-steps">
          {checkoutSteps.map((step) => (
            <div
              key={step.id}
              className={`checkout-step ${step.isActive ? 'active' : ''} ${step.isCompleted ? 'completed' : ''}`}
              onClick={() => goToStep(step.id)}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
              {step.isCompleted && (
                <div className="step-check">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        <div className="checkout-content">
          {error && (
            <div className="checkout-error">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

// Componente del paso 1: Selección de productos
const ProductSelectionStep: React.FC<{
  cart: any;
  onNext: () => void;
}> = ({ cart, onNext }) => (
  <div className="checkout-step-content">
    <h3>Tu Selección Musical</h3>
    
    <div className="cart-items-review">
      {cart.items.map((item: any) => (
        <div key={item.product.id} className="cart-item-review">
          <div className="item-info">
            <h4>{item.product.title}</h4>
            <p>{item.product.artist} • {item.product.genre}</p>
            <span className="item-format">{item.product.format.toUpperCase()}</span>
          </div>
          <div className="item-details">
            <span className="item-quantity">x{item.quantity}</span>
            <span className="item-price">
              {checkoutService.formatPrice(item.product.price * item.quantity * 100)}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="step-actions">
      <button className="btn-primary" onClick={onNext}>
        Continuar
      </button>
    </div>
  </div>
);

// Componente del paso 2: Información del cliente y pago
const InformationStep: React.FC<{
  formData: CheckoutFormData;
  updateFormData: (field: keyof CheckoutFormData, value: any) => void;
  updateCardData: (field: keyof typeof formData.cardData, value: string) => void;
  paymentType: 'intent' | 'direct';
  setPaymentType: (type: 'intent' | 'direct') => void;
  showCardForm: boolean;
  setShowCardForm: (show: boolean) => void;
  cardValidation: any;
  onNext: () => void;
}> = ({ 
  formData, 
  updateFormData, 
  updateCardData, 
  paymentType, 
  setPaymentType, 
  showCardForm, 
  setShowCardForm, 
  cardValidation, 
  onNext 
}) => (
  <div className="checkout-step-content">
    <h3>Información de Contacto y Pago</h3>
    
    {/* Datos del cliente */}
    <div className="form-section">
      <h4>Datos del Cliente</h4>
      
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => updateFormData('customerEmail', e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Nombre Completo *</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => updateFormData('customerName', e.target.value)}
          placeholder="Tu nombre completo"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Teléfono *</label>
        <input
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => updateFormData('customerPhone', e.target.value)}
          placeholder="+57 300 123 4567"
          required
        />
      </div>
    </div>

    {/* Tipo de pago */}
    <div className="form-section">
      <h4>Método de Pago</h4>
      
      <div className="payment-type-selection">
        <label className="payment-option">
          <input
            type="radio"
            value="intent"
            checked={paymentType === 'intent'}
            onChange={(e) => setPaymentType(e.target.value as 'intent' | 'direct')}
          />
          <div className="payment-option-content">
            <div className="payment-option-icon">🌐</div>
            <div className="payment-option-text">
              <strong>Pago en Wompi (Recomendado)</strong>
              <span>Serás redirigido a Wompi para completar el pago de forma segura</span>
            </div>
          </div>
        </label>
        
        <label className="payment-option">
          <input
            type="radio"
            value="direct"
            checked={paymentType === 'direct'}
            onChange={(e) => setPaymentType(e.target.value as 'intent' | 'direct')}
          />
          <div className="payment-option-content">
            <div className="payment-option-icon">💳</div>
            <div className="payment-option-text">
              <strong>Pago Directo</strong>
              <span>Procesa el pago inmediatamente con tu tarjeta</span>
            </div>
          </div>
        </label>
      </div>
    </div>

    {/* Formulario de tarjeta (solo para pago directo) */}
    {paymentType === 'direct' && (
      <div className="form-section">
        <h4>Datos de Tarjeta</h4>
        
        <div className="form-group">
          <label>Número de Tarjeta *</label>
          <div className="card-input-wrapper">
            <input
              type="text"
              value={formData.cardData?.number || ''}
              onChange={(e) => updateCardData('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={cardValidation.isValid ? 'valid' : cardValidation.lastFourDigits ? 'invalid' : ''}
            />
            {cardValidation.cardType !== 'unknown' && (
              <div className={`card-type-icon ${cardValidation.cardType}`}>
                {cardValidation.cardType === 'visa' ? '💳' : 
                 cardValidation.cardType === 'mastercard' ? '💳' : '💳'}
              </div>
            )}
          </div>
          {cardValidation.lastFourDigits && (
            <span className="card-validation">
              {cardValidation.isValid ? '✅ Válida' : '❌ Inválida'} 
              • Termina en {cardValidation.lastFourDigits}
            </span>
          )}
        </div>
        
        <div className="card-details-row">
          <div className="form-group">
            <label>CVC *</label>
            <input
              type="text"
              value={formData.cardData?.cvc || ''}
              onChange={(e) => updateCardData('cvc', e.target.value)}
              placeholder="123"
              maxLength={4}
            />
          </div>
          
          <div className="form-group">
            <label>Mes *</label>
            <input
              type="text"
              value={formData.cardData?.expMonth || ''}
              onChange={(e) => updateCardData('expMonth', e.target.value)}
              placeholder="12"
              maxLength={2}
            />
          </div>
          
          <div className="form-group">
            <label>Año *</label>
            <input
              type="text"
              value={formData.cardData?.expYear || ''}
              onChange={(e) => updateCardData('expYear', e.target.value)}
              placeholder="2025"
              maxLength={4}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Nombre del Titular *</label>
          <input
            type="text"
            value={formData.cardData?.cardHolderName || ''}
            onChange={(e) => updateCardData('cardHolderName', e.target.value)}
            placeholder="Como aparece en la tarjeta"
          />
        </div>
      </div>
    )}

    <div className="step-actions">
      <button className="btn-primary" onClick={onNext}>
        Continuar al Resumen
      </button>
    </div>
  </div>
);

// Componente del paso 3: Resumen y confirmación
const SummaryStep: React.FC<{
  cart: any;
  checkoutSummary: CheckoutSummary;
  formData: CheckoutFormData;
  paymentType: 'intent' | 'direct';
  onProcess: () => void;
  isLoading: boolean;
}> = ({ cart, checkoutSummary, formData, paymentType, onProcess, isLoading }) => (
  <div className="checkout-step-content">
    <h3>Resumen de tu Compra</h3>
    
    {/* Resumen de productos */}
    <div className="summary-section">
      <h4>Productos</h4>
      {cart.items.map((item: any) => (
        <div key={item.product.id} className="summary-item">
          <span>{item.product.title} x{item.quantity}</span>
          <span>{checkoutService.formatPrice(item.product.price * item.quantity * 100)}</span>
        </div>
      ))}
    </div>

    {/* Resumen de costos */}
    <div className="summary-section">
      <h4>Desglose de Costos</h4>
      
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{checkoutService.formatPrice(checkoutSummary.subtotal)}</span>
      </div>
      
      <div className="summary-row">
        <span>Cargo base</span>
        <span>{checkoutService.formatPrice(checkoutSummary.baseFee)}</span>
      </div>
      
      <div className="summary-row">
        <span>Descarga digital</span>
        <span>{checkoutService.formatPrice(checkoutSummary.deliveryFee)}</span>
      </div>
      
      <div className="summary-row total">
        <span>Total</span>
        <span>{checkoutService.formatPrice(checkoutSummary.total)}</span>
      </div>
    </div>

    {/* Información del cliente */}
    <div className="summary-section">
      <h4>Información de Contacto</h4>
      
      <div className="summary-row">
        <span>Email</span>
        <span>{formData.customerEmail}</span>
      </div>
      
      <div className="summary-row">
        <span>Nombre</span>
        <span>{formData.customerName}</span>
      </div>
      
      <div className="summary-row">
        <span>Teléfono</span>
        <span>{formData.customerPhone}</span>
      </div>
    </div>

    {/* Método de pago */}
    <div className="summary-section">
      <h4>Método de Pago</h4>
      <div className="summary-row">
        <span>Tipo</span>
        <span>
          {paymentType === 'intent' ? 'Pago en Wompi' : 'Pago Directo'}
        </span>
      </div>
    </div>

    <div className="step-actions">
      <button 
        className="btn-primary checkout-btn" 
        onClick={onProcess}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : 'Proceder al Pago'}
      </button>
    </div>
  </div>
);

// Componente del paso 4: Procesando pago
const ProcessingStep: React.FC<{
  transactionStatus: string;
  checkoutResponse: CheckoutResponse | null;
}> = ({ transactionStatus, checkoutResponse }) => (
  <div className="checkout-step-content processing">
    <div className="processing-animation">
      <div className="spinner"></div>
    </div>
    
    <h3>Procesando tu Pago</h3>
    <p>Por favor no cierres esta ventana mientras procesamos tu transacción...</p>
    
    {checkoutResponse && (
      <div className="transaction-info">
        <p><strong>ID de Transacción:</strong> {checkoutResponse.transactionId}</p>
        <p><strong>Referencia:</strong> {checkoutResponse.reference}</p>
        <p><strong>Estado:</strong> {transactionStatus}</p>
      </div>
    )}
  </div>
);

// Componente del paso 5: Éxito
const SuccessStep: React.FC<{
  checkoutResponse: CheckoutResponse | null;
  onClose: () => void;
}> = ({ checkoutResponse, onClose }) => (
  <div className="checkout-step-content success">
    <div className="success-animation">
      <div className="success-check">✓</div>
    </div>
    
    <h3>¡Compra Exitosa!</h3>
    <p>Tu música está siendo procesada y estará disponible para descarga en breve.</p>
    
    {checkoutResponse && (
      <div className="success-details">
        <p><strong>ID de Transacción:</strong> {checkoutResponse.transactionId}</p>
        <p><strong>Referencia:</strong> {checkoutResponse.reference}</p>
        <p><strong>Total:</strong> {checkoutService.formatPrice(checkoutResponse.amount)}</p>
      </div>
    )}
    
    <div className="success-message">
      <p>Recibirás un email de confirmación con los enlaces de descarga.</p>
      <p>¡Gracias por elegir HatsuSound!</p>
    </div>

    <div className="step-actions">
      <button className="btn-primary" onClick={onClose}>
        Continuar Comprando
      </button>
    </div>
  </div>
);

export default CheckoutModal;
