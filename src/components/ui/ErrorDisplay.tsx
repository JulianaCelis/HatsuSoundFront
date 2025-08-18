import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  suggestion?: string;
  isRetryable?: boolean;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  suggestion,
  isRetryable = false,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`error-display ${className}`}>
      <div className="error-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      <div className="error-content">
        <div className="error-message">{error}</div>
        
        {suggestion && (
          <div className="error-suggestion">{suggestion}</div>
        )}
        
        {isRetryable && onRetry && (
          <button 
            className="error-retry-btn"
            onClick={onRetry}
            type="button"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
