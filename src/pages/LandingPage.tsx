import React from 'react';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%) !important',
      color: 'white !important',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1
    }}>
      <main style={{ width: '100%', maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '2rem',
          color: 'white !important',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          🎵 HatsuSound
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem', 
          maxWidth: '600px',
          color: 'white !important',
          lineHeight: '1.6'
        }}>
          Si puedes ver esto, la página está funcionando correctamente. 
          La aplicación se ha cargado exitosamente.
        </p>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'white !important' }}>✅ Estado de la Aplicación</h2>
          <p style={{ color: 'white !important', marginBottom: '0.5rem' }}>React está funcionando correctamente</p>
          <p style={{ color: 'white !important', marginBottom: '0.5rem' }}>Los estilos CSS se están aplicando</p>
          <p style={{ color: 'white !important', marginBottom: '0.5rem' }}>La página se está renderizando</p>
        </div>
      </main>
    </div>
  );
};
