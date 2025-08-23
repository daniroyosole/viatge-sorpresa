import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';

export interface QuestionnaireResponse {
  name: string;
  lat_1: number;
  lon_1: number;
  lat_2: number;
  lon_2: number;
  notes: string;
  timestamp: number;
}

export const saveQuestionnaireResponse = async (response: QuestionnaireResponse): Promise<void> => {
  try {
    // Create the respostes field if it doesn't exist
    const respostesRef = ref(database, 'respostes');
    const newResponseRef = push(respostesRef);
    
    // This will automatically create the 'respostes' field if it doesn't exist
    await set(newResponseRef, response);
    
    console.log('Questionnaire response saved successfully:', response);
  } catch (error) {
    console.error('Error saving questionnaire response:', error);
    throw error;
  }
};
