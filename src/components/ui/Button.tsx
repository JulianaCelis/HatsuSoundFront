import React from 'react';

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
    borderRadius: '12px',
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
      baseStyles.background = '#8b5cf6';
      baseStyles.color = '#ffffff';
      break;
    case 'outline':
      baseStyles.background = 'transparent';
      baseStyles.color = '#6366f1';
      baseStyles.border = '2px solid #6366f1';
      break;
    case 'ghost':
      baseStyles.background = 'transparent';
      baseStyles.color = '#a1a1aa';
      break;
    default: // primary
      baseStyles.background = '#6366f1';
      baseStyles.color = '#ffffff';
      break;
  }

  // Size styles
  switch (size) {
    case 'small':
      baseStyles.padding = '0.5rem 1rem';
      baseStyles.fontSize = '0.875rem';
      baseStyles.minHeight = '36px';
      break;
    case 'large':
      baseStyles.padding = '1rem 2rem';
      baseStyles.fontSize = '1.125rem';
      baseStyles.minHeight = '56px';
      break;
    default: // medium
      baseStyles.padding = '1rem 1.5rem';
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
      button.style.background = '#6366f1';
      button.style.color = '#ffffff';
    } else if (variant === 'ghost') {
      button.style.background = '#1a1a2e';
      button.style.color = '#ffffff';
    } else if (variant === 'secondary') {
      button.style.background = '#6366f1';
    } else {
      button.style.background = '#8b5cf6';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    const originalStyles = getButtonStyles(variant, size, fullWidth);
    
    button.style.background = (originalStyles.background as string) || '';
    button.style.color = (originalStyles.color as string) || '';
  };

  return (
    <button
      type={type}
      className={className}
      style={{ ...buttonStyles, ...style }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
