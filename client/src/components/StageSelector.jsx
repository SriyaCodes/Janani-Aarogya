import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

function StageSelector() {
  const navigate = useNavigate();
  const selectedLanguage = localStorage.getItem('lang') || 'en-IN';
  const languageShortCode = selectedLanguage.slice(0, 2);

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
      { key: 'prepregnancy', label: 'గర్భం తీసుకోవడానికి ముందు' },
      { key: 'pregnancy', label: 'గర్భం' },
      { key: 'postpartum', label: 'ప్రసవానంతర' },
    ],
    'kn': [
      { key: 'prepregnancy', label: 'ಗರ್ಭಧಾರಣೆಗೆ ಮುಂಚೆ' },
      { key: 'pregnancy', label: 'ಗರ್ಭಧಾರಣೆ' },
      { key: 'postpartum', label: 'ಪ್ರಸವಾನಂತರ' },
    ],
    'mr': [
      { key: 'prepregnancy', label: 'गर्भधारणेपूर्वी' },
      { key: 'pregnancy', label: 'गर्भावस्था' },
      { key: 'postpartum', label: 'प्रसूतिनंतर' },
    ],
    'bn': [
      { key: 'prepregnancy', label: 'গর্ভধারণের আগে' },
      { key: 'pregnancy', label: 'গর্ভাবস্থা' },
      { key: 'postpartum', label: 'প্রসব পরবর্তী' },
    ],
    'gu': [
      { key: 'prepregnancy', label: 'ગર્ભાવસ્થા પહેલાં' },
      { key: 'pregnancy', label: 'ગર્ભાવસ્થા' },
      { key: 'postpartum', label: 'પ્રસૂતિ પછી' },
    ],
    'ml': [
      { key: 'prepregnancy', label: 'ഗർഭധാരണത്തിനു മുൻപ്' },
      { key: 'pregnancy', label: 'ഗർഭധാരണം' },
      { key: 'postpartum', label: 'പ്രസവാനന്തരം' },
    ],
    'pa': [
      { key: 'prepregnancy', label: 'ਗਰਭ ਅਵਸਥਾ ਤੋਂ ਪਹਿਲਾਂ' },
      { key: 'pregnancy', label: 'ਗਰਭ ਅਵਸਥਾ' },
      { key: 'postpartum', label: 'ਪ੍ਰਸੂਤੀ ਤੋਂ ਬਾਅਦ' },
    ],
  };

  // Fallback to English if language not found
  const stages = stageTranslations[languageShortCode] || stageTranslations['en'];

  // Title translations
  const titleTranslations = {
    'en': 'What stage are you in?',
    'hi': 'आप किस चरण में हैं?',
    'ta': 'நீங்கள் எந்த கட்டத்தில் இருக்கிறீர்கள்?',
    'te': 'మీరు ఏ దశలో ఉన్నారు?',
    'kn': 'ನೀವು ಯಾವ ಹಂತದಲ್ಲಿದ್ದೀರಿ?',
    'mr': 'तुम्ही कोणत्या टप्प्यावर आहात?',
    'bn': 'আপনি কোন পর্যায়ে আছেন?',
    'gu': 'તમે કયા તબક્કે છો?',
    'ml': 'നിങ്ങൾ ഏത് ഘട്ടത്തിലാണ്?',
    'pa': 'ਤੁਸੀਂ ਕਿਸ ਪੜਾਅ ਵਿੱਚ ਹੋ?',
  };

  const title = titleTranslations[languageShortCode] || titleTranslations['en'];

  const handleSelect = async (stage) => {
    try {
      localStorage.setItem('stage', stage);

      const user = auth.currentUser;
      if (!user) {
        alert("User not found. Please log in again.");
        navigate('/login');
        return;
      }

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Error saving stage:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {title}
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => handleSelect(s.key)}
            className="py-4 px-6 rounded-xl bg-rose-600 text-white text-lg font-semibold shadow hover:bg-rose-700 transition"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StageSelector;