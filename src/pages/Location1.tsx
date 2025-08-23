import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import StepContainer from '../components/StepContainer';
import ClickableMap from '../components/ClickableMap';
import StepActions from '../components/StepActions';

const Location1 = () => {
  const navigate = useNavigate();
  const { data, updateData } = useQuestionnaire();
  const [hasUserSelectedLocation, setHasUserSelectedLocation] = useState(false);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    updateData({ firstLocation: location });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/location-2');
  };

  return (
    <StepContainer title="🤔 On creus que anem?" currentStep={2} className="location-1">
      <div className="location-instructions">
        <p>💭 Tenint en compte que ho organitzem la Cris i el Dani, pensa on creus que et portarem de viatge...</p>
      </div>
      
      <ClickableMap 
        onLocationSelect={handleLocationSelect}
        selectedLocation={data.firstLocation}
        stepNumber={2}
        onUserSelectionChange={setHasUserSelectedLocation}
      />

      <StepActions 
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!data.firstLocation || !hasUserSelectedLocation}
      />
    </StepContainer>
  );
};

export default Location1;
