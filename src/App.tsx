import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorProvider } from './contexts/ErrorContext';
import ErrorNotification from './components/ErrorNotification';
import DebugErrorComponent from './components/DebugErrorComponent';
import { LandingPage } from './pages/LandingPage';
import { isDebugEnabled } from './config/app';

function App() {
  // Usar la configuración centralizada para mostrar debug
  const shouldShowDebug = isDebugEnabled();

  return (
    <ErrorProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorNotification />
          {shouldShowDebug && <DebugErrorComponent />}
          <LandingPage />
        </ToastProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;

