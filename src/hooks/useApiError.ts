import { useCallback } from 'react';
import { useError } from '../contexts/ErrorContext';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ErrorResponse } from '../types/error-response.model';

export const useApiError = () => {
  const { setError, handleSpecificError } = useError();

  const handleError = useCallback((error: any, retryCallback?: () => void) => {
    // Si el error ya viene del backend con estructura completa, usarlo directamente
    if (error.statusCode && error.message && error.error) {
      console.error('API Error (Backend):', error);
      
      // Manejar rate limiting con reintentos automáticos
      if (ErrorHandlerService.shouldRetry(error) && retryCallback) {
        const retryDelay = ErrorHandlerService.getRetryDelay(error);
        
        console.log(`Reintentando en ${retryDelay / 1000} segundos...`);
        
        setTimeout(() => {
          retryCallback();
        }, retryDelay);
        
        // Mostrar mensaje de reintento
        setError({
          ...error,
          message: `Reintentando automáticamente en ${retryDelay / 1000} segundos...`
        });
      } else {
        // Manejar errores específicos o mostrar error general
        handleSpecificError(error);
      }
      
      return error;
    }
    
    // Solo procesar errores que no vengan del backend (errores de red, etc.)
    const apiError = ErrorHandlerService.handleApiError(error);
    console.error('API Error (Processed):', apiError);
    
    // Manejar rate limiting con reintentos automáticos
    if (ErrorHandlerService.shouldRetry(apiError) && retryCallback) {
      const retryDelay = ErrorHandlerService.getRetryDelay(apiError);
      
      console.log(`Reintentando en ${retryDelay / 1000} segundos...`);
      
      setTimeout(() => {
        retryCallback();
      }, retryDelay);
      
      // Mostrar mensaje de reintento
      setError({
        ...apiError,
        message: `Reintentando automáticamente en ${retryDelay / 1000} segundos...`
      });
    } else {
      // Manejar errores específicos o mostrar error general
      handleSpecificError(apiError);
    }
    
    return apiError;
  }, [setError, handleSpecificError]);

  const createApiCall = useCallback(<T>(
    apiFunction: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: ErrorResponse) => void
  ) => {
    return async () => {
      try {
        const result = await apiFunction();
        onSuccess?.(result);
        return result;
      } catch (error) {
        const apiError = handleError(error, () => {
          // Reintentar la llamada
          createApiCall(apiFunction, onSuccess, onError)();
        });
        onError?.(apiError);
        throw apiError;
      }
    };
  }, [handleError]);

  return {
    handleError,
    createApiCall,
    shouldRetry: ErrorHandlerService.shouldRetry,
    getRetryDelay: ErrorHandlerService.getRetryDelay
  };
};
