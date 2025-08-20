import React from 'react';
import { useError } from '../../../contexts/ErrorContext';

const ErrorTestComponent: React.FC = () => {
  const { setError } = useError();

  const testLoginError = () => {
    // Simular el error exacto que envía el backend
    setError({
      statusCode: 401,
      message: 'Credenciales inválidas',
      error: 'Unauthorized',
      timestamp: new Date().toISOString(),
      path: '/auth/login',
      method: 'POST'
    });
  };

  const testGeneric401Error = () => {
    // Simular un error 401 genérico (sin mensaje específico)
    setError({
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: new Date().toISOString(),
      path: '/auth/profile',
      method: 'GET'
    });
  };

  const testConnectionError = () => {
    // Simular error de conexión
    setError({
      statusCode: 500,
      message: 'Error de conexión con el servidor. Verifica tu conexión a internet.',
      error: 'Network Error',
      timestamp: new Date().toISOString(),
      path: '/auth/login',
      method: 'POST'
    });
  };

  const testValidationError = () => {
    setError({
      statusCode: 400,
      message: 'email must be an email; password must be longer than or equal to 6 characters',
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: '/auth/register',
      method: 'POST'
    });
  };

  const testRateLimitError = () => {
    setError({
      statusCode: 429,
      message: 'Has excedido el límite de 100 requests por 15 minutos',
      error: 'Too Many Requests',
      timestamp: new Date().toISOString(),
      path: '/auth/login',
      method: 'POST',
      details: {
        limit: 100,
        windowMs: 900000,
        retryAfter: 300
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pruebas del Sistema de Errores</h2>
      
      <div className="space-y-3">
        <button
          onClick={testLoginError}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          🔑 Error de Login (401) - "Credenciales inválidas"
        </button>
        
        <button
          onClick={testGeneric401Error}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          ⚠️ Error 401 Genérico - Mensaje por defecto
        </button>
        
        <button
          onClick={testConnectionError}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          🌐 Error de Conexión (500) - "Error de conexión con el servidor"
        </button>
        
        <button
          onClick={testValidationError}
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          📝 Error de Validación (400) - Mensaje del backend
        </button>
        
        <button
          onClick={testRateLimitError}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ⏱️ Rate Limiting (429) - Con reintento automático
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">🎯 Resultados Esperados:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Login:</strong> "Credenciales inválidas" (mensaje del backend)</li>
          <li>• <strong>401 Genérico:</strong> "Credenciales inválidas. Verifica tu correo y contraseña." (por defecto)</li>
          <li>• <strong>Conexión:</strong> "Error de conexión con el servidor. Verifica tu conexión a internet."</li>
          <li>• <strong>Validación:</strong> Mensaje completo del backend</li>
          <li>• <strong>Rate Limit:</strong> Con información de reintento</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorTestComponent;
