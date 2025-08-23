import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuestionnaireData {
  selectedUser: string;
  firstLocation: { lat: number; lng: number } | null;
  secondLocation: { lat: number; lng: number } | null;
  notes: string;
}

interface QuestionnaireContextType {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
  resetData: () => void;
}

const defaultData: QuestionnaireData = {
  selectedUser: '',
  firstLocation: null,
  secondLocation: null,
  notes: ''
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ children }) => {
  const [data, setData] = useState<QuestionnaireData>(defaultData);

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <QuestionnaireContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
