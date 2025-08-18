import { ErrorResponse } from '../types/error-response.model';

// Servicio de autenticación simulado para pruebas
export class MockAuthService {
  
  static async login(email: string, password: string): Promise<any> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular credenciales inválidas (exactamente como lo haría el backend)
    if (email === 'test@test.com' && password === 'wrongpassword') {
      const errorResponse: ErrorResponse = {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/auth/login',
        method: 'POST'
      };
      
      throw errorResponse;
    }
    
    // Simular login exitoso
    return {
      user: { email, id: '123' },
      token: 'mock-jwt-token'
    };
  }
  
  static async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular email ya existente
    if (userData.email === 'existing@test.com') {
      const errorResponse: ErrorResponse = {
        statusCode: 409,
        message: 'El email ya está registrado',
        error: 'Conflict',
        timestamp: new Date().toISOString(),
        path: '/auth/register',
        method: 'POST'
      };
      
      throw errorResponse;
    }
    
    return {
      user: { ...userData, id: '456' },
      message: 'Usuario registrado exitosamente'
    };
  }
  
  static async testConnectionError(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular error de conexión
    throw new Error('fetch is not defined');
  }
  
  static async testValidationError(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular error de validación
    const errorResponse: ErrorResponse = {
      statusCode: 400,
      message: 'email must be an email; password must be longer than or equal to 6 characters',
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: '/auth/register',
      method: 'POST'
    };
    
    throw errorResponse;
  }
}

