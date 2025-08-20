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
  background: linear-gradient(135deg, 
    #0f0f23 0%, 
    #1a1a2e 25%, 
    #16213e 50%, 
    #0f3460 75%, 
    #0f0f23 100%);
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
  background: 
    radial-gradient(circle at 20% 80%, rgba(79, 195, 247, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
  pointer-events: none;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingElement = styled.div<{ delay: number; duration: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.1), rgba(102, 126, 234, 0.1));
  border-radius: 50%;
  animation: float ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
  }
  
  &:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-direction: reverse;
  }
  
  &:nth-child(3) {
    bottom: 30%;
    left: 20%;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    top: 40%;
    right: 30%;
    animation-delay: 1.5s;
  }
`;

const Content = styled.div`
  max-width: 900px;
  z-index: 1;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(135deg, #ffffff 0%, #4fc3f7 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #b0bec5;
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.7;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.4rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  
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
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.05), 
      transparent);
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
  
  h3 {
    color: #4fc3f7;
    margin-bottom: ${theme.spacing.sm};
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  p {
    color: #b0bec5;
    font-size: 0.95rem;
    line-height: 1.6;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      font-size: 1rem;
    }
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4fc3f7, #667eea);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  font-size: 1.8rem;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(79, 195, 247, 0.3);
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 32px rgba(79, 195, 247, 0.4);
  }
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #4fc3f7;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #90a4ae;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <BackgroundGradient />
      
      <FloatingElements>
        <FloatingElement delay={0} duration={6} size={80} />
        <FloatingElement delay={2} duration={8} size={120} />
        <FloatingElement delay={4} duration={7} size={60} />
        <FloatingElement delay={1} duration={9} size={100} />
      </FloatingElements>
      
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
        
        <StatsSection>
          <StatItem>
            <span className="stat-number">10K+</span>
            <span className="stat-label">Artistas</span>
          </StatItem>
          <StatItem>
            <span className="stat-number">1M+</span>
            <span className="stat-label">Descargas</span>
          </StatItem>
          <StatItem>
            <span className="stat-number">50+</span>
            <span className="stat-label">Países</span>
          </StatItem>
        </StatsSection>
        
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
