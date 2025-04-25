'use client';

import React, { useState, useEffect } from 'react';

export default function AgentDesigner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const steps = [
    {
      title: 'Identity',
      description: 'Choose Name & Personality'
    },
    {
      title: 'Powers',
      description: 'Select Abilities'
    },
    {
      title: 'Mission',
      description: 'Define Goals'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < steps.length) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        handleBack();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, steps.length]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Agent Designer</h1>
      <p className="text-gray-700">Agent design features coming soon.</p>
    </div>
  );
}

const slideAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.5 }
};

type LoadingState = 'idle' | 'saving' | 'success' | 'error';