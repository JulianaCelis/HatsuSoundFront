import React, { useState, useEffect, useRef } from 'react';
import './AuthModal.css';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from './Toast';
import { UserFriendlyError } from '../../utils/errorHandler';
import ErrorDisplay from './ErrorDisplay';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, isLoading: authLoading, error: authError, clearError } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{
    // Form field errors (always strings)
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
    // General error display
    general?: string;
    suggestion?: string;
    isRetryable?: boolean;
    // Index signature for dynamic access
    [key: string]: string | boolean | undefined;
  }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Helper function to clear all errors
  const clearAllErrors = () => {
    setErrors({
      firstName: undefined,
      lastName: undefined,
      username: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      acceptTerms: undefined,
      general: undefined,
      suggestion: undefined,
      isRetryable: undefined
    });
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      acceptTerms?: string;
    } = {};

    if (authMode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'El nombre es requerido';
      }
      
      if (!formData.lastName) {
        newErrors.lastName = 'El apellido es requerido';
      }

      if (!formData.username) {
        newErrors.username = 'El nombre de usuario es requerido';
      } else if (formData.username.length < 3) {
        newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      }
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();
    
    try {
      if (authMode === 'login') {
        await login({
          emailOrUsername: formData.email,
          password: formData.password,
        });
        
        showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
        onClose();
      } else {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        showSuccess('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');
        onClose();
      }
    } catch (error) {
      if (error instanceof UserFriendlyError) {
        const { userInfo } = error;
        showError(userInfo.title, userInfo.userMessage);
        setErrors({ 
          general: userInfo.userMessage,
          suggestion: userInfo.suggestion || undefined,
          isRetryable: userInfo.isRetryable
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error. Intenta de nuevo.';
        showError('Error de autenticación', errorMessage);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      firstName: '',
      lastName: '',
      acceptTerms: false
    });
    clearAllErrors();
    clearError();
  };

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      clearError();
      clearAllErrors();
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container" ref={modalRef}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="auth-modal-content">
          {/* Header */}
          <div className="auth-modal-header">
            <div className="auth-modal-logo">
              <div className="auth-modal-logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <h2 className="auth-modal-title">HatsuSound</h2>
            </div>
            <p className="auth-modal-subtitle">
              {authMode === 'login' 
                ? 'Inicia sesión para continuar' 
                : 'Únete a la comunidad musical'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
                         {authMode === 'register' && (
               <>
                 <div className="form-group">
                   <label htmlFor="firstName" className="form-label">
                     Nombre
                   </label>
                   <input
                     type="text"
                     id="firstName"
                     name="firstName"
                     value={formData.firstName}
                     onChange={handleInputChange}
                     className={`form-input ${errors.firstName ? 'error' : ''}`}
                     placeholder="Tu nombre"
                     autoComplete="given-name"
                   />
                   {errors.firstName && (
                     <span className="form-error">{errors.firstName}</span>
                   )}
                 </div>

                 <div className="form-group">
                   <label htmlFor="lastName" className="form-label">
                     Apellido
                   </label>
                   <input
                     type="text"
                     id="lastName"
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleInputChange}
                     className={`form-input ${errors.lastName ? 'error' : ''}`}
                     placeholder="Tu apellido"
                     autoComplete="family-name"
                   />
                   {errors.lastName && (
                     <span className="form-error">{errors.lastName}</span>
                   )}
                 </div>

                 <div className="form-group">
                   <label htmlFor="username" className="form-label">
                     Nombre de usuario
                   </label>
                   <input
                     type="text"
                     id="username"
                     name="username"
                     value={formData.username}
                     onChange={handleInputChange}
                     className={`form-input ${errors.username ? 'error' : ''}`}
                     placeholder="Tu nombre de usuario"
                     autoComplete="username"
                   />
                   {errors.username && (
                     <span className="form-error">{errors.username}</span>
                   )}
                 </div>
               </>
             )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            {authMode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {authMode === 'register' && (
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    Acepto los{' '}
                    <a href="#" className="terms-link">Términos y Condiciones</a>
                    {' '}y la{' '}
                    <a href="#" className="terms-link">Política de Privacidad</a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <span className="form-error">{errors.acceptTerms}</span>
                )}
              </div>
            )}

            {errors.general && typeof errors.general === 'string' && (
              <ErrorDisplay
                error={errors.general}
                suggestion={typeof errors.suggestion === 'string' ? errors.suggestion : undefined}
                isRetryable={typeof errors.isRetryable === 'boolean' ? errors.isRetryable : undefined}
                onRetry={() => {
                  clearAllErrors();
                  clearError();
                }}
                className="info"
              />
            )}

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading || authLoading ? 'loading' : ''}`}
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="divider-text">o</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button className="social-btn google-btn">
              <svg viewBox="0 0 24 24" className="social-icon">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>
            
            <button className="social-btn apple-btn">
              <svg viewBox="0 0 24 24" className="social-icon" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continuar con Apple
            </button>
          </div>

          {/* Mode Switch */}
          <div className="auth-mode-switch">
            <p className="switch-text">
              {authMode === 'login' 
                ? '¿No tienes una cuenta?' 
                : '¿Ya tienes una cuenta?'
              }
            </p>
            <button 
              type="button" 
              className="switch-btn"
              onClick={switchMode}
            >
              {authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>

          {/* Footer */}
          <div className="auth-modal-footer">
            <p className="footer-text">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="footer-link">Términos de Servicio</a>
              {' '}y{' '}
              <a href="#" className="footer-link">Política de Privacidad</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
