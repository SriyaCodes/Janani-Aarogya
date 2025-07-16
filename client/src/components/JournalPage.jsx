// src/pages/JournalPage.jsx
import React, { useEffect, useState } from 'react';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp,
  doc,
  setDoc,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  getDoc,
=======
  getDoc
>>>>>>> Stashed changes
=======
  getDoc
>>>>>>> Stashed changes
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import './journal.css'; // tape‑and‑paper styles

/* ───────────────────────── HELPER ────────────────────────── */
=======

// Helper to skip trivial messages like "hi"
>>>>>>> Stashed changes
=======

// Helper to skip trivial messages like "hi"
>>>>>>> Stashed changes
const isTrivial = (text) =>
  !text ||
  text.trim().length < 3 ||
  /^(hi|hello|hey|namaste|hola)$/i.test(text.trim());

<<<<<<< Updated upstream
<<<<<<< Updated upstream
/* ───────────── UI LABEL TRANSLATIONS (add more anytime) ───────────── */
=======
// UI Translations only
>>>>>>> Stashed changes
=======
// UI Translations only
>>>>>>> Stashed changes
const journalUITranslations = {
  'en-IN': {
    title: 'Your Daily Journal',
    entriesToday: 'Entries detected today:',
    createButton: "Create Today's Journal",
    generating: 'Generating...',
    journalTitle: "Today's Journal",
    themeLabel: 'Choose Paper Style',
    noEntriesError: 'Please interact at least once today to generate your journal.',
    noLanguageError: 'Language not set yet. Please wait or refresh.',
    trivialError: 'Todays messages are just greetings. Have a deeper chat, then try again!',
    successMessage: '✅ Journal created!',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    errorMessage: 'Error generating journal. Please try again.',
    journal: 'Journal',
    memoryVault: 'Memory Vault',
    ayurveda: 'Ayurveda',
    yoga: 'Yoga',
  },
  /* …hi‑IN, ta‑IN, te‑IN, kn‑IN, mr‑IN, bn‑IN, gu‑IN, ml‑IN, pa‑IN (unchanged) … */
  /* For brevity those entries are identical to the ones you already had. */
};

/* ─────────────────────── NAVBAR (pure UI) ─────────────────────── */
const Navbar = ({ translations }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-rose-200">
      <h1 className="text-2xl font-extrabold text-rose-600 tracking-wide">
        Janani Aarogya
      </h1>
      <div className="flex gap-4 items-center text-sm font-semibold text-gray-700">
        <button onClick={() => navigate('/journal')} className="hover:text-rose-600">
          {translations.journal || 'Journal'}
        </button>
        <button onClick={() => navigate('/memory-vault')} className="hover:text-rose-600">
          {translations.memoryVault || 'Memory Vault'}
        </button>
        <button onClick={() => navigate('/ayurveda')} className="hover:text-rose-600">
          {translations.ayurveda || 'Ayurveda'}
        </button>
        <button onClick={() => navigate('/yoga')} className="hover:text-rose-600">
          {translations.yoga || 'Yoga'}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:ring hover:ring-rose-300"
        >
          👤
        </button>
      </div>
    </nav>
  );
