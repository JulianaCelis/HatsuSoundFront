import { ErrorResponse } from '../types/error-response.model';

// Simulación de llamadas API para demostrar el manejo de errores
export class AuthService {
  private static baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  static async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // El error ya viene en formato estructurado desde el backend
        const errorData = await response.json();
        throw errorData; // Esto será capturado por el useApiError hook
      }

      return response.json();
    } catch (fetchError) {
      // Si es un error de fetch (conexión), crear un error estructurado
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw {
          statusCode: 500,
          message: 'Error de conexión con el servidor. Verifica tu conexión a internet.',
          error: 'Network Error',
          timestamp: new Date().toISOString(),
          path: '/auth/login',
          method: 'POST'
        };
      }
      // Re-lanzar otros errores
      throw fetchError;
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch (fetchError) {
      // Si es un error de fetch (conexión), crear un error estructurado
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw {
          statusCode: 500,
          message: 'Error de conexión con el servidor. Verifica tu conexión a internet.',
          error: 'Network Error',
          timestamp: new Date().toISOString(),
          path: '/auth/register',
          method: 'POST'
        };
      }
      // Re-lanzar otros errores
      throw fetchError;
    }
  }

  static async getProfile(): Promise<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw {
        statusCode: 401,
        message: 'Token no encontrado',
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/auth/profile',
        method: 'GET'
      };
    }

    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('token');
    // Simular llamada al backend
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).catch(() => {
      // Ignorar errores en logout
    });
  }
}
