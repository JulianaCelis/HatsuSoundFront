import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: ${theme.colors.secondary};
        color: ${theme.colors.text};
        &:hover:not(:disabled) {
          background: ${theme.colors.primary};
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background: ${theme.colors.primary};
          color: ${theme.colors.text};
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.colors.textSecondary};
        &:hover:not(:disabled) {
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
        }
      `;
    default:
      return css`
        background: ${theme.colors.primary};
        color: ${theme.colors.text};
        &:hover:not(:disabled) {
          background: ${theme.colors.secondary};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 0.875rem;
        min-height: 36px;
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: 1.125rem;
        min-height: 56px;
      `;
    default:
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: 1rem;
        min-height: 48px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  touch-action: manipulation;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }

  /* Mobile touch improvements */
  @media (hover: none) and (pointer: coarse) {
    min-height: 44px; /* iOS minimum touch target */
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
