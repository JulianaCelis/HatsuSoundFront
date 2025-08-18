import React, { useState } from 'react';
import './SecretModal.css';
import { APP_CONFIG } from '../../config/app';
import { 
  getHealthCheckUrl, 
  getAuthUrl, 
  fetchWithRetry, 
  isJsonResponse, 
  safeJsonParse,
  handleApiError,
  API_CONFIG
} from '../../config/api';

interface SecretModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecretModal: React.FC<SecretModalProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResults('');
    
    console.log('🚀 INICIANDO PRUEBA DE CONEXIÓN BACKEND');
    console.log('📍 Ubicación actual:', window.location.href);
    console.log('🌐 Origen actual:', window.location.origin);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    
    // Usar la configuración profesional de API
    const healthUrl = getHealthCheckUrl();
    console.log('📡 URL de health check configurada:', healthUrl);
    console.log('🔗 URL completa:', healthUrl);
    console.log('🔧 Endpoint configurado:', API_CONFIG.endpoints.health);
    console.log('🌐 Base URL configurada:', API_CONFIG.baseUrl);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    
    try {
      console.log('⏳ Enviando request a:', healthUrl);
      console.log('🔍 Verificando que la URL contenga /api/health:', healthUrl.includes('/api/health'));
      
      // Verificar que la URL sea correcta
      if (!healthUrl.includes('/api/health')) {
        console.warn('⚠️ ADVERTENCIA: La URL del health check no contiene /api/health');
        console.warn('🔧 URL actual:', healthUrl);
        console.warn('🔧 Endpoint esperado:', API_CONFIG.endpoints.health);
      }
      
      // Usar fetch con retry y timeout
      const response = await fetchWithRetry(healthUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('📥 Respuesta recibida:', response);
      console.log('📊 Status:', response.status);
      console.log('📋 StatusText:', response.statusText);
      console.log('🔗 URL final:', response.url);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
      
      // Verificar si la respuesta es JSON usando la función profesional
      const contentType = response.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);
      
      // CASO 1: Es HTML (página de error, 404, etc.)
      if (contentType && contentType.includes('text/html')) {
        const htmlContent = await response.text();
        console.log('📝 Contenido HTML recibido:', htmlContent.substring(0, 200));
        
        setTestResults(`❌ PÁGINA HTML RECIBIDA - NO ES JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Contenido HTML: ${htmlContent.substring(0, 200)}...\n\n💡 El servidor está devolviendo una página HTML de error en lugar de JSON. Posible:\n• Ruta /api/health no existe\n• Backend no está corriendo\n• Proxy mal configurado\n• Servidor devuelve HTML para rutas inexistentes`);
        
        // No continuar con más pruebas aquí
        setIsLoading(false);
        console.log('🏁 PRUEBA DE CONEXIÓN COMPLETADA - HTML detectado');
        return;
      }
      
      // CASO 2: Es JSON válido
      if (isJsonResponse(response)) {
        if (response.ok) {
          try {
            // Usar la función profesional de parseo seguro
            const data = await safeJsonParse(response);
            console.log('✅ JSON parseado exitosamente:', data);
            setTestResults(`✅ CONEXIÓN EXITOSA CON BACKEND\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Data: ${JSON.stringify(data, null, 2)}`);
          } catch (jsonError) {
            console.log('⚠️ Error parseando JSON:', jsonError);
            const textData = await response.text();
            console.log('📝 Contenido como texto:', textData.substring(0, 200));
            setTestResults(`⚠️ ERROR PARSEANDO JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Error JSON: ${jsonError}\n- Contenido: ${textData.substring(0, 200)}...\n\n💡 El backend responde con Content-Type JSON pero el contenido no es JSON válido`);
          }
        } else {
          // JSON pero con error HTTP
          try {
            const errorData = await safeJsonParse(response);
            console.log('❌ Error HTTP con JSON:', errorData);
            setTestResults(`❌ ERROR HTTP CON JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Error Data: ${JSON.stringify(errorData, null, 2)}`);
          } catch (jsonError) {
            const errorText = await response.text();
            console.log('❌ Error HTTP, JSON inválido:', errorText.substring(0, 200));
            setTestResults(`❌ ERROR HTTP CON JSON INVÁLIDO\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Error JSON: ${jsonError}\n- Contenido: ${errorText.substring(0, 200)}...`);
          }
        }
      }
      
      // CASO 3: No es JSON ni HTML (texto plano, etc.)
      else {
        const textContent = await response.text();
        console.log('📝 Contenido no-JSON recibido:', textContent.substring(0, 200));
        
        if (response.ok) {
          setTestResults(`⚠️ RESPUESTA EXITOSA PERO NO ES JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Contenido: ${textContent.substring(0, 200)}...\n\n💡 El servidor responde exitosamente pero no con JSON. Posible:\n• Backend configurado para devolver texto plano\n• Content-Type mal configurado\n• Respuesta personalizada del servidor`);
        } else {
          setTestResults(`❌ ERROR HTTP - NO ES JSON NI HTML\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Contenido: ${textContent.substring(0, 200)}...\n\n💡 El servidor responde con error pero no es JSON ni HTML`);
        }
      }
      
    } catch (error) {
      console.log('💥 ERROR DE RED/CORS:', error);
      console.log('🔍 Tipo de error:', error?.constructor?.name);
      console.log('📝 Mensaje:', error instanceof Error ? error.message : 'Error desconocido');
      
      // Probar con URL absoluta como fallback
      const fallbackUrl = 'http://localhost:3012/api/health';
      console.log('🔄 Probando URL absoluta como fallback:', fallbackUrl);
      
      try {
        console.log('⏳ Enviando request a URL absoluta:', fallbackUrl);
        const fallbackResponse = await fetchWithRetry(fallbackUrl, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('📥 Respuesta fallback:', fallbackResponse);
        console.log('📊 Status fallback:', fallbackResponse.status);
        
        if (fallbackResponse.ok) {
          const fallbackData = await safeJsonParse(fallbackResponse);
          console.log('✅ Fallback exitoso:', fallbackData);
          setTestResults(`⚠️ URL RELATIVA FALLÓ, PERO URL ABSOLUTA FUNCIONA\n\n📊 Detalles:\n- URL relativa: ${healthUrl} ❌\n- URL absoluta: ${fallbackUrl} ✅\n- Status: ${fallbackResponse.status}\n- Data: ${JSON.stringify(fallbackData, null, 2)}\n\n💡 PROBLEMA IDENTIFICADO:\n• URL relativa falla (posible proxy mal configurado)\n• URL absoluta funciona (backend está corriendo)\n• Solución: Configurar proxy correctamente o usar URLs absolutas`);
        } else {
          const fallbackErrorText = await fallbackResponse.text();
          console.log('❌ Fallback también falló:', fallbackErrorText.substring(0, 200));
          setTestResults(`❌ AMBAS URLs FALLARON\n\n📊 Detalles:\n- URL relativa: ${healthUrl} ❌\n- URL absoluta: ${fallbackUrl} ❌\n- Error relativa: ${error instanceof Error ? error.message : 'Error desconocido'}\n- Error absoluta: ${fallbackResponse.status} ${fallbackResponse.statusText}\n\n💡 DIAGNÓSTICO:\n• URL relativa: Error de red/CORS\n• URL absoluta: Error HTTP\n• Backend puede estar corriendo pero con problemas\n• Verificar si el backend está realmente activo`);
        }
      } catch (fallbackError) {
        console.log('💥 Error en fallback también:', fallbackError);
        setTestResults(`❌ NO SE PUDO CONECTAR CON EL BACKEND\n\n📊 Detalles:\n- URL relativa: ${healthUrl} ❌\n- URL absoluta: ${fallbackUrl} ❌\n- Error relativa: ${error instanceof Error ? error.message : 'Error desconocido'}\n- Error absoluta: ${fallbackError instanceof Error ? fallbackError.message : 'Error desconocido'}\n\n💡 DIAGNÓSTICO FINAL:\n• Backend NO está corriendo\n• Problema de red o firewall\n• Puerto 3012 bloqueado\n• Backend en puerto diferente\n\n🔧 SOLUCIONES:\n1. Verificar que el backend esté corriendo\n2. Verificar el puerto correcto\n3. Verificar firewall/antivirus\n4. Verificar que no haya otro proceso usando el puerto`);
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 PRUEBA DE CONEXIÓN COMPLETADA');
    }
  };

  const handleTestAuthEndpoint = async () => {
    setIsLoading(true);
    setTestResults('');
    
    console.log('🔐 INICIANDO PRUEBA DE ENDPOINT AUTH');
    console.log('📍 Ubicación actual:', window.location.href);
    console.log('🌐 Origen actual:', window.location.origin);
    
    // Usar la configuración profesional de API
    const authUrl = getAuthUrl('login');
    console.log('📡 Probando endpoint auth:', authUrl);
    console.log('🔗 URL completa:', authUrl);
    
    try {
      console.log('⏳ Enviando request POST a:', authUrl);
      console.log('📤 Datos de prueba:', { email: 'test@test.com', password: 'test123' });
      
      // Usar fetch con retry y timeout
      const response = await fetchWithRetry(authUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      });
      
      console.log('📥 Respuesta auth recibida:', response);
      console.log('📊 Status:', response.status);
      console.log('📋 StatusText:', response.statusText);
      console.log('🔗 URL final:', response.url);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
      
      // Verificar si la respuesta es JSON usando la función profesional
      const contentType = response.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);
      
      if (response.status === 401) {
        if (isJsonResponse(response)) {
          try {
            const responseData = await safeJsonParse(response);
            console.log('✅ Endpoint auth funciona correctamente (401 esperado):', responseData);
            setTestResults(`✅ Endpoint de auth funciona correctamente!\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Mensaje: Credenciales inválidas (esperado para credenciales de prueba)\n- Data: ${JSON.stringify(responseData, null, 2)}\n- Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
          } catch (jsonError) {
            console.log('⚠️ Error parseando JSON en auth:', jsonError);
            const responseText = await response.text();
            console.log('📝 Contenido como texto:', responseText.substring(0, 200));
            setTestResults(`✅ Endpoint auth funciona pero error parseando JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Error JSON: ${jsonError}\n- Contenido: ${responseText.substring(0, 200)}...`);
          }
        } else {
          // Respuesta 401 pero no es JSON
          const responseText = await response.text();
          console.log('⚠️ Respuesta 401 pero no es JSON:', responseText.substring(0, 200));
          setTestResults(`⚠️ Endpoint auth responde 401 pero no es JSON\n\n📊 Detalles:\n- Status: ${response.status}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Contenido: ${responseText.substring(0, 200)}...\n\n💡 El endpoint responde pero no con JSON válido`);
        }
      } else {
        console.log('⚠️ Respuesta inesperada del endpoint auth:', response.status);
        
        if (isJsonResponse(response)) {
          try {
            const responseData = await safeJsonParse(response);
            console.log('📝 Datos de respuesta JSON:', responseData);
            setTestResults(`⚠️ Respuesta inesperada del endpoint de auth\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Data: ${JSON.stringify(responseData, null, 2)}`);
          } catch (jsonError) {
            const responseText = await response.text();
            console.log('📝 Error parseando JSON:', jsonError);
            console.log('📝 Contenido como texto:', responseText.substring(0, 200));
            setTestResults(`⚠️ Respuesta inesperada del endpoint de auth\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Error JSON: ${jsonError}\n- Contenido: ${responseText.substring(0, 200)}...`);
          }
        } else {
          // Respuesta no es JSON
          const responseText = await response.text();
          console.log('📝 Contenido no-JSON:', responseText.substring(0, 200));
          setTestResults(`⚠️ Respuesta inesperada del endpoint de auth\n\n📊 Detalles:\n- Status: ${response.status}\n- StatusText: ${response.statusText}\n- URL: ${response.url}\n- Content-Type: ${contentType}\n- Contenido: ${responseText.substring(0, 200)}...\n\n💡 El endpoint responde pero no con JSON válido`);
        }
      }
    } catch (error) {
      console.log('💥 Error al probar endpoint auth:', error);
      console.log('🔍 Tipo de error:', error?.constructor?.name);
      console.log('📝 Mensaje:', error instanceof Error ? error.message : 'Error desconocido');
      
      setTestResults(`❌ Error al probar endpoint de auth\n\n📊 Detalles:\n- URL: ${authUrl}\n- Error: ${error instanceof Error ? error.message : 'Error desconocido'}\n- Tipo: ${error?.constructor?.name || 'Desconocido'}\n\n💡 Posible problema de red, CORS o endpoint no disponible`);
    } finally {
      setIsLoading(false);
      console.log('🏁 PRUEBA DE ENDPOINT AUTH COMPLETADA');
    }
  };

  const handleShowEnvironmentInfo = () => {
    console.log('🌍 MOSTRANDO INFORMACIÓN DEL ENTORNO');
    
    const envInfo = {
      'NODE_ENV': process.env.NODE_ENV,
      'REACT_APP_API_URL': process.env.REACT_APP_API_URL,
      'REACT_APP_SHOW_DEBUG': process.env.REACT_APP_SHOW_DEBUG,
      'PORT': process.env.PORT || 'No configurado',
      'HOST': process.env.HOST || 'No configurado',
      'URL Actual': window.location.href,
      'Origen': window.location.origin,
      'Protocolo': window.location.protocol,
      'Host': window.location.host,
      'Puerto': window.location.port || '80/443 (por defecto)',
      'Pathname': window.location.pathname,
      'User Agent': navigator.userAgent,
      'Platform': navigator.platform,
      'Language': navigator.language,
      'Cookies Enabled': navigator.cookieEnabled,
      'Online': navigator.onLine,
      'Timestamp': new Date().toISOString(),
      'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Screen Resolution': `${screen.width}x${screen.height}`,
      'Viewport': `${window.innerWidth}x${window.innerHeight}`,
      'Local Storage': localStorage ? 'Disponible' : 'No disponible',
      'Session Storage': sessionStorage ? 'Disponible' : 'No disponible'
    };
    
    console.log('📊 Información del entorno:', envInfo);
    console.log('🔧 Variables de entorno disponibles:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    
    setTestResults(`🌍 Información del Entorno:\n\n📊 Detalles:\n${JSON.stringify(envInfo, null, 2)}\n\n🔧 Variables REACT_APP: ${Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')).join(', ') || 'Ninguna configurada'}`);
  };

  const handleResetCounter = () => {
    // Resetear el contador del corazón
    window.location.reload();
  };

  const handleClearResults = () => {
    setTestResults('');
  };

  const handleTestBasicConnectivity = async () => {
    setIsLoading(true);
    setTestResults('');
    
    console.log('🌐 INICIANDO PRUEBA DE CONECTIVIDAD BÁSICA');
    
    const testUrls = [
      { name: 'Google DNS', url: 'https://8.8.8.8', type: 'DNS' },
      { name: 'Cloudflare DNS', url: 'https://1.1.1.1', type: 'DNS' },
      { name: 'Google', url: 'https://www.google.com', type: 'HTTP' },
      { name: 'GitHub', url: 'https://api.github.com', type: 'API' }
    ];
    
    const results = [];
    
    for (const test of testUrls) {
      try {
        console.log(`⏳ Probando ${test.name}:`, test.url);
        const startTime = Date.now();
        
        const response = await fetch(test.url, { 
          method: 'GET',
          mode: 'no-cors', // Para evitar problemas de CORS
          cache: 'no-cache'
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        console.log(`✅ ${test.name} exitoso - Latencia: ${latency}ms`);
        results.push(`✅ ${test.name} (${test.type}): ${latency}ms`);
        
      } catch (error) {
        console.log(`❌ ${test.name} falló:`, error);
        results.push(`❌ ${test.name} (${test.type}): ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
    
    // Probar también conectividad local
    try {
      console.log('⏳ Probando localhost:3000 (frontend)');
      const localResponse = await fetch('http://localhost:3000', { 
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('✅ Frontend local accesible');
      results.push('✅ Frontend local (localhost:3000): Accesible');
    } catch (error) {
      console.log('❌ Frontend local no accesible:', error);
      results.push('❌ Frontend local (localhost:3000): No accesible');
    }
    
    try {
      console.log('⏳ Probando localhost:3012 (backend)');
      const backendResponse = await fetch('http://localhost:3012/api/health', { 
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('✅ Backend local accesible');
      results.push('✅ Backend local (localhost:3012): Accesible');
    } catch (error) {
      console.log('❌ Backend local no accesible:', error);
      results.push('❌ Backend local (localhost:3012): No accesible');
    }
    
    console.log('🏁 PRUEBA DE CONECTIVIDAD COMPLETADA');
    setTestResults(`🌐 Prueba de Conectividad Básica:\n\n📊 Resultados:\n${results.join('\n')}\n\n💡 Si el DNS funciona pero el backend no, es un problema de red local o CORS`);
    setIsLoading(false);
  };

  const handleTestApiHealth = async () => {
    setIsLoading(true);
    setTestResults('');
    
    console.log('🔍 INICIANDO PRUEBA ESPECÍFICA DE /api/health');
    console.log('📍 Ubicación actual:', window.location.href);
    console.log('🌐 Origen actual:', window.location.origin);
    
    // Probar diferentes variaciones de la URL
    const testUrls = [
      { name: 'URL Relativa /api/health', url: '/api/health' },
      { name: 'URL Relativa api/health', url: 'api/health' },
      { name: 'URL Completa localhost:3012/api/health', url: 'http://localhost:3012/api/health' },
      { name: 'URL Completa con origen /api/health', url: `${window.location.origin}/api/health` }
    ];
    
    const results = [];
    
    for (const test of testUrls) {
      try {
        console.log(`⏳ Probando ${test.name}:`, test.url);
        const startTime = Date.now();
        
        const response = await fetch(test.url, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        console.log(`✅ ${test.name} exitoso - Status: ${response.status}, Latencia: ${latency}ms`);
        
        if (response.ok) {
          try {
            const data = await response.json();
            results.push(`✅ ${test.name}: ${response.status} OK - ${latency}ms - ${JSON.stringify(data)}`);
          } catch (jsonError) {
            const textData = await response.text();
            results.push(`✅ ${test.name}: ${response.status} OK - ${latency}ms - Texto: ${textData.substring(0, 100)}...`);
          }
        } else {
          const errorText = await response.text();
          results.push(`⚠️ ${test.name}: ${response.status} ${response.statusText} - ${latency}ms - ${errorText.substring(0, 100)}...`);
        }
        
      } catch (error) {
        console.log(`❌ ${test.name} falló:`, error);
        results.push(`❌ ${test.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
    
    console.log('🏁 PRUEBA ESPECÍFICA DE /api/health COMPLETADA');
    setTestResults(`🔍 Prueba Específica de /api/health:\n\n📊 Resultados:\n${results.join('\n')}\n\n💡 Esta prueba verifica diferentes variaciones de la URL /api/health para identificar problemas de configuración`);
    setIsLoading(false);
  };

  return (
    <div className="secret-modal-overlay" onClick={onClose}>
      <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
        <div className="secret-modal-header">
          <h2 className="secret-modal-title">🔒 Panel de Control Secreto</h2>
          <button className="secret-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="secret-modal-content">
          <div className="secret-info">
            <p className="secret-message">
              🎉 ¡Felicidades! Has descubierto el panel secreto después de {APP_CONFIG.FEATURES.HEART_CLICK_THRESHOLD} clics en el corazón.
            </p>
            <div className="secret-stats">
              <div className="stat-item">
                <span className="stat-label">Clics en corazón:</span>
                <span className="stat-value">5+</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Nivel de paciencia:</span>
                <span className="stat-value">Máximo</span>
              </div>
            </div>
          </div>
          
          <div className="secret-actions">
            <button 
              className="secret-action-btn test-connection"
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Probando...' : '🌐 Probar Conexión Backend'}
            </button>
            
            <button 
              className="secret-action-btn test-auth"
              onClick={handleTestAuthEndpoint}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Probando...' : '🔐 Probar Endpoint Auth'}
            </button>
            
            <button 
              className="secret-action-btn env-info"
              onClick={handleShowEnvironmentInfo}
            >
              🌍 Info del Entorno
            </button>
            
            <button 
              className="secret-action-btn reset-counter"
              onClick={handleResetCounter}
            >
              🔄 Reiniciar Contador
            </button>

            <button 
              className="secret-action-btn basic-connectivity"
              onClick={handleTestBasicConnectivity}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Probando...' : '🌐 Probar Conectividad Básica'}
            </button>

            <button 
              className="secret-action-btn api-health"
              onClick={handleTestApiHealth}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Probando...' : '🔍 Probar /api/health'}
            </button>
          </div>

          {testResults && (
            <div className="test-results">
              <div className="results-header">
                <h3>📊 Resultados de las Pruebas</h3>
                <button 
                  className="clear-results-btn"
                  onClick={handleClearResults}
                >
                  🗑️ Limpiar
                </button>
              </div>
              <pre className="results-content">{testResults}</pre>
            </div>
          )}
          
          <div className="secret-footer">
            <p className="secret-note">
              💡 Este panel solo es visible para usuarios que han hecho clic {APP_CONFIG.FEATURES.HEART_CLICK_THRESHOLD} veces en el corazón.
              <br />
              ¡Mantén la curiosidad y sigue explorando!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretModal;
