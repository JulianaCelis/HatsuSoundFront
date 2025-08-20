import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { AudioProductsList } from '../components/audio-products/AudioProductsList';
import { CartModal } from '../components/cart';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleProductAdded = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <HeroSection />
        
        {/* Productos Destacados */}
        <section className="featured-products-section">
          <div className="section-container">
            <div className="section-header">
              <div className="section-title-container">
                <h2 className="section-title">
                  Productos Destacados
                </h2>
                <div className="title-underline"></div>
              </div>
              <p className="section-subtitle">
                Los mejores productos seleccionados por nuestros usuarios
              </p>
            </div>
            
            {/* Mostrar solo los primeros 6 productos */}
            <AudioProductsList 
              initialFilters={{ 
                limit: 6,
                sortBy: 'playCount',
                sortOrder: 'desc'
              }} 
              onProductAdded={handleProductAdded}
            />
          </div>
        </section>

        {/* Sección de características */}
        <section className="features-section">
          <div className="section-container">
            <div className="section-header">
              <div className="section-title-container">
                <h2 className="section-title">
                  ¿Por qué elegir HatsuSound?
                </h2>
                <div className="title-underline"></div>
              </div>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h3 className="feature-title">Calidad Profesional</h3>
                <p className="feature-description">
                  Todos nuestros productos pasan por rigurosos controles de calidad para garantizar la mejor experiencia auditiva.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 className="feature-title">Descarga Instantánea</h3>
                <p className="feature-description">
                  Accede a tu música favorita de inmediato con descargas de alta velocidad y máxima calidad.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💎</div>
                <h3 className="feature-title">Contenido Exclusivo</h3>
                <p className="feature-description">
                  Descubre tracks únicos y remixes exclusivos que no encontrarás en ninguna otra plataforma.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
