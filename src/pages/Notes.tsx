import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import StepContainer from '../components/StepContainer';
import NotesInput from '../components/NotesInput';
import StepActions from '../components/StepActions';
import SuccessPopup from '../components/SuccessPopup';
import { saveQuestionnaireResponse } from '../services/firebaseService';
import type { QuestionnaireResponse } from '../services/firebaseService';

const Notes = () => {
  const navigate = useNavigate();
  const { data, updateData, resetData } = useQuestionnaire();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [daysUntilTrip, setDaysUntilTrip] = useState(0);

  const handleNotesChange = (value: string) => {
    updateData({ notes: value });
  };

  const handleBack = () => {
    navigate('/location-2');
  };

  const handleComplete = async () => {
    if (!data.selectedUser || !data.firstLocation || !data.secondLocation) {
      alert('Si us plau, completa tots els camps abans de finalitzar.');
      return;
    }

    setIsSaving(true);
    
    try {
      const response: QuestionnaireResponse = {
        name: data.selectedUser,
        lat_1: data.firstLocation.lat,
        lon_1: data.firstLocation.lng,
        lat_2: data.secondLocation.lat,
        lon_2: data.secondLocation.lng,
        notes: data.notes || '',
        timestamp: Date.now()
      };

      await saveQuestionnaireResponse(response);
      
      // Calculate days until September 19th
      const currentYear = new Date().getFullYear();
      const tripDate = new Date(currentYear, 8, 19); // September is month 8 (0-indexed)
      
      // If September 19th has passed this year, use next year
      if (tripDate < new Date()) {
        tripDate.setFullYear(currentYear + 1);
      }
      
      const calculatedDays = Math.ceil((tripDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilTrip(calculatedDays);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Error al guardar el questionari. Si us plau, torna-ho a provar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Reset all form data before navigating to start
    resetData();
    navigate('/');
  };

  return (
    <>
      <StepContainer title="Algun missatge que ens vulguis deixar?" currentStep={4}>
        <NotesInput 
          value={data.notes}
          onChange={handleNotesChange}
        />

        <StepActions 
          onBack={handleBack}
          onComplete={handleComplete}
          showNext={false}
          showComplete={true}
          completeDisabled={isSaving}
          completeText={isSaving ? "Guardant..." : "Completar"}
        />
      </StepContainer>
      
      {showSuccess && (
        <SuccessPopup 
          daysUntilTrip={daysUntilTrip}
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
};

export default Notes;
