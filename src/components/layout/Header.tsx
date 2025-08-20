import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import AuthModal from '../ui/AuthModal';
import SecretModal from '../ui/SecretModal';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';

interface IconProps {
  className?: string;
}

interface NavigationItem {
  name: string;
  icon: React.ComponentType<IconProps>;
  color: string;
  href?: string;
}

type PlayState = 'playing' | 'paused' | 'loading';
type SearchState = 'idle' | 'focused' | 'searching';

interface HeaderState {
  isMobileMenuOpen: boolean;
  scrolled: boolean;
  playState: PlayState;
  currentTime: number;
  searchState: SearchState;
  audioLevels: number[];
  isAuthModalOpen: boolean;
  isUserMenuOpen: boolean;
  showSecretModal: boolean;
}

const AUDIO_VISUALIZER_BARS = 8;
const PROGRESS_UPDATE_INTERVAL = 150;
const SCROLL_THRESHOLD = 20;
const TOTAL_TRACK_DURATION = 180;

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, logoutAll } = useAuth();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [headerState, setHeaderState] = useState<HeaderState>({
    isMobileMenuOpen: false,
    scrolled: false,
    playState: 'paused',
    currentTime: 0,
    searchState: 'idle',
    audioLevels: Array(AUDIO_VISUALIZER_BARS).fill(0),
    isAuthModalOpen: false,
    isUserMenuOpen: false,
    showSecretModal: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback((): void => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    setHeaderState(prev => ({ ...prev, scrolled: isScrolled }));
  }, []);

  const updateAudioLevels = useCallback((): void => {
    if (headerState.playState === 'playing') {
      const newLevels = Array.from({ length: AUDIO_VISUALIZER_BARS }, () => Math.random() * 100);
      setHeaderState(prev => ({
        ...prev,
        audioLevels: newLevels,
        currentTime: prev.currentTime + 1
      }));
    }
  }, [headerState.playState]);

  const togglePlay = useCallback((): void => {
    setHeaderState(prev => ({
      ...prev,
      playState: prev.playState === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  const toggleMobileMenu = useCallback((): void => {
    setHeaderState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen
    }));
  }, []);

  const closeMobileMenu = useCallback((): void => {
    setHeaderState(prev => ({ ...prev, isMobileMenuOpen: false }));
  }, []);

  const openAuthModal = useCallback((): void => {
    setHeaderState(prev => ({ ...prev, isAuthModalOpen: true }));
  }, []);

  const closeAuthModal = useCallback((): void => {
    setHeaderState(prev => ({ ...prev, isAuthModalOpen: false }));
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await logout();
      showSuccess('Sesión cerrada', 'Has cerrado sesión correctamente');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, showSuccess]);

  const handleLogoutAll = useCallback(async (): Promise<void> => {
    try {
      await logoutAll();
      showSuccess('Sesiones cerradas', 'Todas tus sesiones han sido cerradas');
    } catch (error) {
      console.error('Logout all error:', error);
    }
  }, [logoutAll, showSuccess]);

  const handleHeartClick = useCallback((): void => {
    console.log('❤️ Corazón clickeado - ¡Modal secreta activada!');
    setHeaderState(prev => ({
      ...prev,
      showSecretModal: true
    }));
  }, []);

  const handleSecretButtonClick = async (): Promise<void> => {
    try {
      console.log('🔍 Iniciando prueba de conexión con el backend...');
      console.log('📍 URL de destino:', '/api/health');
      console.log('🌐 URL completa:', window.location.origin + '/api/health');
      console.log('🔧 Puerto actual:', window.location.port);
      console.log('🏠 Host actual:', window.location.host);
      
      // PRIMERA PRUEBA: URL relativa (puede fallar si no hay proxy configurado)
      console.log('\n🔄 PRUEBA 1: URL relativa /api/health');
      try {
        const response = await fetch('/api/health', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('📡 Response recibida:', response);
        console.log('📊 Status:', response.status);
        console.log('📋 Status Text:', response.statusText);
        console.log('🔗 Headers:', Object.fromEntries(response.headers.entries()));
        console.log('🌐 URL final:', response.url);
        
        if (response.ok) {
          // Intentar leer el contenido como JSON
          try {
            const data = await response.json();
            console.log('✅ Datos JSON recibidos:', data);
            showSuccess('Conexión exitosa', '✅ Conexión exitosa con el backend!');
            return; // Salir si funciona
          } catch (jsonError) {
            console.error('❌ Error al parsear JSON:', jsonError);
            // Intentar leer como texto para debug
            const textData = await response.text();
            console.log('📄 Contenido recibido (texto):', textData.substring(0, 200) + '...');
          }
        } else {
          console.error('❌ Response no exitosa:', response.status, response.statusText);
          // Intentar leer el contenido para debug
          try {
            const errorText = await response.text();
            console.log('📄 Contenido del error:', errorText.substring(0, 200) + '...');
          } catch (textError) {
            console.error('❌ No se pudo leer el contenido del error:', textError);
          }
        }
      } catch (error: unknown) {
        console.error('❌ Error en PRUEBA 1:', error);
      }
      
      // SEGUNDA PRUEBA: URL completa del backend (puerto 3012)
      console.log('\n🔄 PRUEBA 2: URL completa http://localhost:3012/api/health');
      try {
        const backendUrl = 'http://localhost:3012/api/health';
        console.log('🌐 Intentando conectar a:', backendUrl);
        
        const response2 = await fetch(backendUrl, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('📡 Response 2 recibida:', response2);
        console.log('📊 Status 2:', response2.status);
        
        if (response2.ok) {
          try {
            const data = await response2.json();
            console.log('✅ Datos JSON recibidos en PRUEBA 2:', data);
            showSuccess('Conexión exitosa', '✅ Conexión exitosa con el backend (puerto 3012)!');
            return;
          } catch (jsonError) {
            console.error('❌ Error al parsear JSON en PRUEBA 2:', jsonError);
          }
        }
      } catch (error: unknown) {
        console.error('❌ Error en PRUEBA 2:', error);
        if (error instanceof TypeError) {
          console.error('🔍 Es un error de red - posible problema de CORS');
        }
      }
      
      // Si llegamos aquí, ambas pruebas fallaron
      showInfo('Error de conexión', '❌ No se pudo conectar con el backend en ninguna prueba');
      
    } catch (error: unknown) {
      console.error('💥 Error general:', error);
      if (error instanceof Error) {
        console.error('📋 Tipo de error:', error.constructor.name);
        console.error('📄 Mensaje de error:', error.message);
      } else {
        console.error('📋 Error de tipo desconocido:', typeof error);
      }
      showInfo('Error de conexión', '❌ Error general en la conexión');
    }
  };

  const handleSearchFocus = useCallback((): void => {
    setHeaderState(prev => ({ ...prev, searchState: 'focused' }));
  }, []);

  const handleSearchBlur = useCallback((): void => {
    setHeaderState(prev => ({ ...prev, searchState: 'idle' }));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const userMenuContainer = document.querySelector('.user-menu-container');
      
      if (userMenuContainer && !userMenuContainer.contains(target)) {
        setHeaderState(prev => ({ ...prev, isUserMenuOpen: false }));
      }
    };

    if (headerState.isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [headerState.isUserMenuOpen]);

  useEffect(() => {
    if (headerState.playState === 'playing') {
      intervalRef.current = setInterval(updateAudioLevels, PROGRESS_UPDATE_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [headerState.playState, updateAudioLevels]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return (headerState.currentTime % TOTAL_TRACK_DURATION) / TOTAL_TRACK_DURATION * 100;
  };

  const PlayIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );

  const SearchIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );

  const MusicIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  );

  const RadioIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  );

  const MicIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );

  const ZapIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
    </svg>
  );

  const HeartIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  const DownloadIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );

  const UserIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const SparklesIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09z"/>
    </svg>
  );

  const StarIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
    </svg>
  );

  const MenuIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  const XIcon: React.FC<IconProps> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const AdvancedAudioVisualizer: React.FC = () => (
    <div className={`audio-visualizer ${headerState.playState === 'playing' ? 'playing' : 'idle'}`}>
      {headerState.audioLevels.map((level: number, i: number) => (
        <div
          key={i}
          className="audio-bar"
          style={{
            height: headerState.playState === 'playing' ? `${Math.max(4, level * 0.24)}px` : '4px',
            opacity: headerState.playState === 'playing' ? 0.8 + (level * 0.002) : 0.1,
            backgroundColor: headerState.playState === 'playing' 
              ? 'var(--audio-bar-active, #7c3aed)' 
              : 'var(--audio-bar-idle, #374151)'
          }}
        />
      ))}
    </div>
  );

  const FloatingParticles: React.FC = () => (
    <div className="floating-particles">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );

  const EnhancedSearch: React.FC = () => {
    const recentSearches: string[] = ['Rock Clásico', 'Pop 80s', 'Jazz Nocturno', 'Hip Hop', 'Electrónica'];
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Calculate dropdown position when focused
    useEffect(() => {
      if (headerState.searchState === 'focused' && searchRef.current && dropdownRef.current) {
        const updateDropdownPosition = () => {
          if (searchRef.current && dropdownRef.current) {
            const searchRect = searchRef.current.getBoundingClientRect();
            const dropdown = dropdownRef.current;
            
            // Position dropdown below the search input
            dropdown.style.position = 'fixed';
            dropdown.style.top = `${searchRect.bottom + 8}px`;
            dropdown.style.left = `${searchRect.left}px`;
            dropdown.style.width = `${searchRect.width}px`;
          }
        };
        
        // Initial position
        updateDropdownPosition();
        
        // Update position on scroll and resize
        window.addEventListener('scroll', updateDropdownPosition);
        window.addEventListener('resize', updateDropdownPosition);
        
        return () => {
          window.removeEventListener('scroll', updateDropdownPosition);
          window.removeEventListener('resize', updateDropdownPosition);
        };
      }
    }, [headerState.searchState]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setHeaderState(prev => ({ ...prev, searchState: 'idle' }));
        }
      };

      if (headerState.searchState === 'focused') {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [headerState.searchState]);
    
    return (
      <div 
        ref={searchRef}
        className={`search-container ${headerState.searchState === 'focused' ? 'focused' : ''}`}
      >
        <div className={`search-input-container ${headerState.searchState === 'focused' ? 'focused' : ''}`}>
          <SearchIcon className={`search-icon ${headerState.searchState === 'focused' ? 'focused' : ''}`} />
          <input
            type="text"
            placeholder="Buscar canciones, artistas, géneros..."
            className="search-input"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  // Scroll to products section and trigger search
                  const productsSection = document.querySelector('#products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                    // You can add a custom event to trigger search in ProductList
                    window.dispatchEvent(new CustomEvent('headerSearch', { 
                      detail: { query: target.value.trim() } 
                    }));
                  }
                }
              }
            }}
          />
          <div className="search-shortcut">
            {headerState.searchState === 'focused' && (
              <div className="shortcut-hint">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>
        </div>
        
        {headerState.searchState === 'focused' && (
          <div ref={dropdownRef} className="search-dropdown">
            <div className="dropdown-content">
              <div className="recent-searches-title">BÚSQUEDAS RECIENTES</div>
              {recentSearches.map((item: string, i: number) => (
                                  <button
                    key={i}
                    className="search-result-item"
                    onClick={() => {
                      // Handle search selection here
                      console.log('Searching for:', item);
                      // Scroll to products section and trigger search
                      const productsSection = document.querySelector('#products');
                      if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                        // Trigger search with the selected item
                        window.dispatchEvent(new CustomEvent('headerSearch', { 
                          detail: { query: item } 
                        }));
                      }
                    }}
                  >
                  <div className="search-result-icon">
                    <MusicIcon className="search-result-music-icon" />
                  </div>
                  <span className="search-result-text">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const navigationItems: NavigationItem[] = [
    { name: 'Inicio', icon: RadioIcon, color: 'purple', href: '/' },
    { name: 'Catálogo', icon: RadioIcon, color: 'blue', href: '/products' },
    { name: 'Géneros', icon: RadioIcon, color: 'green', href: '#genres' },
    { name: 'Artistas', icon: MicIcon, color: 'orange', href: '#artists' },
  ];

  const mobileNavigationItems: NavigationItem[] = [
    { name: 'Inicio', icon: RadioIcon, color: 'purple', href: '/' },
    { name: 'Catálogo', icon: RadioIcon, color: 'blue', href: '/products' },
    { name: 'Géneros', icon: RadioIcon, color: 'green', href: '#genres' },
    { name: 'Artistas', icon: MicIcon, color: 'orange', href: '#artists' },
    { name: 'Favoritos', icon: HeartIcon, color: 'red', href: '#favorites' },
    { name: 'Descargas', icon: DownloadIcon, color: 'cyan', href: '#downloads' },
  ];

  return (
    <>
      <div className="header-background" />
      
      <header className={`header ${headerState.scrolled ? 'scrolled' : ''}`}>
        
        <div className="header-top-border" />
        
        <FloatingParticles />
        
        <nav className="header-nav">
          <div className="header-content">
            
            <button 
              className="logo-button" 
              onClick={() => {
                navigate('/');
                togglePlay();
              }}
            >
              <div className="logo-icon-container">
                <div className={`logo-glow ${headerState.playState === 'playing' ? 'playing' : ''}`} />
                
                <div className={`logo-icon ${headerState.playState === 'playing' ? 'playing' : ''}`}>
                  {headerState.playState === 'playing' ? (
                    <PauseIcon className="play-pause-icon" />
                  ) : (
                    <PlayIcon className="play-pause-icon play" />
                  )}
                  
                                  {headerState.playState === 'playing' && (
                  <>
                    <div className="logo-ping-border" />
                    <div className="logo-pulse-border" />
                    <div className="playing-indicator">
                      <span className="playing-dot"></span>
                      <span className="playing-text">LIVE</span>
                    </div>
                  </>
                )}
                </div>

                {headerState.playState === 'playing' && (
                  <>
                    <div className="logo-yellow-dot" />
                    <div className="logo-pink-dot" />
                  </>
                )}
              </div>

              <div className="logo-text-container">
                <div className="logo-title-row">
                  <h1 className="logo-title">
                    HatsuSound
                  </h1>
                </div>
                {/* Audio Visualizer - SEPARATE FROM TITLE, OCCUPIES REAL SPACE */}
                <div className="logo-visualizer-row">
                  <AdvancedAudioVisualizer />
                </div>
                <div className="logo-subtitle-row">
                  <span className="logo-subtitle">PREMIUM MUSIC</span>
                  <div className="logo-stars">
                    {Array.from({ length: 3 }, (_, i) => (
                      <StarIcon key={i} className="logo-star" />
                    ))}
                  </div>
                </div>
              </div>
            </button>

            <div className="desktop-navigation">
              <nav className="nav-menu">
                {navigationItems.map((item: NavigationItem, index: number) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className={`nav-item nav-${item.color}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        if (item.href) {
                          if (item.href.startsWith('/')) {
                            navigate(item.href);
                          } else {
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }
                      }}
                    >
                      <div className="nav-item-background" />
                      
                      <div className="nav-item-content">
                        <Icon className="nav-item-icon" />
                        <span className="nav-item-text">
                          {item.name}
                        </span>
                      </div>
                      
                      <div className="nav-item-underline" />
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="header-actions">
              <EnhancedSearch />

              <div className="action-buttons">
                <button className="action-button heart-button" onClick={handleHeartClick}>
                  <HeartIcon className="action-icon" />
                  <div className="notification-badge">3</div>
                </button>

                <button className="action-button download-button">
                  <DownloadIcon className="action-icon" />
                </button>

                {/* Modal secreta que se abre inmediatamente al hacer clic en el corazón */}

                {isAuthenticated && user ? (
                  <div className="user-menu-container">
                    <button className="user-button" onClick={() => setHeaderState(prev => ({ ...prev, isUserMenuOpen: !prev.isUserMenuOpen }))}>
                      <div className="user-avatar">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-status" />
                    </button>
                    
                    {headerState.isUserMenuOpen && (
                      <div className="user-menu">
                        <div className="user-menu-header">
                          <div className="user-menu-avatar">
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-menu-info">
                            <div className="user-menu-name">{user.fullName}</div>
                            <div className="user-menu-email">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="user-menu-items">
                          <button className="user-menu-item" onClick={handleLogout}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16,17 21,12 16,7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Cerrar Sesión
                          </button>
                          
                          <button className="user-menu-item" onClick={handleLogoutAll}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Cerrar Todas las Sesiones
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="user-button" onClick={openAuthModal}>
                    <div className="user-avatar">
                      <UserIcon className="user-icon" />
                    </div>
                    <div className="user-status" />
                  </button>
                )}

                <button className="premium-button">
                  <span className="premium-content">
                    <SparklesIcon className="premium-sparkles" />
                    <span>Premium</span>
                  </span>
                  
                  <div className="premium-shine" />
                  
                  <div className="premium-dot-1" />
                  <div className="premium-dot-2" />
                </button>
              </div>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
            >
              {headerState.isMobileMenuOpen ? (
                <XIcon className="mobile-menu-icon" />
              ) : (
                <MenuIcon className="mobile-menu-icon" />
              )}
            </button>
          </div>

                      {headerState.playState === 'playing' && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
                <div className="now-playing-info">
                  <span className="now-playing-text">🎵 Reproduciendo: Bohemian Rhapsody - Queen</span>
                </div>
              </div>
            )}
        </nav>
      </header>

      {headerState.isMobileMenuOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={closeMobileMenu}
          />
          
          <div className="mobile-menu">
            
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <div className="mobile-menu-icon-container">
                  <MusicIcon className="mobile-menu-music-icon" />
                </div>
                <div>
                  <h3 className="mobile-menu-title">HatsuSound</h3>
                  <p className="mobile-menu-subtitle">Premium Music</p>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="mobile-menu-close"
              >
                <XIcon className="mobile-menu-close-icon" />
              </button>
            </div>

            <div className="mobile-menu-items">
              {mobileNavigationItems.map((item: NavigationItem, index: number) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className={`mobile-menu-item mobile-${item.color}`}
                    onClick={() => {
                      closeMobileMenu();
                      if (item.href) {
                        if (item.href.startsWith('/')) {
                          navigate(item.href);
                        } else {
                          const element = document.querySelector(item.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }
                    }}
                  >
                    <Icon className="mobile-menu-item-icon" />
                    <span className="mobile-menu-item-text">{item.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="mobile-menu-actions">
              <button className="mobile-login-button" onClick={openAuthModal}>
                Iniciar Sesión
              </button>
              
              <button className="mobile-premium-button">
                <SparklesIcon className="mobile-premium-sparkles" />
                <span>Obtener Premium</span>
              </button>
            </div>

            {headerState.playState === 'playing' && (
              <div className="mobile-player">
                <div className="mobile-player-content">
                  <div className="mobile-player-icon">
                    <PlayIcon className="mobile-player-play-icon" />
                  </div>
                  <div className="mobile-player-info">
                    <p className="mobile-player-title">Bohemian Rhapsody</p>
                    <p className="mobile-player-artist">Queen</p>
                    <p className="mobile-player-time">{formatTime(headerState.currentTime)} / 3:00</p>
                  </div>
                  <AdvancedAudioVisualizer />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="header-spacer" />
      
      {/* Secret Modal */}
      <SecretModal 
        isOpen={headerState.showSecretModal}
        onClose={() => setHeaderState(prev => ({ ...prev, showSecretModal: false }))}
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={headerState.isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
};

export default Header;