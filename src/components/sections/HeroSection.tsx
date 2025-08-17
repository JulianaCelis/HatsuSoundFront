import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%);
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, ${theme.colors.primary}20 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${theme.colors.secondary}20 0%, transparent 50%);
  pointer-events: none;
`;

const Content = styled.div`
  max-width: 800px;
  z-index: 1;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.text}, ${theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-items: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.xl};
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.sm};
    font-size: 1.25rem;
  }
  
  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.875rem;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      font-size: 1rem;
    }
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  font-size: 1.5rem;
  color: ${theme.colors.text};
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <BackgroundGradient />
      <Content>
        <Title>Descubre el Futuro de la Música</Title>
        <Subtitle>
          HatsuSound es la plataforma definitiva para artistas y productores musicales. 
          Crea, distribuye y monetiza tu música con herramientas profesionales de última generación.
        </Subtitle>
        
        <ButtonGroup>
          <Button size="large" variant="primary">
            Comenzar Gratis
          </Button>
          <Button size="large" variant="outline">
            Ver Demo
          </Button>
        </ButtonGroup>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🎵</FeatureIcon>
            <h3>Creación Profesional</h3>
            <p>Herramientas de estudio de nivel profesional para crear música excepcional</p>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <h3>Distribución Global</h3>
            <p>Llega a audiencias de todo el mundo con un solo clic</p>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <h3>Monetización Inteligente</h3>
            <p>Gana dinero con tu música usando nuestro sistema de pagos avanzado</p>
          </FeatureCard>
        </FeatureGrid>
      </Content>
    </HeroContainer>
  );
};
