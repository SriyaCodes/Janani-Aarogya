import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import StageSelector from './components/StageSelector';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import YogaPage from './components/YogaPage';
import AyurvedaPage from './components/AyurvedaPage';
import MemoryVault from './components/MemoryVault';

function App() {
  const user = JSON.parse(localStorage.getItem('user')); // Later: replace with Firebase Auth state
  const isNewUser = !user?.stage || !user?.language;

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Onboarding Flow for New User */}
        <Route path="/language-selector" element={<LanguageSelector />} />
        <Route path="/stage-selector" element={<StageSelector />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yoga" element={<YogaPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage />} />
        <Route path="/memory-vault" element={<MemoryVault />} />
       

        {/* Default redirect */}
        <Route
          path="/"
          element={
            user ? (
              isNewUser ? <Navigate to="/language-selector" /> : <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
