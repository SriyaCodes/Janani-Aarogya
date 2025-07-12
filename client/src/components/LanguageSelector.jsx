import React from 'react';
import { useNavigate } from 'react-router-dom';

function LanguageSelector() {
  // List of languages you want to show
  const languages = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const navigate = useNavigate();

  // Handle click on any language button
  const handleSelect = (lang) => {
    // 1) Save the choice in localStorage for now
    localStorage.setItem('lang', lang);
    // 2) Move to the next screen
    navigate('/stage');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        अपनी भाषा चुनें / Choose your language
      </h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => handleSelect(l.code)}
            className="py-3 rounded-lg bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition"
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;
