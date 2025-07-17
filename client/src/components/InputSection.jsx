// src/components/InputSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getGeminiReply } from '../services/geminiApi';
import { franc } from 'franc';

function InputSection({ onReply }) {
  /* ───────── state ───────── */
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMethod, setInputMethod] = useState(null);

  /* ───────── refs ────────── */
  const silenceTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ───────── user / lang ─── */
  const user = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';

  /* ─────── cleanup ───────── */
  useEffect(() => {
    // This cleans up the speech recognition timer and stops any speaking
    return () => {
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop();
      if (window.responsiveVoice) {
        window.responsiveVoice.cancel();
      }
    };
  }, []);

  /* ───── TTS helper (with ResponsiveVoice.js) ──────── */
  const speak = (text, lang) => {
    if (typeof window.responsiveVoice === 'undefined') {
      console.error('ResponsiveVoice library not loaded. Check script tag in index.html.');
      return;
    }
    
    window.responsiveVoice.cancel(); // Stop any previous speech

    // Map your app's language codes to the specific voice names ResponsiveVoice needs
    const getVoiceForLang = (langCode) => {
      const voiceMap = {
        'hi-IN': 'Hindi Female',
        'te-IN': 'Telugu Female',
        'ta-IN': 'Tamil Female',
        'kn-IN': 'Kannada Female',
        'bn-IN': 'Bengali Female',
        'gu-IN': 'Gujarati Female',
        'ml-IN': 'Malayalam Female',
        'en-IN': 'UK English Female',
        // Languages NOT supported by ResponsiveVoice:
        // 'mr-IN' (Marathi), 'pa-IN' (Punjabi), 'ur-IN' (Urdu)
      };
      return voiceMap[langCode];
    };

    const voice = getVoiceForLang(lang);

    // Speak only if a supported voice is found
    if (voice) {
      window.responsiveVoice.speak(text, voice);
    } else {
      console.warn(`Voice output is not available for language: ${lang}`);
    }
  };

  /* ───── language detect ─── */
  const detectLanguage = (text) => {
    if (text.length < 3) return userLang;
    const map = {
      hin: 'hi-IN', tel: 'te-IN', tam: 'ta-IN', kan: 'kn-IN',
      eng: 'en-IN', mar: 'mr-IN', ben: 'bn-IN', guj: 'gu-IN',
      mal: 'ml-IN', pan: 'pa-IN', urd: 'ur-IN'
    };
    const code = franc(text, { minLength: 3, only: Object.keys(map) });
    return map[code] || userLang;
  };

  /* ───── start / stop SR ─── */
  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Speech Recognition not supported in this browser.');
    
    recognitionRef.current = new SR();
    recognitionRef.current.lang = userLang;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;
    recognitionRef.current.maxAlternatives = 1;

    const resetSilence = () => {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(stopListening, 3000);
    };

    recognitionRef.current.onresult = (e) => {
      resetSilence();
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      if (e.results[e.results.length - 1].isFinal) {
        setInputMethod('speech');
        handleSubmit(transcript, detectLanguage(transcript));
      }
    };
    recognitionRef.current.onerror = (err) => { console.error(err); stopListening(); };
    recognitionRef.current.onend = () => { setIsListening(false); setIsProcessing(false); };

    setIsListening(true);
    recognitionRef.current.start();
    resetSilence();
  };

  /* ───── handle submit ───── */
  const handleSubmit = async (textVal, forcedLang) => {
    const finalInput = textVal || input.trim();
    if (!finalInput) return;

    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }

    setIsProcessing(true);
    try {
      const responseLang = forcedLang || detectLanguage(finalInput);
      const langCode = responseLang.slice(0, 2);

      const prompt = `
You are a wise, emotionally strong Indian woman (like an elder sister or trusted midwife).
Give a short, warm, and deeply empathetic reply in ${langCode}.
if user mentions any symptoms related to health, give suggestions accordingly. keep in mind that the user is either in pregnancy or prepreganncy or post pregnancy.
• 2‑3 concise lines
• Gentle reassurance, emotional support
• A dash of motivation or cultural wisdom if fitting
User said:
"${finalInput}"`;

      const reply = await getGeminiReply(prompt, langCode);

      onReply(reply, responseLang, inputMethod || 'text');
      speak(reply, responseLang);
      setInput('');
      setInputMethod(null);

      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'entries'), {
          input: finalInput,
          response: reply,
          lang: responseLang,
          inputMethod: inputMethod || 'text',
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Gemini error', err);
      const fallback = userLang.startsWith('hi')
        ? 'क्षमा करें, अभी उत्तर उपलब्ध नहीं है। कृपया पुनः प्रयास करें।'
        : 'Sorry, I’m unable to respond right now. Please try again.';
      onReply(fallback, userLang, inputMethod || 'text');
      speak(fallback, userLang);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ───── text submit click ─ */
  const handleTextSubmit = () => {
    setInputMethod('text');
    handleSubmit();
  };

  /* ───── translations ────── */
  const translations = {
    'hi-IN': { ph: 'जननी से बात करें...', send: 'भेजें', mic: 'बोलें' },
    'te-IN': { ph: 'జననితో మాట్లాడండి...', send: 'పంపు', mic: 'మాట్లాడు' },
    'ta-IN': { ph: 'ஜனனியுடன் பேசுங்கள்...', send: 'அனுப்பு', mic: 'பேச' },
    'kn-IN': { ph: 'ಜನನಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ...', send: 'ಕಳುಹಿಸು', mic: 'ಮಾತನಾಡಿ' },
    'mr-IN': { ph: 'जननीसोबत बोला...', send: 'पाठवा', mic: 'बोला' },
    'bn-IN': { ph: 'জননির সঙ্গে কথা বলুন...', send: 'পাঠান', mic: 'বলুন' },
    'gu-IN': { ph: 'જનની સાથે વાત કરો...', send: 'મોકલો', mic: 'બોલો' },
    'ml-IN': { ph: 'ജനനിയുമായി സംസാരിക്കുക...', send: 'അയയ്ക്കുക', mic: 'സംസാരിക്കുക' },
    'pa-IN': { ph: 'ਜਨਨੀ ਨਾਲ ਗੱਲ ਕਰੋ...', send: 'ਭੇਜੋ', mic: 'ਬੋਲੋ' },
    'ur-IN': { ph: 'اپنا سوال لکھیں...', send: 'بھیجیں', mic: 'بولیں' },
    default: { ph: 'Talk to Janani...', send: 'Send', mic: 'Speak' },
  };
  const t = translations[userLang] || translations.default;
  const { ph: placeholder, send, mic: speakLabel } = t;

  /* ───── render ───── */
  return (
    <div className="p-4 bg-white shadow rounded-xl w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleTextSubmit()}
          className="flex-1 border p-2 rounded-lg"
          disabled={isProcessing}
        />
        <button
          onClick={handleTextSubmit}
          disabled={isProcessing || !input.trim()}
          className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50"
        >
          {isProcessing ? '...' : send}
        </button>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`p-3 rounded-full text-white transition-colors ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'
          } disabled:opacity-50`}
          title={speakLabel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default InputSection;