import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionnaireProvider } from './contexts/QuestionnaireContext';
import UserSelection from './pages/UserSelection';
import Location1 from './pages/Location1';
import Location2 from './pages/Location2';
import Notes from './pages/Notes';
import './App.css';

function App() {
  return (
    <QuestionnaireProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<UserSelection />} />
            <Route path="/location-1" element={<Location1 />} />
            <Route path="/location-2" element={<Location2 />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QuestionnaireProvider>
  );
}

export default App;
