import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from 'firebase/auth';

function LanguageSelector() {
  const languages = [
    { code: 'hi-IN', label: 'हिन्दी', shortCode: 'hi' },
    { code: 'en-IN', label: 'English', shortCode: 'en' },
    { code: 'ta-IN', label: 'தமிழ்', shortCode: 'ta' },
    { code: 'te-IN', label: 'తెలుగు', shortCode: 'te' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ', shortCode: 'kn' },
    { code: 'mr-IN', label: 'मराठी', shortCode: 'mr' },
    { code: 'bn-IN', label: 'বাংলা', shortCode: 'bn' },
    { code: 'gu-IN', label: 'ગુજરાતી', shortCode: 'gu' },
    { code: 'ml-IN', label: 'മലയാളം', shortCode: 'ml' },
    { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', shortCode: 'pa' },
  ];

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser || JSON.parse(localStorage.getItem("user"));

  const handleSelect = async (langCode) => {
    try {
      // Save to localStorage for immediate access
      localStorage.setItem('lang', langCode);
      
      // Update Firestore if user is logged in
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { 
          language: langCode,
          languageShort: langCode.slice(0, 2) // Store both full and short code
        });
      }

      // Navigate to next screen
      navigate('/stage-selector');
    } catch (err) {
      console.error("Error updating language:", err);
      alert("Failed to save language. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        अपनी भाषा चुनें / Choose your language
      </h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="py-3 px-4 rounded-lg bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition flex items-center justify-center"
          >
            <span className="mr-2">{lang.label}</span>
            <span className="text-sm opacity-80">({lang.shortCode})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;