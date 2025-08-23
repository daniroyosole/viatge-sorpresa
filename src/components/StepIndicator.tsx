import React from 'react';
import './StepIndicator.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 4 }) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  const getStepClass = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return '';
  };

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <span className={`step-number ${getStepClass(step)}`}>
            {step}
          </span>
          {index < steps.length - 1 && <span className="step-line"></span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
