import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

function StageSelector() {
  const navigate = useNavigate();
  const selectedLanguage = localStorage.getItem('lang') || 'en';
  const languageShortCode = selectedLanguage.slice(0, 2);

  const translations = {
    en: {
      title: 'What stage are you in?',
      subtitle: 'Select your current life stage',
      note: 'Your selection will guide your personalized experience',
      stages: [
        { key: 'prepregnancy', label: 'Pre-Pregnancy' },
        { key: 'pregnancy', label: 'Pregnancy' },
        { key: 'postpartum', label: 'Postpartum' }
      ]
    },
    hi: {
      title: 'आप किस चरण में हैं?',
      subtitle: 'अपना वर्तमान जीवन चरण चुनें',
      note: 'आपका चयन आपके व्यक्तिगत अनुभव को आकार देगा',
      stages: [
        { key: 'prepregnancy', label: 'गर्भावस्था से पहले' },
        { key: 'pregnancy', label: 'गर्भावस्था' },
        { key: 'postpartum', label: 'प्रसव के बाद' }
      ]
    },
    ta: {
      title: 'நீங்கள் எந்த கட்டத்தில் இருக்கிறீர்கள்?',
      subtitle: 'உங்கள் தற்போதைய வாழ்க்கை நிலையைத் தேர்ந்தெடுக்கவும்',
      note: 'உங்கள் தேர்வு தனிப்பட்ட அனுபவத்தை உருவாக்கும்',
      stages: [
        { key: 'prepregnancy', label: 'கர்ப்பத்துக்கு முன்' },
        { key: 'pregnancy', label: 'கர்ப்பம்' },
        { key: 'postpartum', label: 'பெற்ற பிறகு' }
      ]
    },
    te: {
  title: 'మీరు ఏ దశలో ఉన్నారు?',
  subtitle: 'మీ ప్రస్తుత జీవిత దశను ఎంచుకోండి',
  note: 'మీ ఎంపిక వ్యక్తిగత అనుభవాన్ని రూపొందించడంలో సహాయపడుతుంది',
  stages: [
    { key: 'prepregnancy', label: 'గర్భధారణకు ముందు' },
    { key: 'pregnancy', label: 'గర్భధారణ' },
    { key: 'postpartum', label: 'డెలివరీ అనంతరం' }
  ]
},
kn: {
  title: 'ನೀವು ಯಾವ ಹಂತದಲ್ಲಿ ಇದ್ದೀರಿ?',
  subtitle: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಜೀವನ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  note: 'ನಿಮ್ಮ ಆಯ್ಕೆ ವೈಯಕ್ತಿಕ ಅನುಭವವನ್ನು ರೂಪಿಸುತ್ತದೆ',
  stages: [
    { key: 'prepregnancy', label: 'ಗರ್ಭಧಾರಣೆಗೆ ಮೊದಲು' },
    { key: 'pregnancy', label: 'ಗರ್ಭಧಾರಣೆ' },
    { key: 'postpartum', label: 'ಪ್ರಸವ ನಂತರ' }
  ]
},mr: {
  title: 'आपण कोणत्या टप्प्यावर आहात?',
  subtitle: 'आपली सध्याची जीवनावस्था निवडा',
  note: 'आपली निवड वैयक्तिक अनुभव तयार करण्यात मदत करेल',
  stages: [
    { key: 'prepregnancy', label: 'गर्भधारणेपूर्वी' },
    { key: 'pregnancy', label: 'गर्भधारणा' },
    { key: 'postpartum', label: 'प्रसवानंतर' }
  ]
}
,gu: {
  title: 'તમે કયા ટપ્પા પર છો?',
  subtitle: 'તમારી વર્તમાન જીવન અવસ્થા પસંદ કરો',
  note: 'તમારો પસંદગી તમારી વ્યક્તિગત અનુભૂતિ રચવામાં મદદ કરશે',
  stages: [
    { key: 'prepregnancy', label: 'ગર્ભધારણ પહેલા' },
    { key: 'pregnancy', label: 'ગર્ભાવસ્થા' },
    { key: 'postpartum', label: 'પ્રસૂતિ પછી' }
  ]
},
bn: {
  title: 'আপনি কোন পর্যায়ে আছেন?',
  subtitle: 'আপনার বর্তমান জীবন পর্যায় নির্বাচন করুন',
  note: 'আপনার নির্বাচন ব্যক্তিগত অভিজ্ঞতা তৈরি করতে সহায়তা করবে',
  stages: [
    { key: 'prepregnancy', label: 'গর্ভধারণের আগে' },
    { key: 'pregnancy', label: 'গর্ভধারণ' },
    { key: 'postpartum', label: 'প্রসবের পর' }
  ]
},
ml: {
  title: 'നിങ്ങൾ ഏത് ഘട്ടത്തിലാണ്?',
  subtitle: 'നിങ്ങളുടെ നിലവിലുള്ള ജീവിത ഘട്ടം തിരഞ്ഞെടുക്കുക',
  note: 'നിങ്ങളുടെ തിരഞ്ഞെടുപ്പ് വ്യക്തിഗത അനുഭവം രൂപപ്പെടുത്തും',
  stages: [
    { key: 'prepregnancy', label: 'ഗർഭധാരണയ്ക്ക് മുമ്പ്' },
    { key: 'pregnancy', label: 'ഗർഭകാലം' },
    { key: 'postpartum', label: 'പ്രസവാനന്തരഘട്ടം' }
  ]
},pa: {
  title: 'ਤੁਸੀਂ ਕਿਸ ਪੜਾਅ ਵਿੱਚ ਹੋ?',
  subtitle: 'ਆਪਣੀ ਮੌਜੂਦਾ ਜੀਵਨ ਅਵਸਥਾ ਚੁਣੋ',
  note: 'ਤੁਹਾਡੀ ਚੋਣ ਤੁਹਾਡੇ ਨਿੱਜੀ ਅਨੁਭਵ ਨੂੰ ਆਕਾਰ ਦੇਵੇਗੀ',
  stages: [
    { key: 'prepregnancy', label: 'ਗਰਭਧਾਰਣ ਤੋਂ ਪਹਿਲਾਂ' },
    { key: 'pregnancy', label: 'ਗਰਭਾਵਸਥਾ' },
    { key: 'postpartum', label: 'ਡਿਲੀਵਰੀ ਤੋਂ ਬਾਅਦ' }
  ]
}






    // Add more languages here...
  };

  const lang = translations[languageShortCode] || translations['en'];

  const handleSelect = async (stage) => {
    try {
      localStorage.setItem('stage', stage);
      const user = auth.currentUser;
      if (!user) {
        alert("User not found. Please log in again.");
        navigate('/login');
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving stage:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-purple-900 mb-3">
          {lang.title}
        </h1>
        <p className="text-purple-700 font-medium">
          {lang.subtitle}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 w-full max-w-md"
      >
        {lang.stages.map((s) => (
          <motion.button
            key={s.key}
            variants={item}
            whileHover={{ 
              scale: 1.03,
              backgroundColor: "#7c3aed",
              boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(s.key)}
            className="py-5 px-6 rounded-xl bg-purple-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(145deg, #7c3aed, #6d28d9)" }}
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
        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {lang.note}
      </motion.div>
    </motion.div>
  );
}

export default StageSelector;
