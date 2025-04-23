import React from 'react';
import { motion } from 'framer-motion';
import { theme } from './ui-config';

interface ProgressBarProps {
  progress: number; // 0-100
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass }) => (
  <div className="w-full max-w-md bg-gray-200 rounded-full h-6 overflow-hidden">
    <motion.div
      initial={{ width: '0%' }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`${colorClass || ''} h-6 rounded-full`}
      style={!colorClass ? { background: theme.accent } : {}}
    >
    </motion.div>
  </div>
);

export default ProgressBar;
