// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      LOGOUT_ALL: '/auth/logout-all',
      PROFILE: '/auth/profile',
    },
    USERS: {
      PROFILE: '/users/profile',
      ADMIN_ONLY: '/users/admin-only',
      MODERATOR_OR_ADMIN: '/users/moderator-or-admin',
    },
  },
  
  // Request configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Token configuration
  TOKEN: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    STORAGE_KEYS: {
      ACCESS_TOKEN: 'access_token',
      REFRESH_TOKEN: 'refresh_token',
      TOKENS_EXPIRES_IN: 'tokens_expires_in',
      USER: 'user',
    },
  },
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get storage key
export const getStorageKey = (key: keyof typeof API_CONFIG.TOKEN.STORAGE_KEYS): string => {
  return API_CONFIG.TOKEN.STORAGE_KEYS[key];
};

export default API_CONFIG;
