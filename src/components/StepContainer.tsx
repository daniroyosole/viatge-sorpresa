import React from 'react';
import type { ReactNode } from 'react';
import StepIndicator from './StepIndicator';
import './StepContainer.css';

interface StepContainerProps {
  title: string;
  currentStep: number;
  children: ReactNode;
  className?: string;
}

const StepContainer: React.FC<StepContainerProps> = ({ title, currentStep, children, className }) => {
  return (
    <div className={`step-container ${className || ''}`}>
      <div className="step-header">
        <StepIndicator currentStep={currentStep} />
        <h1>{title}</h1>
      </div>
      <div className="step-content">
        {children}
      </div>
    </div>
  );
};

export default StepContainer;
