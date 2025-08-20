import React from 'react';
import { useError } from '../../../contexts/ErrorContext';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import '../../../styles/ErrorNotification.css';

const ErrorNotification: React.FC = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className={`error-notification error-${error.statusCode}`}>
      <div className="error-header">
        <span className="error-icon">⚠️</span>
        <span className="error-title">
          {ErrorHandlerService.getErrorTitle(error)}
        </span>
        <button className="close-btn" onClick={clearError}>
          ×
        </button>
      </div>
      <div className="error-message">
        {error.message || ErrorHandlerService.getErrorMessage(error)}
      </div>
      {error.details?.retryAfter && (
        <div className="retry-info">
          Puedes reintentar en {error.details.retryAfter} segundos
        </div>
      )}
    </div>
  );
};

export default ErrorNotification;
