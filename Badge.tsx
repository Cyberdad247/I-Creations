import React from 'react';
import { motion } from 'framer-motion';
import { theme } from './ui-config';

interface BadgeProps {
  label: string;
  colorClass?: string;
}

const badgeVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const Badge: React.FC<BadgeProps> = ({ label, colorClass }) => (
  <motion.span
    variants={badgeVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`px-3 py-1 rounded-full text-xs font-bold shadow ${colorClass || ''}`}
    style={!colorClass ? { background: theme.accent, color: '#fff' } : {}}
  >
    {label}
  </motion.span>
);

export default Badge;
