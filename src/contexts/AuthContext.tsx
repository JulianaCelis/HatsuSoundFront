import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import { createUserFriendlyError } from '../utils/errorHandler';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Action Types
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_TOKENS'; payload: AuthTokens };

// Initial State
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_TOKENS':
      return {
        ...state,
        tokens: action.payload,
      };
    default:
      return state;
  }
};

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API Base URL
  const API_BASE_URL = 'http://localhost:3000';

  // Utility function to make API calls
  const apiCall = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth header if token exists
    if (state.tokens?.access_token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${state.tokens.access_token}`,
      };
    }

    return fetch(url, defaultOptions);
  };

  // Check if token is expired
  const isTokenExpired = (): boolean => {
    if (!state.tokens?.expires_in) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= state.tokens.expires_in;
  };

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<void> => {
    if (!state.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: state.tokens.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokens: AuthTokens = await response.json();
      
      // Update tokens in state and localStorage
      dispatch({ type: 'UPDATE_TOKENS', payload: newTokens });
      localStorage.setItem('access_token', newTokens.access_token);
      localStorage.setItem('refresh_token', newTokens.refresh_token);
      localStorage.setItem('tokens_expires_in', newTokens.expires_in.toString());
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  }, [state.tokens?.refresh_token]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Login failed' };
        }
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('tokens_expires_in', data.expires_in.toString());
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.user, tokens: data },
      });

    } catch (error) {
      const userFriendlyError = createUserFriendlyError(error);
      dispatch({ type: 'AUTH_FAILURE', payload: userFriendlyError.userInfo.userMessage });
      throw userFriendlyError;
    }
  }, []);

  // Create a ref to the login function to avoid circular dependency
  const loginRef = useRef(login);
  loginRef.current = login;

  // Register function
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Registration failed' };
        }
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();

      // After successful registration, automatically login
      await login({
        emailOrUsername: data.email,
        password: data.password,
      });

    } catch (error) {
      const userFriendlyError = createUserFriendlyError(error);
      dispatch({ type: 'AUTH_FAILURE', payload: userFriendlyError.userInfo.userMessage });
      throw userFriendlyError;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Only try to revoke token if we have one
      if (state.tokens?.refresh_token) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({
            refresh_token: state.tokens.refresh_token,
          }),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear localStorage and state regardless of API call result
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('tokens_expires_in');
      localStorage.removeItem('user');
      
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [state.tokens?.refresh_token]);

  // Logout all sessions
  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await apiCall('/auth/logout-all', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout all sessions failed:', error);
    } finally {
      // Clear localStorage and state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('tokens_expires_in');
      localStorage.removeItem('user');
      
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Update user
  const updateUser = useCallback((user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshTokenValue = localStorage.getItem('refresh_token');
        const userStr = localStorage.getItem('user');
        const expiresIn = localStorage.getItem('tokens_expires_in');

        if (accessToken && refreshTokenValue && userStr && expiresIn) {
          const user = JSON.parse(userStr);
          const tokens: AuthTokens = {
            access_token: accessToken,
            refresh_token: refreshTokenValue,
            token_type: 'Bearer',
            expires_in: parseInt(expiresIn),
          };

          // Check if token is expired
          if (isTokenExpired()) {
            // Try to refresh token
            try {
              await refreshToken();
            } catch (error) {
              // If refresh fails, clear everything
              await logout();
            }
          } else {
            // Token is still valid
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, tokens },
            });
          }
        } else {
          // No tokens found, user is not authenticated
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Don't call logout here to avoid infinite loop
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, [refreshToken, logout]);

  // Ensure loading state is properly managed
  useEffect(() => {
    // If we're not loading anymore and not authenticated, ensure loading is false
    if (!state.isAuthenticated && state.isLoading) {
      // Small delay to ensure all initialization is complete
      const timer = setTimeout(() => {
        if (!state.isAuthenticated && state.isLoading) {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [state.isAuthenticated, state.isLoading]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!state.tokens?.expires_in || !state.isAuthenticated) return;

    const timeUntilExpiry = (state.tokens.expires_in * 1000) - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0); // Refresh 5 minutes before expiry

    const refreshTimer = setTimeout(() => {
      refreshToken().catch(console.error);
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [state.tokens?.expires_in, state.isAuthenticated, refreshToken]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    refreshToken,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