=======
    errorMessage: 'Error generating journal. Please try again.'
  },
  'hi-IN': {
    title: 'आपकी दैनिक डायरी',
    entriesToday: 'आज के संवाद:',
    createButton: "आज की डायरी बनाएं",
    generating: 'बना रहा है...',
    journalTitle: "आज की डायरी",
    noEntriesError: 'कृपया जर्नल बनाने के लिए आज कम से कम एक बार बातचीत करें।',
    noLanguageError: 'भाषा अभी सेट नहीं हुई है। कृपया प्रतीक्षा करें या पृष्ठ को ताज़ा करें।',
    trivialError: 'आज के संवाद केवल अभिवादन हैं। कृपया कुछ गहरी बातचीत करके फिर कोशिश करें!',
    successMessage: '✅ डायरी बन गई!',
    errorMessage: 'डायरी बनाने में त्रुटि। कृपया पुनः प्रयास करें।'
  },
  'ta-IN': {
    title: 'உங்கள் தினசரி பத்திரிகை',
    entriesToday: 'இன்றைய உரையாடல்கள்:',
    createButton: "இன்றைய பத்திரிகையை உருவாக்கவும்",
    generating: 'உருவாக்குகிறது...',
    journalTitle: "இன்றைய பத்திரிகை",
    noEntriesError: 'உங்கள் பத்திரிகையை உருவாக்க இன்று குறைந்தது ஒரு முறையாவது தொடர்பு கொள்ளவும்.',
    noLanguageError: 'மொழி இன்னும் அமைக்கப்படவில்லை. காத்திருக்கவும் அல்லது பக்கத்தைப் புதுப்பிக்கவும்.',
    trivialError: 'இன்றைய செய்திகள் வாழ்த்துக்கள் மட்டுமே. ஒரு ஆழமான உரையாடலைக் கொண்டிருங்கள், பிறகு முயற்சிக்கவும்!',
    successMessage: '✅ பத்திரிகை உருவாக்கப்பட்டது!',
    errorMessage: 'பத்திரிகை உருவாக்குவதில் பிழை. மீண்டும் முயற்சிக்கவும்.'
  },'te-IN': {
  title: 'మీ రోజువారీ జర్నల్',
  entriesToday: 'ఈరోజు చర్చలు:',
  createButton: "ఈరోజు జర్నల్‌ను సృష్టించండి",
  generating: 'సృష్టిస్తోంది...',
  journalTitle: "ఈరోజు జర్నల్",
  noEntriesError: 'ఈరోజు మీ జర్నల్‌ను సృష్టించడానికి కనీసం ఒకసారి సంభాషణ చేయండి.',
  noLanguageError: 'భాష ఇంకా సెటప్ కాలేదు. దయచేసి వేచి ఉండండి లేదా పేజీని రిఫ్రెష్ చేయండి.',
  trivialError: 'ఈరోజు వార్తలు కేవలం శుభాకాంక్షలే. లోతైన సంభాషణను కొనసాగించండి, తర్వాత మళ్లీ ప్రయత్నించండి!',
  successMessage: '✅ జర్నల్ విజయవంతంగా సృష్టించబడింది!',
  errorMessage: 'జర్నల్ సృష్టించడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.'
},'kn-IN': {
  title: 'ನಿಮ್ಮ ದೈನಂದಿನ ಪತ್ರಿಕೆ',
  entriesToday: 'ಇಂದಿನ ಸಂವಹನಗಳು:',
  createButton: "ಇಂದಿನ ಪತ್ರಿಕೆಯನ್ನು ರಚಿಸಿ",
  generating: 'ರಚಿಸಲಾಗುತ್ತಿದೆ...',
  journalTitle: "ಇಂದಿನ ಪತ್ರಿಕೆ",
  noEntriesError: 'ಇಂದಿನ ಪತ್ರಿಕೆಯನ್ನು ರಚಿಸಲು ಕನಿಷ್ಠ ಒಂದು ಬಾರಿ ಸಂವಹನ ನಡೆಸಿರಿ.',
  noLanguageError: 'ಭಾಷೆಯನ್ನು ಇನ್ನೂ ಹೊಂದಿಸಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಕಾಯಿರಿ ಅಥವಾ ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ.',
  trivialError: 'ಇಂದಿನ ಸುದ್ದಿಗಳು ಕೇವಲ ಶುಭಾಶಯಗಳಷ್ಟೆ. ಆಳವಾದ ಸಂವಹನವನ್ನು ಮಾಡಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!',
  successMessage: '✅ ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
  errorMessage: 'ಪತ್ರಿಕೆ ರಚಿಸುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
},'mr-IN': {
  title: 'तुमची दैनंदिन जर्नल',
  entriesToday: 'आजच्या संवादांची संख्या:',
  createButton: "आजचा जर्नल तयार करा",
  generating: 'तयार करत आहे...',
  journalTitle: "आजचा जर्नल",
  noEntriesError: 'आजचा जर्नल तयार करण्यासाठी कमीत कमी एक संवाद आवश्यक आहे.',
  noLanguageError: 'भाषा अजून सेट केलेली नाही. कृपया थोडा वेळ थांबा किंवा पृष्ठ रीफ्रेश करा.',
  trivialError: 'आजच्या बातम्या केवळ शुभेच्छा आहेत. सखोल संवाद साधा आणि पुन्हा प्रयत्न करा!',
  successMessage: '✅ जर्नल यशस्वीरित्या तयार झाला आहे!',
  errorMessage: 'जर्नल तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
},'bn-IN': {
  title: 'আপনার দৈনিক জার্নাল',
  entriesToday: 'আজকের কথোপকথনের সংখ্যা:',
  createButton: "আজকের জার্নাল তৈরি করুন",
  generating: 'তৈরি করা হচ্ছে...',
  journalTitle: "আজকের জার্নাল",
  noEntriesError: 'আজকের জার্নাল তৈরি করতে অন্তত একটি কথোপকথন প্রয়োজন।',
  noLanguageError: 'ভাষা এখনো নির্ধারিত হয়নি। অনুগ্রহ করে অপেক্ষা করুন বা পৃষ্ঠাটি রিফ্রেশ করুন।',
  trivialError: 'আজকের খবর শুধুই শুভেচ্ছা। আরও গভীর কথোপকথন করুন এবং পরে আবার চেষ্টা করুন!',
  successMessage: '✅ জার্নাল সফলভাবে তৈরি হয়েছে!',
  errorMessage: 'জার্নাল তৈরি করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
}
,'gu-IN': {
  title: 'તમારું દૈનિક જર્નલ',
  entriesToday: 'આજની વાતચીતોની સંખ્યા:',
  createButton: "આજનું જર્નલ બનાવો",
  generating: 'બનાવાઈ રહ્યું છે...',
  journalTitle: "આજનું જર્નલ",
  noEntriesError: 'આજનું જર્નલ બનાવવા માટે ઓછામાં ઓછી એક વાર વાતચીત જરૂરી છે.',
  noLanguageError: 'ભાષા હજી સુધી સુયોજિત નથી. કૃપા કરીને રાહ જુઓ અથવા પેજને રિફ્રેશ કરો.',
  trivialError: 'આજની માહિતી ફક્ત શુભેચ્છાઓ છે. વધુ ગાઢ સંવાદ કરો અને પછી ફરી પ્રયાસ કરો!',
  successMessage: '✅ જર્નલ સફળતાપૂર્વક બનાવાયું છે!',
  errorMessage: 'જર્નલ બનાવવામાં ભૂલ આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
},'ml-IN': {
  title: 'നിങ്ങളുടെ ദിവസേന ജേർണൽ',
  entriesToday: 'ഇന്നത്തെ സംഭാഷണങ്ങൾ:',
  createButton: "ഇന്നത്തെ ജേർണൽ സൃഷ്ടിക്കുക",
  generating: 'സൃഷ്ടിക്കുന്നു...',
  journalTitle: "ഇന്നത്തെ ജേർണൽ",
  noEntriesError: 'ജേർണൽ സൃഷ്ടിക്കാൻ ഇന്ന് കുറഞ്ഞത് ഒരു സംഭാഷണം ഉണ്ടായിരിക്കണം.',
  noLanguageError: 'ഭാഷ ഇനിയും ക്രമീകരിച്ചിട്ടില്ല. ദയവായി കാത്തിരിക്കുക അല്ലെങ്കിൽ പേജ് റിഫ്രഷ് ചെയ്യുക.',
  trivialError: 'ഇന്നത്തെ വിവരങ്ങൾ വെറും ആശംസകളാണ്. കൂടുതൽ ആഴമുള്ള സംഭാഷണം നടത്തിയ ശേഷം വീണ്ടും ശ്രമിക്കുക!',
  successMessage: '✅ ജേർണൽ വിജയകരമായി സൃഷ്ടിച്ചു!',
  errorMessage: 'ജേർണൽ സൃഷ്ടിക്കുമ്പോൾ പിശക്. വീണ്ടും ശ്രമിക്കുക.'
},'pa-IN': {
  title: 'ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਜਰਨਲ',
  entriesToday: 'ਅੱਜ ਦੀਆਂ ਗੱਲਬਾਤਾਂ:',
  createButton: 'ਅੱਜ ਦਾ ਜਰਨਲ ਬਣਾਓ',
  generating: 'ਬਣਾ ਰਹੇ ਹਾਂ...',
  journalTitle: 'ਅੱਜ ਦਾ ਜਰਨਲ',
  noEntriesError: 'ਜਰਨਲ ਬਣਾਉਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਗੱਲਬਾਤ ਕਰੋ।',
  noLanguageError: 'ਭਾਸ਼ਾ ਹਜੇ ਤੱਕ ਸੈਟ ਨਹੀਂ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ ਜਾਂ ਪੇਜ ਨੂੰ ਰੀਫ੍ਰੈਸ਼ ਕਰੋ।',
  trivialError: 'ਅੱਜ ਦੀਆਂ ਜਾਣਕਾਰੀਆਂ ਸਿਰਫ ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਹਨ। ਥੋੜ੍ਹੀ ਹੋਰ ਗੰਭੀਰ ਗੱਲਬਾਤ ਕਰੋ, ਫਿਰ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!',
  successMessage: '✅ ਜਰਨਲ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ!',
  errorMessage: 'ਜਰਨਲ ਬਣਾਉਣ ਵਿੱਚ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
}

