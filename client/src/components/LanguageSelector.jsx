// src/components/LanguageSelector.jsx
import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function LanguageSelector({ uid }) {
  const languages = [
    { code: 'en-IN', label: '🇬🇧 English' },
    { code: 'hi-IN', label: '🇮🇳 हिन्दी' },
    { code: 'te-IN', label: '🇮🇳 తెలుగు' },
    { code: 'ta-IN', label: '🇮🇳 தமிழ்' },
  ];

  const current = localStorage.getItem('lang') || 'en-IN';

  const handleChange = async (lang) => {
    try {
      localStorage.setItem('lang', lang);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, language: lang }));
      }

      if (uid) {
        const ref = doc(db, 'users', uid);
        await updateDoc(ref, { language: lang });
      }

      alert('Language set to: ' + lang);
    } catch (err) {
      console.error('Language update error', err);
    }
  };

  return (
    <>
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            code === current
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </>
  );
}

export default LanguageSelector;
