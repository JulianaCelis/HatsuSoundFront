// Error handling utilities for user-friendly error messages

export interface ErrorInfo {
  userMessage: string;
  title: string;
  isRetryable: boolean;
  suggestion?: string;
}

export class UserFriendlyError extends Error {
  public readonly userInfo: ErrorInfo;
  
  constructor(message: string, userInfo: ErrorInfo) {
    super(message);
    this.name = 'UserFriendlyError';
    this.userInfo = userInfo;
  }
}

// Network error detection
export const isNetworkError = (error: any): boolean => {
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  if (error.message?.includes('Failed to fetch')) return true;
  if (error.message?.includes('NetworkError')) return true;
  if (error.message?.includes('ERR_NETWORK')) return true;
  if (error.code === 'NETWORK_ERROR') return true;
  if (error.message?.includes('Unexpected token')) return true;
  if (error.message?.includes('<!DOCTYPE')) return true;
  if (error.message?.includes('not valid JSON')) return true;
  return false;
};

// Server error detection
export const isServerError = (error: any): boolean => {
  if (error.status >= 500) return true;
  if (error.message?.includes('Internal Server Error')) return true;
  if (error.message?.includes('Service Unavailable')) return true;
  if (error.message?.includes('<!DOCTYPE')) return true;
  if (error.message?.includes('html')) return true;
  if (error.message?.includes('HTML')) return true;
  return false;
};

// Authentication error detection
export const isAuthError = (error: any): boolean => {
  if (error.status === 401) return true;
  if (error.status === 403) return true;
  if (error.message?.includes('Unauthorized')) return true;
  if (error.message?.includes('Forbidden')) return true;
  if (error.message?.includes('Invalid credentials')) return true;
  return false;
};

// Rate limiting error detection
export const isRateLimitError = (error: any): boolean => {
  if (error.status === 429) return true;
  if (error.message?.includes('Too Many Requests')) return true;
  if (error.message?.includes('Rate limit')) return true;
  return false;
};

// JSON parsing error detection
export const isJsonParsingError = (error: any): boolean => {
  if (error.message?.includes('Unexpected token')) return true;
  if (error.message?.includes('not valid JSON')) return true;
  if (error.message?.includes('JSON.parse')) return true;
  if (error.message?.includes('SyntaxError')) return true;
  return false;
};

// Validation error detection
export const isValidationError = (error: any): boolean => {
  if (error.status === 400) return true;
  if (error.status === 422) return true;
  if (error.message?.includes('Validation failed')) return true;
  if (error.message?.includes('Invalid input')) return true;
  return false;
};

