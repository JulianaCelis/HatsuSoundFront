import React, { useState } from 'react';
import { useError } from '../contexts/ErrorContext';
import { useApiError } from '../hooks/useApiError';
import { MockAuthService } from '../services/mock-auth.service';

const DebugErrorComponent: React.FC = () => {
  const { error, setError } = useError();
  const { createApiCall } = useApiError();
  const [debugInfo, setDebugInfo] = useState<string>('');

  const testBackendError = () => {
    setDebugInfo('Simulando error del backend...');
    
    // Simular exactamente el error que envía el backend
    const backendError = {
      statusCode: 401,
      message: 'Credenciales inválidas',
      error: 'Unauthorized',
      timestamp: new Date().toISOString(),
      path: '/auth/login',
      method: 'POST'
    };
    
    setDebugInfo(`Error del backend: ${JSON.stringify(backendError, null, 2)}`);
    setError(backendError);
  };

  const testApiCall = async () => {
    setDebugInfo('Probando llamada API con credenciales inválidas...');
    
    try {
      const loginCall = createApiCall(
        () => MockAuthService.login('test@test.com', 'wrongpassword'),
        (data) => {
          setDebugInfo('Login exitoso (no debería pasar)');
        },
        (error) => {
          setDebugInfo(`Error capturado en callback: ${JSON.stringify(error, null, 2)}`);
        }
      );

      await loginCall();
    } catch (error: any) {
      setDebugInfo(`Error capturado en catch: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">🔍 Debug del Sistema de Errores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Pruebas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🧪 Pruebas</h3>
          
          <button
            onClick={testBackendError}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🔑 Simular Error del Backend (401)
          </button>
          
          <button
            onClick={testApiCall}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            🌐 Probar Llamada API Simulada
          </button>
          
          <button
            onClick={async () => {
              setDebugInfo('Probando error de conexión...');
              try {
                const loginCall = createApiCall(
                  () => MockAuthService.testConnectionError(),
                  () => {},
                  (error) => setDebugInfo(`Error de conexión: ${JSON.stringify(error, null, 2)}`)
                );
                await loginCall();
              } catch (error: any) {
                setDebugInfo(`Error de conexión capturado: ${JSON.stringify(error, null, 2)}`);
              }
            }}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            🌐 Probar Error de Conexión
          </button>
          
          <button
            onClick={clearDebug}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            🗑️ Limpiar Debug
          </button>
        </div>
        
        {/* Panel de Información */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📊 Estado Actual</h3>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-medium mb-2">Error en Contexto:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
              {error ? JSON.stringify(error, null, 2) : 'No hay error'}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-medium mb-2">Mensaje Mostrado:</h4>
            <div className="bg-white p-2 rounded border min-h-[2rem]">
              {error?.message || 'No hay mensaje'}
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="font-medium mb-2">Título del Error:</h4>
            <div className="bg-white p-2 rounded border min-h-[2rem]">
              {error ? `Error ${error.statusCode}: ${error.error}` : 'No hay título'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Información de Debug */}
      {debugInfo && (
        <div className="mt-6 bg-yellow-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">🐛 Información de Debug:</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-40">
            {debugInfo}
          </pre>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold mb-2">📋 Instrucciones:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Haz clic en "Simular Error del Backend" para ver el mensaje exacto</li>
          <li>Haz clic en "Probar Llamada API Real" para simular un login fallido</li>
          <li>Observa que el mensaje debe ser "Credenciales inválidas" (no genérico)</li>
          <li>Si sigue mostrando mensaje genérico, hay un problema en el flujo</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugErrorComponent;
