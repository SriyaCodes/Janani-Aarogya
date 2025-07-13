import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function LanguageSelector() {
  const languages = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

  const handleSelect = async (lang) => {
    if (!user?.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      // Update Firestore with selected language
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { language: lang });

      // Update localStorage user object
      const updatedUser = { ...user, language: lang };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Navigate to next screen
      navigate('/stage-selector');
    } catch (err) {
      console.error("Error updating language:", err);
      alert("Failed to save language. Try again.");
    }
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
