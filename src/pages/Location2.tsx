import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import StepContainer from '../components/StepContainer';
import ClickableMap from '../components/ClickableMap';
import StepActions from '../components/StepActions';

const Location2 = () => {
  const navigate = useNavigate();
  const { data, updateData } = useQuestionnaire();
  const [hasUserSelectedLocation, setHasUserSelectedLocation] = useState(false);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    updateData({ secondLocation: location });
  };

  const handleBack = () => {
    navigate('/location-1');
  };

  const handleNext = () => {
    navigate('/notes');
  };

  return (
    <StepContainer title="✨ On t'agradaria anar?" currentStep={3} className="location-2">
      <div className="location-instructions">
        <p>🌟 A quin indret vols deixar-te portar per nosaltres?</p>
      </div>
      
      <ClickableMap 
        onLocationSelect={handleLocationSelect}
        selectedLocation={data.secondLocation}
        stepNumber={3}
        onUserSelectionChange={setHasUserSelectedLocation}
      />

      <StepActions 
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!data.secondLocation || !hasUserSelectedLocation}
      />
    </StepContainer>
  );
};

export default Location2;
