import React from 'react';
import { theme, animation } from './ui-config';

interface ProgressBarProps {
  progress: number; // 0-100
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass }) => (
  <div className="w-full max-w-md bg-gray-200 rounded-full h-6 overflow-hidden">
    <div
      className={`${colorClass || ''} h-6 rounded-full transition-all`}
      style={{
        width: `${progress}%`,
        background: colorClass ? undefined : theme.accent,
        transitionDuration: animation.normal,
        animation: 'pulse 1.5s infinite',
      }}
    ></div>
  </div>
);

export default ProgressBar;
