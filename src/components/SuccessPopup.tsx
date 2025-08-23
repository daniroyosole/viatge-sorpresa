import React from 'react';
import './SuccessPopup.css';

interface SuccessPopupProps {
  daysUntilTrip: number;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ daysUntilTrip, onClose }) => {
  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <div className="success-icon">🎉</div>
        <h2>Questionari Completat!</h2>
        <div className="countdown-message">
          <p>Queden <span className="days-highlight">{daysUntilTrip}</span> dies per marxar</p>
          <p className="details-message">Una setmana abans del viatge rebràs nous detalls per preparar-te lookets i el que necessitis</p>
        </div>
        <button className="success-button" onClick={onClose}>
          Perfecte! 🚀
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