// Convert any error to user-friendly format
export const makeUserFriendly = (error: any): ErrorInfo => {
  // Network errors (backend not available)
  if (isNetworkError(error)) {
    // Check for specific JSON parsing errors that indicate HTML responses
    if (error.message?.includes('Unexpected token') || error.message?.includes('<!DOCTYPE')) {
      return {
        userMessage: 'El servidor no está disponible en este momento. Está devolviendo una página de error en lugar de datos válidos.',
        title: 'Servidor no disponible',
        isRetryable: true,
        suggestion: 'El backend puede estar caído o configurado incorrectamente. Intenta de nuevo más tarde.'
      };
    }
    
    return {
      userMessage: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      title: 'Error de conexión',
      isRetryable: true,
      suggestion: 'Intenta de nuevo en unos momentos o verifica tu conexión.'
    };
  }

  // Server errors
  if (isServerError(error)) {
    // Check for HTML responses that indicate server configuration issues
    if (error.message?.includes('<!DOCTYPE') || error.message?.includes('html')) {
      return {
        userMessage: 'El servidor está devolviendo páginas HTML en lugar de datos JSON. Esto indica un problema de configuración.',
        title: 'Error de configuración del servidor',
        isRetryable: true,
        suggestion: 'El backend puede estar configurado incorrectamente o devolviendo páginas de error. Contacta al administrador.'
      };
    }
    
    return {
      userMessage: 'El servidor está experimentando problemas técnicos.',
      title: 'Error del servidor',
      isRetryable: true,
      suggestion: 'Intenta de nuevo en unos minutos. Si el problema persiste, contacta soporte.'
    };
  }

  // Authentication errors
  if (isAuthError(error)) {
    if (error.status === 401) {
      return {
        userMessage: 'Tu sesión ha expirado o las credenciales son incorrectas.',
        title: 'Error de autenticación',
        isRetryable: false,
        suggestion: 'Verifica tu email/username y contraseña, o inicia sesión nuevamente.'
      };
    }
    if (error.status === 403) {
      return {
        userMessage: 'No tienes permisos para realizar esta acción.',
        title: 'Acceso denegado',
        isRetryable: false,
        suggestion: 'Contacta al administrador si crees que esto es un error.'
      };
    }
  }

  // JSON parsing errors (usually indicate HTML responses from server)
  if (isJsonParsingError(error)) {
    return {
      userMessage: 'El servidor está devolviendo datos en formato incorrecto. Esto suele indicar que el backend no está funcionando correctamente.',
      title: 'Error de formato del servidor',
      isRetryable: true,
      suggestion: 'El servidor puede estar caído o devolviendo páginas de error HTML. Intenta de nuevo más tarde.'
    };
  }

  // Rate limiting
  if (isRateLimitError(error)) {
    return {
      userMessage: 'Has realizado demasiadas solicitudes. Espera un momento antes de intentar de nuevo.',
      title: 'Demasiadas solicitudes',
      isRetryable: true,
      suggestion: 'Espera unos minutos antes de intentar nuevamente.'
    };
  }

  // Validation errors
  if (isValidationError(error)) {
    // Check for specific backend error messages that need translation
    if (error.message) {
      const backendErrorMessages: Record<string, ErrorInfo> = {
        'Bad Request Exception': {
          userMessage: 'Los datos enviados no son válidos o están incompletos.',
          title: 'Datos incorrectos',
          isRetryable: false,
          suggestion: 'Verifica que todos los campos estén completos y con el formato correcto.'
        },
        'Bad Request': {
          userMessage: 'La solicitud no se pudo procesar. Los datos enviados no son válidos.',
          title: 'Solicitud incorrecta',
          isRetryable: false,
          suggestion: 'Revisa la información ingresada y asegúrate de que todos los campos sean correctos.'
        },
        'Validation failed': {
          userMessage: 'La información ingresada no cumple con los requisitos.',
          title: 'Validación fallida',
          isRetryable: false,
          suggestion: 'Revisa los mensajes de error en cada campo y corrige los problemas.'
        },
        'Invalid input': {
          userMessage: 'Los datos ingresados no son válidos.',
          title: 'Entrada inválida',
          isRetryable: false,
          suggestion: 'Verifica el formato y contenido de cada campo.'
        }
      };

      // Check if we have a specific message for this error
      for (const [key, info] of Object.entries(backendErrorMessages)) {
        if (error.message.includes(key) || error.message.toLowerCase().includes(key.toLowerCase())) {
          return info;
        }
      }
    }

    if (error.errors && typeof error.errors === 'object') {
      // Handle field-specific validation errors
      const fieldErrors = Object.values(error.errors).flat();
      const errorMessage = fieldErrors.length > 0 
        ? fieldErrors.join('. ')
        : 'Los datos ingresados no son válidos.';
      
      return {
        userMessage: errorMessage,
        title: 'Datos inválidos',
        isRetryable: false,
        suggestion: 'Revisa la información ingresada y corrige los errores.'
      };
    }
    
    return {
      userMessage: 'Los datos ingresados no son válidos.',
      title: 'Datos inválidos',
      isRetryable: false,
      suggestion: 'Revisa la información ingresada y corrige los errores.'
    };
  }

  // Specific error messages from backend
  if (error.message) {
    // Common backend error messages in Spanish
    const errorMessages: Record<string, ErrorInfo> = {
      'User not found': {
        userMessage: 'No se encontró una cuenta con esas credenciales.',
        title: 'Usuario no encontrado',
        isRetryable: false,
        suggestion: 'Verifica tu email/username o crea una nueva cuenta.'
      },
      'Invalid password': {
        userMessage: 'La contraseña es incorrecta.',
        title: 'Contraseña incorrecta',
        isRetryable: false,
        suggestion: 'Verifica tu contraseña e intenta de nuevo.'
      },
      'Email already exists': {
        userMessage: 'Ya existe una cuenta con ese email.',
        title: 'Email duplicado',
        isRetryable: false,
        suggestion: 'Usa un email diferente o inicia sesión con tu cuenta existente.'
      },
      'Username already exists': {
        userMessage: 'Ya existe un usuario con ese nombre.',
        title: 'Nombre de usuario duplicado',
        isRetryable: false,
        suggestion: 'Elige un nombre de usuario diferente.'
      },
      'Account is disabled': {
        userMessage: 'Tu cuenta ha sido deshabilitada.',
        title: 'Cuenta deshabilitada',
        isRetryable: false,
        suggestion: 'Contacta al administrador para más información.'
      },
      // Common backend exceptions and technical errors
      'Bad Request Exception': {
        userMessage: 'Los datos enviados no son válidos o están incompletos.',
        title: 'Datos incorrectos',
        isRetryable: false,
        suggestion: 'Verifica que todos los campos estén completos y con el formato correcto.'
      },
      'Internal Server Error': {
        userMessage: 'El servidor está experimentando problemas técnicos.',
        title: 'Error del servidor',
        isRetryable: true,
        suggestion: 'Intenta de nuevo en unos minutos. Si el problema persiste, contacta soporte.'
      },
      'Service Unavailable': {
        userMessage: 'El servicio no está disponible en este momento.',
        title: 'Servicio no disponible',
        isRetryable: true,
        suggestion: 'Intenta de nuevo más tarde. El servidor puede estar en mantenimiento.'
      },
      'Request Timeout': {
        userMessage: 'La solicitud tardó demasiado en procesarse.',
        title: 'Tiempo de espera agotado',
        isRetryable: true,
        suggestion: 'Intenta de nuevo. Si el problema persiste, verifica tu conexión.'
      }
    };

    // Check if we have a specific message for this error
    for (const [key, info] of Object.entries(errorMessages)) {
      if (error.message.includes(key) || error.message.toLowerCase().includes(key.toLowerCase())) {
        return info;
      }
    }

    // If no specific match, try to make the backend message more user-friendly
    const cleanMessage = cleanBackendMessage(error.message);
    return {
      userMessage: cleanMessage.length > 100 
        ? 'Ocurrió un error inesperado. Intenta de nuevo.'
        : cleanMessage,
      title: 'Error',
      isRetryable: false,
      suggestion: 'Si el problema persiste, contacta soporte.'
    };
  }

  // Generic fallback
  return {
    userMessage: 'Ocurrió un error inesperado. Intenta de nuevo.',
    title: 'Error',
    isRetryable: true,
    suggestion: 'Si el problema persiste, contacta soporte técnico.'
  };
};