=======
    errorMessage: 'Error generating journal. Please try again.'
  },
  'hi-IN': {
    title: 'आपकी दैनिक डायरी',
    entriesToday: 'आज के संवाद:',
    createButton: "आज की डायरी बनाएं",
    generating: 'बना रहा है...',
    journalTitle: "आज की डायरी",
    noEntriesError: 'कृपया जर्नल बनाने के लिए आज कम से कम एक बार बातचीत करें।',
    noLanguageError: 'भाषा अभी सेट नहीं हुई है। कृपया प्रतीक्षा करें या पृष्ठ को ताज़ा करें।',
    trivialError: 'आज के संवाद केवल अभिवादन हैं। कृपया कुछ गहरी बातचीत करके फिर कोशिश करें!',
    successMessage: '✅ डायरी बन गई!',
    errorMessage: 'डायरी बनाने में त्रुटि। कृपया पुनः प्रयास करें।'
  },
  'ta-IN': {
    title: 'உங்கள் தினசரி பத்திரிகை',
    entriesToday: 'இன்றைய உரையாடல்கள்:',
    createButton: "இன்றைய பத்திரிகையை உருவாக்கவும்",
    generating: 'உருவாக்குகிறது...',
    journalTitle: "இன்றைய பத்திரிகை",
    noEntriesError: 'உங்கள் பத்திரிகையை உருவாக்க இன்று குறைந்தது ஒரு முறையாவது தொடர்பு கொள்ளவும்.',
    noLanguageError: 'மொழி இன்னும் அமைக்கப்படவில்லை. காத்திருக்கவும் அல்லது பக்கத்தைப் புதுப்பிக்கவும்.',
    trivialError: 'இன்றைய செய்திகள் வாழ்த்துக்கள் மட்டுமே. ஒரு ஆழமான உரையாடலைக் கொண்டிருங்கள், பிறகு முயற்சிக்கவும்!',
    successMessage: '✅ பத்திரிகை உருவாக்கப்பட்டது!',
    errorMessage: 'பத்திரிகை உருவாக்குவதில் பிழை. மீண்டும் முயற்சிக்கவும்.'
  },'te-IN': {
  title: 'మీ రోజువారీ జర్నల్',
  entriesToday: 'ఈరోజు చర్చలు:',
  createButton: "ఈరోజు జర్నల్‌ను సృష్టించండి",
  generating: 'సృష్టిస్తోంది...',
  journalTitle: "ఈరోజు జర్నల్",
  noEntriesError: 'ఈరోజు మీ జర్నల్‌ను సృష్టించడానికి కనీసం ఒకసారి సంభాషణ చేయండి.',
  noLanguageError: 'భాష ఇంకా సెటప్ కాలేదు. దయచేసి వేచి ఉండండి లేదా పేజీని రిఫ్రెష్ చేయండి.',
  trivialError: 'ఈరోజు వార్తలు కేవలం శుభాకాంక్షలే. లోతైన సంభాషణను కొనసాగించండి, తర్వాత మళ్లీ ప్రయత్నించండి!',
  successMessage: '✅ జర్నల్ విజయవంతంగా సృష్టించబడింది!',
  errorMessage: 'జర్నల్ సృష్టించడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.'
},'kn-IN': {
  title: 'ನಿಮ್ಮ ದೈನಂದಿನ ಪತ್ರಿಕೆ',
  entriesToday: 'ಇಂದಿನ ಸಂವಹನಗಳು:',
  createButton: "ಇಂದಿನ ಪತ್ರಿಕೆಯನ್ನು ರಚಿಸಿ",
  generating: 'ರಚಿಸಲಾಗುತ್ತಿದೆ...',
  journalTitle: "ಇಂದಿನ ಪತ್ರಿಕೆ",
  noEntriesError: 'ಇಂದಿನ ಪತ್ರಿಕೆಯನ್ನು ರಚಿಸಲು ಕನಿಷ್ಠ ಒಂದು ಬಾರಿ ಸಂವಹನ ನಡೆಸಿರಿ.',
  noLanguageError: 'ಭಾಷೆಯನ್ನು ಇನ್ನೂ ಹೊಂದಿಸಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಕಾಯಿರಿ ಅಥವಾ ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ.',
  trivialError: 'ಇಂದಿನ ಸುದ್ದಿಗಳು ಕೇವಲ ಶುಭಾಶಯಗಳಷ್ಟೆ. ಆಳವಾದ ಸಂವಹನವನ್ನು ಮಾಡಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!',
  successMessage: '✅ ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
  errorMessage: 'ಪತ್ರಿಕೆ ರಚಿಸುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
},'mr-IN': {
  title: 'तुमची दैनंदिन जर्नल',
  entriesToday: 'आजच्या संवादांची संख्या:',
  createButton: "आजचा जर्नल तयार करा",
  generating: 'तयार करत आहे...',
  journalTitle: "आजचा जर्नल",
  noEntriesError: 'आजचा जर्नल तयार करण्यासाठी कमीत कमी एक संवाद आवश्यक आहे.',
  noLanguageError: 'भाषा अजून सेट केलेली नाही. कृपया थोडा वेळ थांबा किंवा पृष्ठ रीफ्रेश करा.',
  trivialError: 'आजच्या बातम्या केवळ शुभेच्छा आहेत. सखोल संवाद साधा आणि पुन्हा प्रयत्न करा!',
  successMessage: '✅ जर्नल यशस्वीरित्या तयार झाला आहे!',
  errorMessage: 'जर्नल तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
},'bn-IN': {
  title: 'আপনার দৈনিক জার্নাল',
  entriesToday: 'আজকের কথোপকথনের সংখ্যা:',
  createButton: "আজকের জার্নাল তৈরি করুন",
  generating: 'তৈরি করা হচ্ছে...',
  journalTitle: "আজকের জার্নাল",
  noEntriesError: 'আজকের জার্নাল তৈরি করতে অন্তত একটি কথোপকথন প্রয়োজন।',
  noLanguageError: 'ভাষা এখনো নির্ধারিত হয়নি। অনুগ্রহ করে অপেক্ষা করুন বা পৃষ্ঠাটি রিফ্রেশ করুন।',
  trivialError: 'আজকের খবর শুধুই শুভেচ্ছা। আরও গভীর কথোপকথন করুন এবং পরে আবার চেষ্টা করুন!',
  successMessage: '✅ জার্নাল সফলভাবে তৈরি হয়েছে!',
  errorMessage: 'জার্নাল তৈরি করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
}
,'gu-IN': {
  title: 'તમારું દૈનિક જર્નલ',
  entriesToday: 'આજની વાતચીતોની સંખ્યા:',
  createButton: "આજનું જર્નલ બનાવો",
  generating: 'બનાવાઈ રહ્યું છે...',
  journalTitle: "આજનું જર્નલ",
  noEntriesError: 'આજનું જર્નલ બનાવવા માટે ઓછામાં ઓછી એક વાર વાતચીત જરૂરી છે.',
  noLanguageError: 'ભાષા હજી સુધી સુયોજિત નથી. કૃપા કરીને રાહ જુઓ અથવા પેજને રિફ્રેશ કરો.',
  trivialError: 'આજની માહિતી ફક્ત શુભેચ્છાઓ છે. વધુ ગાઢ સંવાદ કરો અને પછી ફરી પ્રયાસ કરો!',
  successMessage: '✅ જર્નલ સફળતાપૂર્વક બનાવાયું છે!',
  errorMessage: 'જર્નલ બનાવવામાં ભૂલ આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
},'ml-IN': {
  title: 'നിങ്ങളുടെ ദിവസേന ജേർണൽ',
  entriesToday: 'ഇന്നത്തെ സംഭാഷണങ്ങൾ:',
  createButton: "ഇന്നത്തെ ജേർണൽ സൃഷ്ടിക്കുക",
  generating: 'സൃഷ്ടിക്കുന്നു...',
  journalTitle: "ഇന്നത്തെ ജേർണൽ",
  noEntriesError: 'ജേർണൽ സൃഷ്ടിക്കാൻ ഇന്ന് കുറഞ്ഞത് ഒരു സംഭാഷണം ഉണ്ടായിരിക്കണം.',
  noLanguageError: 'ഭാഷ ഇനിയും ക്രമീകരിച്ചിട്ടില്ല. ദയവായി കാത്തിരിക്കുക അല്ലെങ്കിൽ പേജ് റിഫ്രഷ് ചെയ്യുക.',
  trivialError: 'ഇന്നത്തെ വിവരങ്ങൾ വെറും ആശംസകളാണ്. കൂടുതൽ ആഴമുള്ള സംഭാഷണം നടത്തിയ ശേഷം വീണ്ടും ശ്രമിക്കുക!',
  successMessage: '✅ ജേർണൽ വിജയകരമായി സൃഷ്ടിച്ചു!',
  errorMessage: 'ജേർണൽ സൃഷ്ടിക്കുമ്പോൾ പിശക്. വീണ്ടും ശ്രമിക്കുക.'
},'pa-IN': {
  title: 'ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਜਰਨਲ',
  entriesToday: 'ਅੱਜ ਦੀਆਂ ਗੱਲਬਾਤਾਂ:',
  createButton: 'ਅੱਜ ਦਾ ਜਰਨਲ ਬਣਾਓ',
  generating: 'ਬਣਾ ਰਹੇ ਹਾਂ...',
  journalTitle: 'ਅੱਜ ਦਾ ਜਰਨਲ',
  noEntriesError: 'ਜਰਨਲ ਬਣਾਉਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਾਰ ਗੱਲਬਾਤ ਕਰੋ।',
  noLanguageError: 'ਭਾਸ਼ਾ ਹਜੇ ਤੱਕ ਸੈਟ ਨਹੀਂ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ ਜਾਂ ਪੇਜ ਨੂੰ ਰੀਫ੍ਰੈਸ਼ ਕਰੋ।',
  trivialError: 'ਅੱਜ ਦੀਆਂ ਜਾਣਕਾਰੀਆਂ ਸਿਰਫ ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਹਨ। ਥੋੜ੍ਹੀ ਹੋਰ ਗੰਭੀਰ ਗੱਲਬਾਤ ਕਰੋ, ਫਿਰ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!',
  successMessage: '✅ ਜਰਨਲ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ!',
  errorMessage: 'ਜਰਨਲ ਬਣਾਉਣ ਵਿੱਚ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
}

