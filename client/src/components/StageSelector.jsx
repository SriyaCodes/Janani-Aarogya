import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

function StageSelector() {
  const navigate = useNavigate();
  const selectedLanguage = localStorage.getItem('lang') || 'en';
  const languageShortCode = selectedLanguage.slice(0, 2);

  // Unified translations object
  const translations = {
    en: {
      title: 'Select Your Stage',
      subtitle: 'This helps us personalize your care.',
      stages: {
        preconception: 'Preconception',
        pregnancy: 'Pregnancy',
        post: 'Postpartum',
      },
      next: 'Next',
    },
    hi: {
      title: 'अपना चरण चुनें',
      subtitle: 'यह हमें आपकी देखभाल को वैयक्तिकृत करने में मदद करता है।',
      stages: {
        preconception: 'गर्भधारण से पहले',
        pregnancy: 'गर्भावस्था',
        post: 'प्रसवोत्तर',
      },
      next: 'आगे बढ़ें',
    },
  };

  const t = translations[languageShortCode] || translations.en;

  const handleStageSelect = async (stage) => {
    const user = getAuth().currentUser;
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });
      localStorage.setItem('stage', stage);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <motion.h1 className="text-3xl font-bold mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {t.title}
      </motion.h1>
      <p className="mb-8 text-gray-600">{t.subtitle}</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button onClick={() => handleStageSelect('preconception')} className="p-3 bg-pink-500 text-white rounded-xl">
          {t.stages.preconception}
        </button>
        <button onClick={() => handleStageSelect('pregnancy')} className="p-3 bg-pink-500 text-white rounded-xl">
          {t.stages.pregnancy}
        </button>
        <button onClick={() => handleStageSelect('post')} className="p-3 bg-pink-500 text-white rounded-xl">
          {t.stages.post}
        </button>
      </div>
    </div>
  );
}

export default StageSelector;
