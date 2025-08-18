import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ErrorResponse } from '../types/error-response.model';

interface ErrorContextType {
  error: ErrorResponse | null;
  setError: (error: ErrorResponse) => void;
  clearError: () => void;
  handleSpecificError: (error: ErrorResponse) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setErrorState] = useState<ErrorResponse | null>(null);

  const setError = (error: ErrorResponse) => {
    setErrorState(error);
    
    // Auto-limpiar errores después de un tiempo
    setTimeout(() => {
      clearError();
    }, 8000); // 8 segundos
  };

  const clearError = () => {
    setErrorState(null);
  };

  const handleSpecificError = (error: ErrorResponse) => {
    switch (error.statusCode) {
      case 401:
        // Redirigir a login - esto se manejará en el componente de login
        setError(error);
        break;
      case 403:
        // Mostrar mensaje de permisos insuficientes
        setError(error);
        break;
      case 429:
        // Mostrar error de rate limiting
        setError(error);
        break;
      default:
        setError(error);
    }
  };

  const value: ErrorContextType = {
    error,
    setError,
    clearError,
    handleSpecificError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

