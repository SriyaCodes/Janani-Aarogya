import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ... all your other component imports
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
    // Wrap everything in a React Fragment <> ... </>
    <>
      <Router>
        <Routes>
          {/* ... all your <Route> components remain unchanged ... */}
          <Route path="/post-ayurveda" element={<PostAyurvedaPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* 👇 ADD THIS FOOTER FOR ATTRIBUTION 👇 */}
      <footer style={{ 
          textAlign: 'center', 
          padding: '10px', 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#888' 
        }}>
        <a 
          href="https://responsivevoice.org" 
          title="ResponsiveVoice - Text to Speech" 
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Speech by ResponsiveVoice
        </a>
      </footer>
    </>
  );
}

export default App;