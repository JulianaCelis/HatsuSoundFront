import React, { useState } from 'react';
import { CheckoutModal } from '../../../components/checkout/CheckoutModal';
import { checkoutService } from '../../../services/checkout.service';
import '../../../components/checkout/CheckoutModal.css';

const CheckoutTestComponent: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Datos de prueba
  const mockCart = {
    items: [
      {
        product: {
          id: 'test_album_001',
          title: 'HatsuSound Vol. 1 - Test',
          artist: 'HatsuSound Collective',
          genre: 'electronic',
          format: 'mp3',
          price: 15.99,
          stock: 100
        },
        quantity: 1
      },
      {
        product: {
          id: 'test_track_001',
          title: 'Midnight Groove - Test',
          artist: 'HatsuSound Collective',
          genre: 'house',
          format: 'wav',
          price: 2.99,
          stock: 50
        },
        quantity: 2
      }
    ],
    total: 21.97
  };

  // Función para probar validaciones de tarjeta
  const testCardValidations = () => {
    const results: string[] = [];
    
    // Test 1: Tarjeta VISA válida
    const visaCard = '4242424242424242';
    const visaValidation = checkoutService.validateCreditCard(visaCard);
    results.push(`VISA Test: ${visaValidation.isValid ? '✅ Válida' : '❌ Inválida'} - Tipo: ${visaValidation.cardType}`);
    
    // Test 2: Tarjeta Mastercard válida
    const mastercard = '5555555555554444';
    const mastercardValidation = checkoutService.validateCreditCard(mastercard);
    results.push(`Mastercard Test: ${mastercardValidation.isValid ? '✅ Válida' : '❌ Inválida'} - Tipo: ${mastercardValidation.cardType}`);
    
    // Test 3: Tarjeta inválida
    const invalidCard = '1234567890123456';
    const invalidValidation = checkoutService.validateCreditCard(invalidCard);
    results.push(`Invalid Card Test: ${invalidValidation.isValid ? '✅ Válida' : '❌ Inválida'} - Tipo: ${invalidValidation.cardType}`);
    
    // Test 4: Validación CVC
    const validCVC = checkoutService.validateCVC('123', 'visa');
    const invalidCVC = checkoutService.validateCVC('12', 'visa');
    results.push(`CVC Test: ${validCVC ? '✅ Válido' : '❌ Inválido'} (123), ${invalidCVC ? '✅ Válido' : '❌ Inválido'} (12)`);
    
    // Test 5: Validación fecha
    const currentYear = new Date().getFullYear();
    const validDate = checkoutService.validateExpiryDate('12', (currentYear + 1).toString());
    const invalidDate = checkoutService.validateExpiryDate('12', (currentYear - 1).toString());
    results.push(`Date Test: ${validDate ? '✅ Válida' : '❌ Inválida'} (12/${currentYear + 1}), ${invalidDate ? '✅ Válida' : '❌ Inválida'} (12/${currentYear - 1})`);
    
    setTestResults(results);
  };

  // Función para probar cálculos de precio
  const testPriceCalculations = () => {
    const results: string[] = [];
    
    // Test 1: Formateo de precio
    const priceInCents = 5000; // $50.00
    const formattedPrice = checkoutService.formatPrice(priceInCents, 'COP');
    results.push(`Price Format Test: ${priceInCents} centavos = ${formattedPrice}`);
    
    // Test 2: Cálculo de resumen
    const summary = checkoutService.calculateCheckoutSummary(5000, 'COP');
    results.push(`Summary Test: Subtotal: ${checkoutService.formatPrice(summary.subtotal)}, Base Fee: ${checkoutService.formatPrice(summary.baseFee)}, Delivery: ${checkoutService.formatPrice(summary.deliveryFee)}, Total: ${checkoutService.formatPrice(summary.total)}`);
    
    setTestResults(results);
  };

  // Función para limpiar resultados
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="checkout-test-component">
      <div className="test-header">
        <h2>🧪 Checkout Test Component</h2>
        <p>Componente de prueba para el sistema de checkout con Wompi</p>
      </div>

      <div className="test-actions">
        <button 
          className="test-btn primary"
          onClick={() => setShowCheckout(true)}
        >
          🚀 Abrir Checkout Modal
        </button>
        
        <button 
          className="test-btn secondary"
          onClick={testCardValidations}
        >
          💳 Probar Validaciones de Tarjeta
        </button>
        
        <button 
          className="test-btn secondary"
          onClick={testPriceCalculations}
        >
          💰 Probar Cálculos de Precio
        </button>
        
        <button 
          className="test-btn clear"
          onClick={clearResults}
        >
          🗑️ Limpiar Resultados
        </button>
      </div>

      {/* Información del carrito de prueba */}
      <div className="test-cart-info">
        <h3>🛒 Carrito de Prueba</h3>
        <div className="cart-items">
          {mockCart.items.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="item-info">
                <strong>{item.product.title}</strong>
                <span>{item.product.artist} • {item.product.genre}</span>
                <span className="format">{item.product.format.toUpperCase()}</span>
              </div>
              <div className="item-details">
                <span>x{item.quantity}</span>
                <span className="price">${item.product.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <strong>Total: ${mockCart.total}</strong>
        </div>
      </div>

      {/* Resultados de las pruebas */}
      {testResults.length > 0 && (
        <div className="test-results">
          <h3>📊 Resultados de las Pruebas</h3>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className="result-item">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instrucciones de uso */}
      <div className="test-instructions">
        <h3>📖 Instrucciones de Uso</h3>
        <div className="instructions-content">
          <div className="instruction-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Configuración del Backend:</strong>
              <p>Asegúrate de que tu backend esté ejecutándose en <code>http://localhost:3001</code></p>
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Variables de Entorno:</strong>
              <p>Crea un archivo <code>.env.local</code> con:</p>
              <code>REACT_APP_API_URL=http://localhost:3001</code>
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Autenticación:</strong>
              <p>Debes estar autenticado para usar el checkout. Usa el sistema de login existente.</p>
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">4</span>
            <div className="step-content">
              <strong>Pruebas:</strong>
              <p>Usa los botones de prueba para verificar las validaciones y cálculos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />

      <style jsx>{`
        .checkout-test-component {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .test-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
        }

        .test-header h2 {
          margin: 0 0 10px 0;
          font-size: 2rem;
        }

        .test-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .test-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .test-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .test-btn.primary {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
        }

        .test-btn.secondary {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
        }

        .test-btn.clear {
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          color: white;
        }

        .test-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .test-cart-info {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .test-cart-info h3 {
          margin: 0 0 15px 0;
          color: #495057;
        }

        .cart-items {
          margin-bottom: 15px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .item-info strong {
          color: #212529;
        }

        .item-info span {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .format {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .item-details {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .price {
          color: #28a745;
          font-weight: 600;
        }

        .cart-total {
          text-align: right;
          padding-top: 15px;
          border-top: 2px solid #dee2e6;
          font-size: 1.1rem;
          color: #212529;
        }

        .test-results {
          background: #e8f5e8;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid #c3e6c3;
        }

        .test-results h3 {
          margin: 0 0 15px 0;
          color: #155724;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-item {
          background: white;
          padding: 10px 15px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .test-instructions {
          background: #fff3cd;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #ffeaa7;
        }

        .test-instructions h3 {
          margin: 0 0 15px 0;
          color: #856404;
        }

        .instructions-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .instruction-step {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .step-number {
          width: 30px;
          height: 30px;
          background: #ffc107;
          color: #856404;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .step-content strong {
          display: block;
          margin-bottom: 5px;
          color: #856404;
        }

        .step-content p {
          margin: 0;
          color: #856404;
          line-height: 1.5;
        }

        .step-content code {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .test-actions {
            flex-direction: column;
            align-items: center;
          }

          .test-btn {
            min-width: 250px;
          }

          .cart-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .item-details {
            text-align: left;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutTestComponent;
