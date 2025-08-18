import React from 'react';
import Header from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';

export const LandingPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};
