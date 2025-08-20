export const environment = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3012',
    audioProductsEndpoint: '/api/audio-products',
    timeout: 30000, // 30 seconds
  },
  
  // Feature Flags
  features: {
    enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true' || true,
    enableRealTimeUpdates: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES === 'true' || false,
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true' || false,
  },
  
  // App Configuration
  app: {
    name: 'HatsuSound',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debugMode: process.env.NODE_ENV === 'development',
  },
  
  // Pagination Defaults
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  // Search Configuration
  search: {
    minQueryLength: 2,
    debounceDelay: 300, // milliseconds
    maxResults: 1000,
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4facfe',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
    },
    animations: {
      duration: 300, // milliseconds
      easing: 'ease-in-out',
    },
  },
};

export default environment;
