import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const getButtonStyles = (variant: ButtonProps['variant'], size: ButtonProps['size'], fullWidth: boolean) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: theme.borderRadius,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    touchAction: 'manipulation',
    width: fullWidth ? '100%' : 'auto',
  };

  // Variant styles
  switch (variant) {
    case 'secondary':
      baseStyles.background = theme.colors.secondary;
      baseStyles.color = theme.colors.text;
      break;
    case 'outline':
      baseStyles.background = 'transparent';
      baseStyles.color = theme.colors.primary;
      baseStyles.border = `2px solid ${theme.colors.primary}`;
      break;
    case 'ghost':
      baseStyles.background = 'transparent';
      baseStyles.color = theme.colors.textSecondary;
      break;
    default: // primary
      baseStyles.background = theme.colors.primary;
      baseStyles.color = theme.colors.text;
      break;
  }

  // Size styles
  switch (size) {
    case 'small':
      baseStyles.padding = `${theme.spacing.sm} ${theme.spacing.md}`;
      baseStyles.fontSize = '0.875rem';
      baseStyles.minHeight = '36px';
      break;
    case 'large':
      baseStyles.padding = `${theme.spacing.md} ${theme.spacing.xl}`;
      baseStyles.fontSize = '1.125rem';
      baseStyles.minHeight = '56px';
      break;
    default: // medium
      baseStyles.padding = `${theme.spacing.md} ${theme.spacing.lg}`;
      baseStyles.fontSize = '1rem';
      baseStyles.minHeight = '48px';
      break;
  }

  return baseStyles;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style,
  ...props
}) => {
  const buttonStyles = getButtonStyles(variant, size, fullWidth);
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    if (variant === 'outline') {
      button.style.background = theme.colors.primary;
      button.style.color = theme.colors.text;
    } else if (variant === 'ghost') {
      button.style.background = theme.colors.surface;
      button.style.color = theme.colors.text;
    } else if (variant === 'secondary') {
      button.style.background = theme.colors.primary;
    } else {
      button.style.background = theme.colors.secondary;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    const originalStyles = getButtonStyles(variant, size, fullWidth);
    button.style.background = originalStyles.background as string;
    button.style.color = originalStyles.color as string;
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...buttonStyles,
        ...style,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      {...props}
    >
      {children}
    </button>
  );
};
