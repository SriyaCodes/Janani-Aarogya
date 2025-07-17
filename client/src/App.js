import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LanguageSelector from './components/LanguageSelector';
import StageSelector from './components/StageSelector';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import YogaPage from './components/YogaPage';
import AyurvedaPage from './components/AyurvedaPage';
import MemoryVault from './components/MemoryVault';
import JournalPage from './components/JournalPage';
import ProfilePage from './components/ProfilePage';
import PreConceptionYogaPage from './components/PreConceptionYogaPage';
import PregYogaPage from './components/PregYogaPage';
import PostYogaPage from './components/PostYogaPage';
import PreConceptionAyurvedaPage from './components/PreConceptionAyurvedaPage';
import PregAyurvedaPage from './components/PregAyurvedaPage';
import PostAyurvedaPage from './components/PostAyurvedaPage';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Signup />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Onboarding */}
        <Route
          path="/language-selector"
          element={user ? <LanguageSelector /> : <Navigate to="/login" />}
        />
        <Route
          path="/stage-selector"
          element={user ? <StageSelector /> : <Navigate to="/login" />}
        />

        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Pages */}
        <Route path="/yoga" element={<YogaPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage />} />
        <Route path="/memory-vault" element={<MemoryVault />} />
        <Route
          path="/journal"
          element={user ? <JournalPage /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Stage-specific Yoga & Ayurveda */}
        <Route path="/preconception-yoga" element={<PreConceptionYogaPage />} />
        <Route path="/pregnancy-yoga" element={<PregYogaPage />} />
        <Route path="/post-yoga" element={<PostYogaPage />} />
        <Route path="/preconception-ayurveda" element={<PreConceptionAyurvedaPage />} />
        <Route path="/pregnancy-ayurveda" element={<PregAyurvedaPage />} />
        <Route path="/post-ayurveda" element={<PostAyurvedaPage />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
