import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorProvider } from './contexts/ErrorContext';
import { CartProvider } from './contexts/CartContext';
import ErrorNotification from './components/ErrorNotification';
import DebugErrorComponent from './components/DebugErrorComponent';
import { LandingPage } from './pages/LandingPage';
import { CartIcon, CartModal } from './components/cart';
import { isDebugEnabled } from './config/app';

function App() {
  const shouldShowDebug = isDebugEnabled();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ErrorProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <ErrorNotification />
              {shouldShowDebug && <DebugErrorComponent />}

              {/* Navigation */}
              <nav className="bg-gray-900 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    HatsuSound
                  </Link>
                  <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-300 transition-colors">
                      Inicio
                    </Link>
                    <CartIcon onClick={() => setIsCartOpen(true)} />
                  </div>
                </div>
              </nav>

              {/* Routes */}
              <Routes>
                <Route path="/" element={<LandingPage />} />
              </Routes>

              {/* Cart Modal */}
              <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;

