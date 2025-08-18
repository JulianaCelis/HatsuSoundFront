import { ErrorResponse } from '../types/error-response.model';

export class ErrorHandlerService {
  
  static handleApiError(error: any): ErrorResponse {
    // Si es un error de la API (tiene statusCode)
    if (error.statusCode) {
      return {
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
        timestamp: error.timestamp,
        path: error.path,
        method: error.method,
        details: error.details
      };
    }
    
    // Si es un error de red o desconocido
    return {
      statusCode: 500,
      message: 'Error de conexión con el servidor',
      error: 'Network Error',
      timestamp: new Date().toISOString(),
      path: 'unknown',
      method: 'unknown'
    };
  }
  
  static getErrorMessage(error: ErrorResponse): string {
    // Si el backend ya proporciona un mensaje específico, usarlo
    if (error.message && error.message !== 'Unauthorized') {
      return error.message;
    }
    
    // Mapear códigos de error a mensajes amigables cuando no hay mensaje específico
    switch (error.statusCode) {
      case 400:
        return 'Datos inválidos';
      case 401:
        return 'Credenciales inválidas. Verifica tu correo y contraseña.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Conflicto: ' + error.message;
      case 429:
        return 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.';
      case 500:
        return 'Error interno del servidor. Intenta más tarde.';
      default:
        return error.message || 'Ha ocurrido un error inesperado.';
    }
  }
  
  static shouldRetry(error: ErrorResponse): boolean {
    // Reintentar en errores de servidor o rate limiting
    return error.statusCode >= 500 || error.statusCode === 429;
  }
  
  static getRetryDelay(error: ErrorResponse): number {
    if (error.statusCode === 429 && error.details?.retryAfter) {
      return error.details.retryAfter * 1000; // Convertir a milisegundos
    }
    return 5000; // 5 segundos por defecto
  }
  
  static getErrorTitle(error: ErrorResponse): string {
    switch (error.statusCode) {
      case 400: return 'Error de Validación';
      case 401: 
        // Si es un error de login específico, mostrar título más amigable
        if (error.path && error.path.includes('/auth/login')) {
          return 'Error de Login';
        }
        return 'No Autorizado';
      case 403: return 'Acceso Denegado';
      case 404: return 'No Encontrado';
      case 409: return 'Conflicto';
      case 429: return 'Demasiadas Solicitudes';
      case 500: return 'Error del Servidor';
      default: return 'Error';
    }
  }
}