>>>>>>> Stashed changes





  // Add other languages as needed
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
};

/* ─────────────────────── MAIN PAGE ─────────────────────── */
const JournalPage = () => {
  /* ─── state ─── */
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en-IN');
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [theme, setTheme] = useState('plain');          // 🆕 paper theme
  const themes = ['plain', 'grid', 'sticky'];
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  const todayISO = new Date().toISOString().split('T')[0];
  const t = journalUITranslations[lang] || journalUITranslations['en-IN'];

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  /* ─── auth + language + existing journal ─── */
=======
  // Load authenticated user + language + journal
>>>>>>> Stashed changes
=======
  // Load authenticated user + language + journal
>>>>>>> Stashed changes
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setLang(userDoc.data().language || 'en-IN');
        }

        const journalSnap = await getDoc(
          doc(db, 'users', u.uid, 'journals', todayISO)
        );
        if (journalSnap.exists()) {
          setTodayJournal(journalSnap.data().text);
        }
      } catch (err) {
        console.error('Error loading language or journal:', err);
      }
    });
    return () => unsub();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayISO]);

  /* ─── fetch today’s entries ─── */
=======
  }, []);

  // Fetch today's entries
>>>>>>> Stashed changes
=======
  }, []);

  // Fetch today's entries
>>>>>>> Stashed changes
  useEffect(() => {
    if (!user) return;

    const fetchTodayEntries = async () => {
      const now = Timestamp.now().toDate();
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      const end = new Date(now); end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'users', user.uid, 'entries'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt')
      );
      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => d.data()));
    };

    fetchTodayEntries();
  }, [user]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  /* ─── create journal (logic UNTOUCHED) ─── */
