import React from 'react';
import './HeroSection.css';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-container">
      <div className="background-gradient"></div>
      <div className="hero-content">
        <h1 className="hero-title">Descubre el Futuro de la Música</h1>
        <p className="hero-subtitle">
          HatsuSound es la plataforma definitiva para artistas y productores musicales. 
          Crea, distribuye y monetiza tu música con herramientas profesionales de última generación.
        </p>
        
        <div className="button-group">
          <Button size="large" variant="primary">
            Comenzar Gratis
          </Button>
          <Button size="large" variant="outline">
            Ver Demo
          </Button>
        </div>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Creación Profesional</h3>
            <p>Herramientas de estudio de nivel profesional para crear música excepcional</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Distribución Global</h3>
            <p>Llega a audiencias de todo el mundo con un solo clic</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Monetización Inteligente</h3>
            <p>Gana dinero con tu música usando nuestro sistema de pagos avanzado</p>
          </div>
        </div>
      </div>
    </section>
  );
};
