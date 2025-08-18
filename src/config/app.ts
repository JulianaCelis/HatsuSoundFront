// App Configuration
export const APP_CONFIG = {
  // Puerto de la aplicación
  PORT: process.env.PORT || 3000,
  
  // Host de la aplicación
  HOST: process.env.HOST || 'localhost',
  
  // URL base de la aplicación
  BASE_URL: process.env.REACT_APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  
  // Configuración de debug
  DEBUG: {
    SHOW_DEBUG: process.env.REACT_APP_SHOW_DEBUG === 'true',
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  },
  
  // Configuración de la API
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  
  // Configuración de la aplicación
  APP: {
    NAME: 'HatsuSound',
    VERSION: '1.0.0',
    DESCRIPTION: 'Plataforma de música premium',
  },
  
  // Configuración de features
  FEATURES: {
    SECRET_MODAL: true,
    DEBUG_MODE: process.env.REACT_APP_SHOW_DEBUG === 'true',
    HEART_CLICK_THRESHOLD: 5,
  },
} as const;

// Helper function to get full app URL
export const getAppUrl = (): string => {
  return APP_CONFIG.BASE_URL;
};

// Helper function to get API URL
export const getApiUrl = (): string => {
  return APP_CONFIG.API.BASE_URL;
};

// Helper function to check if debug is enabled
export const isDebugEnabled = (): boolean => {
  return APP_CONFIG.DEBUG.SHOW_DEBUG;
};

// Helper function to get current environment
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

export default APP_CONFIG;
