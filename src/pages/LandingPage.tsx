import React from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
`;

export const LandingPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <HeroSection />
      </MainContent>
    </PageContainer>
  );
};