// Clean and translate backend error messages
export const cleanBackendMessage = (message: string): string => {
  if (!message) return 'Ocurrió un error inesperado.';
  
  // Remove technical prefixes and suffixes
  let cleanMessage = message
    .replace(/^(Bad Request|Internal Server Error|Validation Error|Authentication Error):?\s*/i, '')
    .replace(/^(Exception|Error):?\s*/i, '')
    .replace(/\s*at\s+.*$/gm, '') // Remove stack traces
    .replace(/\s*\(.*?\)/g, '') // Remove parentheses content
    .replace(/\s*\[.*?\]/g, '') // Remove bracket content
    .replace(/\s*\{.*?\}/g, '') // Remove brace content
    .trim();

  // Translate common technical terms
  const translations: Record<string, string> = {
    'Bad Request': 'Solicitud incorrecta',
    'Internal Server Error': 'Error interno del servidor',
    'Validation Error': 'Error de validación',
    'Authentication Error': 'Error de autenticación',
    'Unauthorized': 'No autorizado',
    'Forbidden': 'Prohibido',
    'Not Found': 'No encontrado',
    'Conflict': 'Conflicto',
    'Too Many Requests': 'Demasiadas solicitudes',
    'Request Timeout': 'Tiempo de espera agotado',
    'Service Unavailable': 'Servicio no disponible',
    'Gateway Timeout': 'Tiempo de espera del gateway',
    'Not Implemented': 'No implementado',
    'Bad Gateway': 'Gateway incorrecto'
  };

  // Apply translations
  for (const [technical, userFriendly] of Object.entries(translations)) {
    cleanMessage = cleanMessage.replace(new RegExp(technical, 'gi'), userFriendly);
  }

  // If the message is still too technical, provide a generic one
  if (cleanMessage.includes('Exception') || cleanMessage.includes('Error') || cleanMessage.length < 10) {
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }

  return cleanMessage;
};

// Create a user-friendly error from any error
export const createUserFriendlyError = (error: any): UserFriendlyError => {
  const userInfo = makeUserFriendly(error);
  return new UserFriendlyError(error.message || 'Unknown error', userInfo);
};
