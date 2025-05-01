import React, { useState, useEffect, useRef, ReactElement } from 'react';

interface TooltipProps {
  content: string;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showDelay?: number;
  hideDelay?: number;
  enabled?: boolean;
}

export const Tooltip = ({
  content,
  children,
  placement = 'top',
  showDelay = 300,
  hideDelay = 150,
  enabled = true,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleMouseEnter = () => {
    if (!enabled) return;
    timeoutRef.current = window.setTimeout(() => setVisible(true), showDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setVisible(false), hideDelay);
  };

  return (
    <div
      ref={wrapperRef}
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className={`tooltip tooltip-${placement}`}>
          <div className="tooltip-content">
            {content}
            <div className="tooltip-arrow" />
          </div>
        </div>
      )}
    </div>
  );
};
