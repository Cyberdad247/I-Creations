import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled(motion.div)<{ elevation: string; interactive: boolean }>`
  background: linear-gradient(180deg, #1a1b26 0%, #24283b 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: #fff;
  box-shadow: ${({ elevation }) => 
    elevation === 'low' ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 
    elevation === 'medium' ? '0 5px 20px rgba(0, 0, 0, 0.15)' : 
    '0 10px 40px rgba(0, 0, 0, 0.2)'
  };
  cursor: ${({ interactive }) => interactive ? 'pointer' : 'default'};
  overflow: hidden;
  position: relative;
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #c0caf5;
  margin: 0 0 0.25rem 0;
`;

const CardSubtitle = styled.p`
  font-size: 1rem;
  color: #a9b1d6;
  margin: 0;
`;

const CardContent = styled.div``;

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  elevation = 'medium',
  interactive = false,
  onClick,
  className,
}) => {
  return (
    <StyledCard 
      elevation={elevation}
      interactive={interactive}
      onClick={interactive ? onClick : undefined}
      whileHover={interactive ? { y: -5, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)' } : {}}
      className={className}
    >
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};