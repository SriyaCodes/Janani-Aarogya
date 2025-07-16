// src/components/LanguageSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

function LanguageSelector() {
  const languages = [
    { code: 'hi-IN', label: 'हिन्दी',   shortCode: 'hi' },
    { code: 'en-IN', label: 'English', shortCode: 'en' },
    { code: 'ta-IN', label: 'தமிழ்',   shortCode: 'ta' },
    { code: 'te-IN', label: 'తెలుగు',  shortCode: 'te' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ',   shortCode: 'kn' },
    { code: 'mr-IN', label: 'मराठी',   shortCode: 'mr' },
    { code: 'bn-IN', label: 'বাংলা',   shortCode: 'bn' },
    { code: 'gu-IN', label: 'ગુજરાતી', shortCode: 'gu' },
    { code: 'ml-IN', label: 'മലയാളം', shortCode: 'ml' },
    { code: 'pa-IN', label: 'ਪੰਜਾਬੀ',  shortCode: 'pa' },
  ];

  const navigate = useNavigate();
  const auth     = getAuth();
  const user     = auth.currentUser || JSON.parse(localStorage.getItem('user'));

  /* -------------------------- Select handler -------------------------- */
  const handleSelect = async (langCode) => {
    try {
      // Local cache (used by Navbar, prompts, etc.)
      localStorage.setItem('lang',       langCode);
      localStorage.setItem('langShort',  langCode.slice(0, 2));

      // Firestore sync
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          language:      langCode,
          languageShort: langCode.slice(0, 2),
        });
        // Keep local copy in sync
        const userData          = JSON.parse(localStorage.getItem('user')) || {};
        userData.language       = langCode;
        userData.languageShort  = langCode.slice(0, 2);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      navigate('/stage-selector');
    } catch (err) {
      console.error('❌ Error updating language:', err);
      alert('Failed to save language. Please try again.');
    }
  };

  /* ----------------------- Framer‑motion variants --------------------- */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  /* ------------------------------- UI -------------------------------- */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b
                 from-purple-50 via-purple-100 to-purple-200 p-6"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-purple-900 mb-3">
          Choose your language
        </h1>
        <p className="text-purple-700 font-medium">
          Select your preferred language
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 w-full max-w-md"
      >
        {[...Array(5)].map((_, row) => (
          <div key={row} className="flex gap-4 w-full">
            {languages.slice(row * 2, row * 2 + 2).map((lang) => (
              <motion.button
                key={lang.code}
                variants={item}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: '#7c3aed',
                  boxShadow:
                    '0 10px 15px -3px rgba(124, 58, 237, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(lang.code)}
                className="flex-1 py-4 px-2 rounded-xl bg-purple-700 text-white
                           text-lg font-medium flex flex-col items-center
                           justify-center shadow-lg"
                style={{
                  background:
                    'linear-gradient(145deg, #7c3aed, #6d28d9)',
                }}
              >
                <span className="text-xl font-semibold">{lang.label}</span>
                <span className="text-purple-100 text-sm opacity-90 mt-1">
                  ({lang.shortCode})
                </span>
              </motion.button>
            ))}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-purple-800 text-sm font-medium flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Your selection will be saved automatically
      </motion.div>
    </motion.div>
  );
}

export default LanguageSelector;