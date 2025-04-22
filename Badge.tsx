import React from 'react';
import { theme } from './ui-config';

interface BadgeProps {
  label: string;
  colorClass?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, colorClass }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold shadow ${colorClass || ''}`}
    style={!colorClass ? { background: theme.accent, color: '#fff' } : {}}
  >
    {label}
  </span>
);

export default Badge;
