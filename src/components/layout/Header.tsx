import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="relative">
          <nav className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo y Branding */}
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-all duration-500">
                    <span className="text-white font-black text-2xl">H</span>
                  </div>
                  <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-2xl blur-xl opacity-70 group-hover:opacity-90 transition-all duration-500"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
                    HatsuSound
                  </h1>
                  <span className="text-sm text-purple-300 font-semibold tracking-wider">PREMIUM MUSIC</span>
                </div>
              </div>

              {/* Navegación Principal - Horizontal */}
              <div className="hidden lg:flex items-center space-x-2">
                <button className="relative px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-purple-400/50 backdrop-blur-xl group overflow-hidden">
                  <span className="relative z-10">Descubrir</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
                
                <button className="relative px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-blue-400/50 backdrop-blur-xl group overflow-hidden">
                  <span className="relative z-10">Radio</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
                
                <button className="relative px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-green-400/50 backdrop-blur-xl group overflow-hidden">
                  <span className="relative z-10">Podcasts</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
                
                <button className="relative px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-orange-400/50 backdrop-blur-xl group overflow-hidden">
                  <span className="relative z-10">Live</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>

              {/* Botones de Acción - Horizontal */}
              <div className="hidden lg:flex items-center space-x-4">
                <button className="relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl shadow-purple-500/25 border border-purple-400/30 overflow-hidden group">
                  <span className="relative z-10">Iniciar Sesión</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
                
                <button className="relative px-8 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white font-bold rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl shadow-orange-500/25 border border-yellow-400/30 overflow-hidden group">
                  <span className="relative z-10">Premium</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>

              {/* Botón Menú Móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-purple-400/50 text-white rounded-2xl transition-all duration-500 hover:scale-110 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Menú Móvil Mejorado */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Panel del Menú */}
          <div className="fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-3xl border-l border-white/20 z-50 transform transition-transform duration-700 ease-out lg:hidden shadow-2xl">
            
            {/* Header del Menú */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">HatsuSound</h3>
                  <p className="text-sm text-purple-300">Premium Music</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navegación Móvil */}
            <div className="px-6 py-6 space-y-3">
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-purple-400/50 text-left backdrop-blur-xl">
                Descubrir
              </button>
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-blue-400/50 text-left backdrop-blur-xl">
                Radio
              </button>
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-green-400/50 text-left backdrop-blur-xl">
                Podcasts
              </button>
              <button className="w-full p-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all duration-500 hover:scale-105 border border-white/10 hover:border-orange-400/50 text-left backdrop-blur-xl">
                Live
              </button>
            </div>

            {/* Botones de Acción Móvil */}
            <div className="px-6 py-6 space-y-4 border-t border-white/10">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/25">
                Iniciar Sesión
              </button>
              <button className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white font-bold rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-orange-500/25">
                Obtener Premium
              </button>
            </div>
          </div>
        </>
      )}

      {/* Espaciado para el Header Fijo */}
      <div className="h-20" />
    </>
  );
};

export default Header;