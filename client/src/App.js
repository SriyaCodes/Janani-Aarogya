// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StageSelector from './components/StageSelector';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import YogaPage from './components/YogaPage';
import AyurvedaPage from './components/AyurvedaPage';
import MemoryVault from './components/MemoryVault';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isNewUser = user && (!user.stage || user.stage === '');

  return (
    <Router>
      <Routes>
        {/* First route: always go to signup first */}
        <Route
          path="/"
          element={
            user ? (
              isNewUser ? <Navigate to="/stage-selector" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Post-auth routes */}
        <Route path="/stage-selector" element={<StageSelector />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yoga" element={<YogaPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage />} />
        <Route path="/memory-vault" element={<MemoryVault />} />
      </Routes>
    </Router>
  );
}

export default App;