=======
  // Create today's journal using actual conversations
>>>>>>> Stashed changes
=======
  // Create today's journal using actual conversations
>>>>>>> Stashed changes
  const createJournal = async () => {
    if (!entries.length) {
      setError(t.noEntriesError);
      return;
    }

    if (!lang) {
      setError(t.noLanguageError);
      return;
    }

    const meaningful = entries.filter(
      (e) => !isTrivial(e.input) && !isTrivial(e.response)
    );

    if (!meaningful.length) {
      setError(t.trivialError);
      return;
    }

    const combined = meaningful
      .map((e) => `Q: ${e.input}\nA: ${e.response}`)
      .join('\n\n');

    const prompt = `
You are helping an expectant mother keep a pregnancy journal. Give the journal in mothers point of view, helping her to preserve her pregnancy journey memories with emotion.

Rules:
- You must write **only in ${lang.split('-')[0]}**. Do not mix with other languages.
- You must write fully and ONLY in native script.
- Never mix Roman script or English.
- Never translate or explain anything in English except when the user language is english.
- Use ONLY what she actually shared today.
- if the conversation is just a casual one like hi how are you, give output as something like "today, I interacted with Janani Aarogya..." 
- If it's longer, use a gentle, lyrical tone, showcasing the emotions of the mother (max ~120 words).
- Never switch languages — use ${lang.split('-')[0]} throughout.
- Never invent new events or feelings. Use only feelings and events shared by user.
- if the user shares something about her baby, represent the emotional love towards her baby in a creative way.

Mother's conversation today:
${combined}
    `.trim(); // ← prompt left EXACTLY as before

    try {
      setCreating(true);
      setError('');
      setMessage('');

      const diary = await getGeminiReply(prompt, lang, 'journal');

      await setDoc(
        doc(db, 'users', user.uid, 'journals', todayISO),
        { text: diary, createdAt: serverTimestamp() }
      );

      setTodayJournal(diary);
      setMessage(t.successMessage);
    } catch (err) {
      console.error('❌ Error creating journal:', err);
      setError(t.errorMessage);
    } finally {
      setCreating(false);
    }
  };

  /* ─── render ─── */
  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div className="journal-page overflow-x-hidden">
      <Navbar translations={t} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-pink-600 mb-2 text-center">{t.title}</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {t.entriesToday} <strong>{entries.length}</strong>
        </p>

        <div className="flex justify-center mb-2">
          <button
            onClick={createJournal}
            disabled={creating || entries.length === 0 || !lang}
            className={`px-6 py-2 rounded-full font-semibold transition-all shadow ${
              entries.length === 0 || !lang
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {creating ? t.generating : t.createButton}
          </button>
        </div>

        {todayJournal && (
          <div className="flex justify-center mb-6">
            <label className="text-sm text-gray-700 mr-2">
              {t.themeLabel || 'Choose Paper Style'}:
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border border-rose-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-rose-200"
            >
              {themes.map((th) => (
                <option key={th} value={th}>
                  {th.charAt(0).toUpperCase() + th.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        {todayJournal && (
          <div className={`journal-paper ${theme}`}>
            <div className="tape-left"></div>
            <div className="tape-right"></div>

            <h3 className="font-bold text-xl mb-3 text-rose-600 border-b border-rose-200 pb-1">
              📓 {t.journalTitle}
            </h3>

            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-[1.05rem] tracking-wide">
              {todayJournal}
            </p>
          </div>
        )}
      </main>
=======
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">{t.title}</h2>

      <p className="text-sm text-gray-600 mb-2">
        {t.entriesToday} <strong>{entries.length}</strong>
      </p>

      <button
        onClick={createJournal}
        disabled={creating || entries.length === 0 || !lang}
        className={`mb-6 px-4 py-2 rounded ${
          entries.length === 0 || !lang
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {creating ? t.generating : t.createButton}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {todayJournal && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">📓 {t.journalTitle}</h3>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{todayJournal}</p>
        </div>
      )}
>>>>>>> Stashed changes
=======
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">{t.title}</h2>

      <p className="text-sm text-gray-600 mb-2">
        {t.entriesToday} <strong>{entries.length}</strong>
      </p>

      <button
        onClick={createJournal}
        disabled={creating || entries.length === 0 || !lang}
        className={`mb-6 px-4 py-2 rounded ${
          entries.length === 0 || !lang
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {creating ? t.generating : t.createButton}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {todayJournal && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">📓 {t.journalTitle}</h3>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{todayJournal}</p>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default JournalPage;