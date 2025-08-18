import React, { useState } from 'react';
import './SecretModal.css';
import { APP_CONFIG } from '../../config/app';

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
    
    try {
      // Probar conexión con el backend
      const response = await fetch('/api/health', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(`✅ Conexión exitosa con el backend!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResults(`❌ Error de conexión con el backend\nStatus: ${response.status}\nStatusText: ${response.statusText}`);
      }
    } catch (error) {
      setTestResults(`❌ No se pudo conectar con el backend\nError: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAuthEndpoint = async () => {
    setIsLoading(true);
    setTestResults('');
    
    try {
      // Probar endpoint de autenticación
      const response = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      });
      
      if (response.status === 401) {
        setTestResults(`✅ Endpoint de auth funciona correctamente!\nStatus: ${response.status}\nMensaje: Credenciales inválidas (esperado para credenciales de prueba)`);
      } else {
        setTestResults(`⚠️ Respuesta inesperada del endpoint de auth\nStatus: ${response.status}\nStatusText: ${response.statusText}`);
      }
    } catch (error) {
      setTestResults(`❌ Error al probar endpoint de auth\nError: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowEnvironmentInfo = () => {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_SHOW_DEBUG: process.env.REACT_APP_SHOW_DEBUG,
      PORT: process.env.PORT || 'No configurado',
      HOST: process.env.HOST || 'No configurado',
      'User Agent': navigator.userAgent,
      'Platform': navigator.platform,
      'Language': navigator.language,
      'Cookies Enabled': navigator.cookieEnabled,
      'Online': navigator.onLine,
      'Timestamp': new Date().toISOString()
    };
    
    setTestResults(`🌍 Información del Entorno:\n${JSON.stringify(envInfo, null, 2)}`);
  };

  const handleResetCounter = () => {
    // Resetear el contador del corazón
    window.location.reload();
  };

  const handleClearResults = () => {
    setTestResults('');
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
