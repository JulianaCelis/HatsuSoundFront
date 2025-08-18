/**
 * Configuración profesional de la API
 * Maneja diferentes entornos y fallbacks automáticamente
 */

// Configuración por defecto para desarrollo
const DEFAULT_API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3012',
    timeout: 10000,
    retries: 3
  },
  production: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.hatsusound.com',
    timeout: 15000,
    retries: 2
  },
  test: {
    baseUrl: 'http://localhost:3012',
    timeout: 5000,
    retries: 1
  }
};

// Obtener configuración del entorno actual
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return DEFAULT_API_CONFIG[env as keyof typeof DEFAULT_API_CONFIG] || DEFAULT_API_CONFIG.development;
};

// Configuración de la API
export const API_CONFIG = {
  // URL base de la API
  baseUrl: getCurrentConfig().baseUrl,
  
  // Timeout para requests
  timeout: getCurrentConfig().timeout,
  
  // Número de reintentos
  retries: getCurrentConfig().retries,
  
  // Endpoints
  endpoints: {
    health: '/api/health',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refresh: '/api/auth/refresh',
      logout: '/api/auth/logout'
    },
    user: {
      profile: '/api/user/profile',
      update: '/api/user/update'
    }
  },
  
  // Headers por defecto
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  // Si el endpoint ya es una URL completa, devolverla tal como está
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Si estamos en desarrollo y tenemos proxy configurado, usar URL relativa
  // pero asegurarnos de que siempre incluya /api para endpoints de API
  if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
    // Para endpoints de API, asegurar que siempre tengan /api
    if (endpoint.startsWith('/api/')) {
      return endpoint;
    }
    // Si no empieza con /api, añadirlo
    return `/api${endpoint}`;
  }
  
  // En otros casos, construir URL completa
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Función para obtener la URL del health check
export const getHealthCheckUrl = (): string => {
  return buildApiUrl(API_CONFIG.endpoints.health);
};

// Función para obtener la URL de autenticación
export const getAuthUrl = (action: keyof typeof API_CONFIG.endpoints.auth): string => {
  return buildApiUrl(API_CONFIG.endpoints.auth[action]);
};

// Función para obtener la URL de usuario
export const getUserUrl = (action: keyof typeof API_CONFIG.endpoints.user): string => {
  return buildApiUrl(API_CONFIG.endpoints.user[action]);
};

// Configuración de fetch con timeout
export const createFetchWithTimeout = (timeout: number = API_CONFIG.timeout) => {
  return async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };
};

// Función para reintentar requests fallidos
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit = {}, 
  retries: number = API_CONFIG.retries
): Promise<Response> => {
  try {
    return await createFetchWithTimeout()(url, options);
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.name === 'AbortError') {
      console.log(`🔄 Reintentando request (${retries} intentos restantes)...`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// Función para validar si la respuesta es JSON
export const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  return contentType ? contentType.includes('application/json') : false;
};

// Función para parsear respuesta de forma segura
export const safeJsonParse = async (response: Response): Promise<any> => {
  if (!isJsonResponse(response)) {
    const text = await response.text();
    throw new Error(`Respuesta no es JSON. Content-Type: ${response.headers.get('content-type')}. Contenido: ${text.substring(0, 200)}...`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    const text = await response.text();
    throw new Error(`Error parseando JSON: ${error}. Contenido: ${text.substring(0, 200)}...`);
  }
};

// Función para manejar errores de API de forma consistente
export const handleApiError = (error: any, context: string = 'API request'): never => {
  console.error(`❌ Error en ${context}:`, error);
  
  if (error instanceof Error) {
    throw new Error(`${context}: ${error.message}`);
  }
  
  throw new Error(`${context}: Error desconocido`);
};

export default API_CONFIG;
