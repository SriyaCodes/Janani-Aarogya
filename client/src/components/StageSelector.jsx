import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

function StageSelector() {
  const navigate = useNavigate();

  // Determine UI language from localStorage
  const selectedLanguage = localStorage.getItem('lang') || 'en';
  const languageShortCode = selectedLanguage.slice(0, 2);

<<<<<<< Updated upstream
  // Unified translations object
  const translations = {
    en: {
      title: 'What stage are you in?',
      subtitle: 'Select your current life stage',
      note: 'Your selection will guide your personalized experience',
      stages: [
        { key: 'prepregnancy', label: 'Pre‑Pregnancy' },
        { key: 'pregnancy',     label: 'Pregnancy' },
        { key: 'postpartum',    label: 'Postpartum' }
      ]
    },
    hi: {
      title: 'आप किस चरण में हैं?',
      subtitle: 'अपना वर्तमान जीवन चरण चुनें',
      note: 'आपका चयन आपके व्यक्तिगत अनुभव को आकार देगा',
      stages: [
        { key: 'prepregnancy', label: 'गर्भावस्था से पहले' },
        { key: 'pregnancy',     label: 'गर्भावस्था' },
        { key: 'postpartum',    label: 'प्रसव के बाद' }
      ]
    },
    // …ta, te, kn, mr, gu, bn, ml, pa
  };

  const lang = translations[languageShortCode] || translations.en;
=======
  // Stage labels in different languages
  const stageTranslations = {
    'en': [
      { key: 'prepregnancy', label: 'Pre-Pregnancy' },
      { key: 'pregnancy', label: 'Pregnancy' },
      { key: 'postpartum', label: 'Postpartum' },
    ],
    'hi': [
      { key: 'prepregnancy', label: 'गर्भावस्था से पहले' },
      { key: 'pregnancy', label: 'गर्भावस्था' },
      { key: 'postpartum', label: 'प्रसव के बाद' },
    ],
    'ta': [
      { key: 'prepregnancy', label: 'கர்ப்பத்திற்கு முன்' },
      { key: 'pregnancy', label: 'கர்ப்பம்' },
      { key: 'postpartum', label: 'பிரசவத்திற்குப் பிறகு' },
    ],
    'te': [
      { key: 'prepregnancy', label: 'గర్భం తలపెట్టే ముందు' },
      { key: 'pregnancy', label: 'గర్భం' },
      { key: 'postpartum', label: 'ప్రసవానంతరం' },
    ],
    'kn': [
      { key: 'prepregnancy', label: 'ಗರ್ಭದ ಮೊದಲು' },
      { key: 'pregnancy', label: 'ಗರ್ಭಾವಸ್ಥೆ' },
      { key: 'postpartum', label: 'ಪ್ರಸವ ನಂತರ' },
    ],
    'mr': [
      { key: 'prepregnancy', label: 'गर्भधारणपूर्व' },
      { key: 'pregnancy', label: 'गर्भावस्था' },
      { key: 'postpartum', label: 'प्रसवोत्तर' },
    ],
    'bn': [
      { key: 'prepregnancy', label: 'গর্ভধারণের আগে' },
      { key: 'pregnancy', label: 'গর্ভাবস্থা' },
      { key: 'postpartum', label: 'প্রসব পরবর্তী' },
    ],
    'gu': [
      { key: 'prepregnancy', label: 'ગર્ભાવસ્થાથી પહેલું' },
      { key: 'pregnancy', label: 'ગર્ભાવસ્થા' },
      { key: 'postpartum', label: 'પ્રસૂતિ પછી' },
    ],
    'ml': [
      { key: 'prepregnancy', label: 'ഗര്‍ഭധാരണത്തിന് മുമ്പ്' },
      { key: 'pregnancy', label: 'ഗര്‍ഭകാലം' },
      { key: 'postpartum', label: 'പ്രസവാനന്തരം' },
    ],
    'pa': [
      { key: 'prepregnancy', label: 'ਗਰਭ ਤੋਂ ਪਹਿਲਾਂ' },
      { key: 'pregnancy', label: 'ਗਰਭ ਅਵਸਥਾ' },
      { key: 'postpartum', label: 'ਪ੍ਰਸਵ ਤੋਂ ਬਾਅਦ' },
    ],
  };

  const stages = stageTranslations[languageShortCode] || stageTranslations['en'];

  const titleTranslations = {
    'en': 'What stage are you in?',
    'hi': 'आप किस चरण में हैं?',
    'ta': 'நீங்கள் எந்த கட்டத்தில் இருக்கிறீர்கள்?',
    'te': 'మీరు ఏ దశలో ఉన్నారు?',
    'kn': 'ನೀವು ಯಾವ ಹಂತದಲ್ಲಿದ್ದೀರಿ?',
    'mr': 'तुम्ही कोणत्या टप्प्यात आहात?',
    'bn': 'আপনি কোন পর্যায়ে আছেন?',
    'gu': 'તમે કયા તબક્કે છો?',
    'ml': 'നിങ്ങൾ ഏത് ഘട്ടത്തിലാണ്?',
    'pa': 'ਤੁਸੀਂ ਕਿਸ ਪੜਾਅ ਵਿੱਚ ਹੋ?',
  };

  const title = titleTranslations[languageShortCode] || titleTranslations['en'];
>>>>>>> Stashed changes

  // Save user’s stage
  const handleSelect = async (stage) => {
    try {
      localStorage.setItem('stage', stage);

      const user = auth.currentUser;
      if (!user) {
        alert('User not found. Please log in again.');
        navigate('/login');
        return;
      }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

      // Optional local cache update
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      userData.stage = stage;
      localStorage.setItem('user', JSON.stringify(userData));

=======
      // Firestore update
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

=======
      // Firestore update
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

>>>>>>> Stashed changes
=======
      // Firestore update
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

>>>>>>> Stashed changes
      // Update localStorage user object too
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      userData.stage = stage;
      localStorage.setItem("user", JSON.stringify(userData));

      // Navigate to dashboard
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving stage:', err);
      alert('Something went wrong. Try again.');
    }
  };

  /* Framer‑Motion variants */
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-purple-900 mb-3">{lang.title}</h1>
        <p className="text-purple-700 font-medium">{lang.subtitle}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 w-full max-w-md"
      >
        {lang.stages.map((s) => (
          <motion.button
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">{title}</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {stages.map((s) => (
          <button
>>>>>>> Stashed changes
            key={s.key}
            variants={item}
            whileHover={{
              scale: 1.03,
              backgroundColor: '#7c3aed',
              boxShadow: '0 10px 15px -3px rgba(124,58,237,0.3)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(s.key)}
            className="py-5 px-6 rounded-xl bg-purple-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(145deg,#7c3aed,#6d28d9)' }}
          >
            <span>{s.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
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
        {lang.note}
      </motion.div>
    </motion.div>
  );
}

export default StageSelector;
