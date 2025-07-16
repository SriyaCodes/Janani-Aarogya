import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      localStorage.setItem('lang', langCode);

=======
      // ✅ Store in localStorage (used by Navbar & Gemini prompts)
      localStorage.setItem('lang', langCode);
      localStorage.setItem('langShort', langCode.slice(0, 2));  // optional

      // ✅ Update Firestore
>>>>>>> Stashed changes
=======
      // ✅ Store in localStorage (used by Navbar & Gemini prompts)
      localStorage.setItem('lang', langCode);
      localStorage.setItem('langShort', langCode.slice(0, 2));  // optional

      // ✅ Update Firestore
>>>>>>> Stashed changes
=======
      // ✅ Store in localStorage (used by Navbar & Gemini prompts)
      localStorage.setItem('lang', langCode);
      localStorage.setItem('langShort', langCode.slice(0, 2));  // optional

      // ✅ Update Firestore
>>>>>>> Stashed changes
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          language: langCode,
          languageShort: langCode.slice(0, 2)
        });

        // Update localStorage user object
        const userData = JSON.parse(localStorage.getItem("user")) || {};
        userData.language = langCode;
        localStorage.setItem("user", JSON.stringify(userData));
      }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
      // ✅ Navigate to stage selector
>>>>>>> Stashed changes
=======
      // ✅ Navigate to stage selector
>>>>>>> Stashed changes
=======
      // ✅ Navigate to stage selector
>>>>>>> Stashed changes
      navigate('/stage-selector');
    } catch (err) {
      console.error("❌ Error updating language:", err);
      alert("Failed to save language. Please try again.");
    }
  };

<<<<<<< Updated upstream
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 p-6"
    >
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-purple-900 mb-3">
          Choose your language
        </h1>
        <p className="text-purple-700 font-medium">Select your preferred language</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 w-full max-w-md"
      >
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 w-full">
            {languages.slice(rowIndex * 2, rowIndex * 2 + 2).map((lang) => (
              <motion.button
                key={lang.code}
                variants={item}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(lang.code)}
                className="flex-1 py-4 px-2 rounded-xl bg-purple-700 text-white text-lg font-medium transition-all flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(145deg, #7c3aed, #6d28d9)"
                }}
              >
                <span className="text-xl font-semibold">{lang.label}</span>
                <span className="text-purple-100 text-sm opacity-90 mt-1">({lang.shortCode})</span>
              </motion.button>
            ))}
          </div>
=======
  return (
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">
        अपनी भाषा चुनें / Choose your language
      </h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="py-3 px-4 rounded-xl bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition flex items-center justify-center shadow-md"
          >
            <span className="mr-2">{lang.label}</span>
            <span className="text-sm opacity-80">({lang.shortCode})</span>
          </button>
>>>>>>> Stashed changes
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-purple-800 text-sm font-medium"
      >
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Your selection will be saved automatically
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LanguageSelector;
