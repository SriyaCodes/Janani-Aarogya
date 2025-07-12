import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import StageSelector from './components/StageSelector';        
import InputModeSelector from './components/InputModeSelector';
import DailyInput from './components/DailyInput';              

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageSelector />} />
        <Route path="/stage" element={<StageSelector />} />
        <Route path="/input-mode" element={<InputModeSelector />} />
        <Route path="/daily-input" element={<DailyInput />} />
      </Routes>
    </Router>
  );
}

export default App;
