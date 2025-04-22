import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const toastColors = {
  success: '#4ade80', // green
  error: '#f87171',   // red
  info: '#60a5fa'     // blue
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        background: toastColors[type],
        color: '#1a1b26',
        padding: '10px 24px',
        borderRadius: 8,
        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        fontSize: 15,
        zIndex: 9999,
        minWidth: 120,
        textAlign: 'center',
        opacity: 0.97
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};
