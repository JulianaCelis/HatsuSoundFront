import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createUserFriendlyError } from '../utils/errorHandler';

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// API Error
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Request options
export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
}

// Hook for making API calls
export const useApi = () => {
  const { tokens, refreshToken, logout } = useAuth();
  const API_BASE_URL = 'http://localhost:3000';

  // Make API call with automatic token handling
  const apiCall = useCallback(async <T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      skipAuth = false,
      retryCount = 0,
      headers = {},
      ...requestOptions
    } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add custom headers if provided
    if (headers) {
      if (Array.isArray(headers)) {
        // Handle array of [key, value] pairs
        headers.forEach(([key, value]) => {
          if (key && value) {
            requestHeaders[key] = value;
          }
        });
      } else if (typeof headers === 'object') {
        // Handle object with string keys
        Object.entries(headers).forEach(([key, value]) => {
          if (key && value) {
            requestHeaders[key] = value;
          }
        });
      }
    }

    // Add auth header if not skipped and token exists
    if (!skipAuth && tokens?.access_token) {
      requestHeaders.Authorization = `Bearer ${tokens.access_token}`;
    }

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers: requestHeaders,
      });

      // Handle different response statuses
      if (response.ok) {
        const data = await response.json();
        return {
          data,
          status: response.status,
          success: true,
        };
      }

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401 && !skipAuth && retryCount === 0) {
        try {
          // Try to refresh token
          await refreshToken();
          
          // Retry the request once with new token
          return apiCall(endpoint, { ...options, retryCount: retryCount + 1 });
        } catch (refreshError) {
          // Refresh failed, logout user
          await logout();
          throw {
            message: 'Session expired. Please login again.',
            status: 401,
          } as ApiError;
        }
      }

      // Handle other error statuses
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, it might be an HTML response
        const textResponse = await response.text();
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          errorData = { 
            message: `Server returned HTML instead of JSON: ${textResponse.substring(0, 100)}...`,
            status: response.status 
          };
        } else {
          errorData = { message: 'An error occurred' };
        }
      }

      const error: ApiError = {
        message: errorData.message || `HTTP ${response.status}`,
        status: response.status,
        errors: errorData.errors,
      };

      throw createUserFriendlyError(error);

    } catch (error) {
      // Re-throw API errors
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }

      // Handle network or other errors
      const networkError = {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      } as ApiError;
      
      throw createUserFriendlyError(networkError);
    }
  }, [tokens, refreshToken, logout]);

  // Convenience methods for common HTTP methods
  const get = useCallback(<T = any>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(endpoint, { ...options, method: 'GET' });
  }, [apiCall]);

  const post = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiCall]);

  const put = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiCall]);

  const patch = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [apiCall]);

  const del = useCallback(<T = any>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(endpoint, { ...options, method: 'DELETE' });
  }, [apiCall]);

  return {
    apiCall,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};

export default useApi;
