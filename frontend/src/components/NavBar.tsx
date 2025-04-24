import React from 'react';
import { useOnboarding } from '../services/OnboardingService';
import { Tooltip } from './Tooltip';

export const NavBar = () => {
  const { startOnboarding, currentStep, steps, completeStep } = useOnboarding();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Tooltip 
          content={steps[currentStep]?.content} 
          placement={steps[currentStep]?.placement}
          enabled={currentStep < steps.length}
        >
          <button 
            className="new-agent-btn"
            id="onboarding-step-1"
          >
            Create New Agent
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};
