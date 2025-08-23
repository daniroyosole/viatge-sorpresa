import React from 'react';
import Button from './Button';
import './StepActions.css';

interface StepActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  nextDisabled?: boolean;
  completeDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  showComplete?: boolean;
  backText?: string;
  nextText?: string;
  completeText?: string;
}

const StepActions: React.FC<StepActionsProps> = ({
  onBack,
  onNext,
  onComplete,
  nextDisabled = false,
  showBack = true,
  showNext = true,
  showComplete = false,
  backText = 'Enrere',
  nextText = 'Següent',
  completeText = 'Completar'
}) => {
  return (
    <div className="step-actions">
      {showBack && onBack && (
        <Button variant="secondary" onClick={onBack}>
          {backText}
        </Button>
      )}
      
      {showNext && onNext && (
        <Button 
          variant="primary" 
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextText}
        </Button>
      )}
      
      {showComplete && onComplete && (
        <Button 
          variant="success" 
          onClick={onComplete}
          disabled={nextDisabled}
        >
          {completeText}
        </Button>
      )}
    </div>
  );
};

export default StepActions;
