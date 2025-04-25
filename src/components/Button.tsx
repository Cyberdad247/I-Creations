import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledButton = styled(motion.button)<{
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  /* Size styles */
  padding: ${({ size }) => 
    size === 'small' ? '8px 16px' : 
    size === 'medium' ? '12px 24px' : 
    '16px 32px'
  };
  font-size: ${({ size }) => 
    size === 'small' ? '0.875rem' : 
    size === 'medium' ? '1rem' : 
    '1.125rem'
  };
  
  /* Variant styles */
  background: ${({ variant }) => 
    variant === 'primary' ? '#9ece6a' : 
    variant === 'secondary' ? '#444b6a' : 
    'transparent'
  };
  color: ${({ variant }) => 
    variant === 'primary' ? '#1a1b26' : 
    variant === 'secondary' ? '#c0caf5' : 
    '#7aa2f7'
  };
  border: ${({ variant }) => 
    variant === 'tertiary' ? '1px solid #7aa2f7' : 'none'
  };
  
  /* States */
  opacity: ${({ isLoading, disabled }) => (isLoading || disabled ? 0.6 : 1)};
  cursor: ${({ isLoading, disabled }) => (isLoading || disabled ? 'not-allowed' : 'pointer')};
  
  &:hover:not(:disabled):not([data-loading="true"]) {
    background: ${({ variant }) => 
      variant === 'primary' ? '#b9f27c' : 
      variant === 'secondary' ? '#5a6083' : 
      'rgba(122, 162, 247, 0.1)'
    };
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled):not([data-loading="true"]) {
    transform: translateY(0);
  }
`;

const IconWrapper = styled.span<{ position: 'left' | 'right' }>`
  display: inline-flex;
  margin-${({ position }) => position === 'left' ? 'right' : 'left'}: 8px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      data-loading={isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
      {children}
      {!isLoading && rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};