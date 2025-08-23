import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../contexts/QuestionnaireContext';
import StepContainer from '../components/StepContainer';
import UserDropdown from '../components/UserDropdown';
import StepActions from '../components/StepActions';

const UserSelection = () => {
  const { data, updateData } = useQuestionnaire();
  const navigate = useNavigate();

  const handleUserSelect = (userName: string) => {
    updateData({ selectedUser: userName });
  };

  const handleNext = () => {
    if (data.selectedUser) {
      navigate('/location-1');
    }
  };

  return (
    <StepContainer title="Viatge sorpresa 🤫" currentStep={1}>
      <UserDropdown 
        selectedUser={data.selectedUser}
        onUserSelect={handleUserSelect}
      />
      
      <StepActions 
        onNext={handleNext}
        nextDisabled={!data.selectedUser}
        showBack={false}
      />
    </StepContainer>
  );
};

export default UserSelection;
