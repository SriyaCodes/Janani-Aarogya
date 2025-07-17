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
  const speechSynthesisRef = useRef(null);

  /* ───────── user / lang ─── */
  const user = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';

  /* ─────── voice setup ───── */
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    // Pre-load voices
    const populateVoices = () => speechSynthesisRef.current?.getVoices();
    speechSynthesisRef.current.addEventListener('voiceschanged', populateVoices);
    
    return () => {
      speechSynthesisRef.current?.removeEventListener('voiceschanged', populateVoices);
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  /* ─────── cleanup ───────── */
  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop();
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  /* ───── TTS helper ──────── */
  const speak = (text, lang) => {
    const synth = speechSynthesisRef.current;
    if (!synth) return;
    
    synth.cancel(); // Clear any previous speech
    
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = lang;
    uttr.rate = 1.0;
    uttr.pitch = 1.0;
    
    const voices = synth.getVoices();
    
    // This logic attempts to find the best available voice in the browser.
    const voice =
      // 1. Try for an exact match (e.g., 'hi-IN')
      voices.find(v => v.lang === lang) || 
      // 2. Try for a partial language match (e.g., 'hi')
      voices.find(v => v.lang.startsWith(lang.split('-')[0])) || 
      // 3. Fallback to the very first voice available on the system.
      // This is what causes a different language voice to speak if a native one isn't found.
      voices[0];
      
    uttr.voice = voice;
    
    // A small delay can help prevent issues on some browsers.
    setTimeout(() => synth.speak(uttr), 100);
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
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
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

      /* update UI */
      onReply(reply, responseLang, inputMethod || 'text');
      speak(reply, responseLang);
      setInput('');
      setInputMethod(null);

      /* store entry */
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'entries'), {
          input: finalInput,
          response: reply,
          lang: responseLang,
          inputMethod: inputMethod || 'text',
          createdAt: serverTimestamp()
        });
      } else console.warn('⚠️ No authenticated user, skipping Firestore write');
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
  const handleTextSubmit = () => { setInputMethod('text'); handleSubmit(); };

  /* ───── translations ────── */
  const translations = {
    'hi-IN': { ph: 'जननी से बात करें...', send: 'भेजें', mic: 'बोलें' },
    'te-IN': { ph: "జననితో మాట్లాడండి...", send: 'పంపు', mic: 'మాట్లాడు' },
    'ta-IN': { ph: "ஜனனியுடன் பேசுங்கள்...", send: 'அனுப்பு', mic: 'பேச' },
    'kn-IN': { ph: "ಜನನಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ...", send: 'ಕಳುಹಿಸು', mic: 'ಮಾತನಾಡಿ' },
    'mr-IN': { ph: "जननीसोबत बोला...", send: 'पाठवा', mic: 'बोला' },
    'bn-IN': { ph: "জননির সঙ্গে কথা বলুন...", send: 'পাঠান', mic: 'বলুন' },
    'gu-IN': { ph: "જનની સાથે વાત કરો...", send: 'મોકલો', mic: 'બોલો' },
    'ml-IN': { ph: "ജനനിയുമായി സംസാരിക്കുക...", send: ' അയയ്ക്കുക', mic: 'സംസാരിക്കുക' },
    'pa-IN': { ph: "ਜਨਨੀ ਨਾਲ ਗੱਲ ਕਰੋ...", send: 'ਭੇਜੋ', mic: 'ਬੋਲੋ' },
    'ur-IN': { ph: 'اپنا سوال لکھیں...', send: 'بھیجیں', mic: 'بولیں' },
    default: { ph: 'Talk to Janani...', send: 'Send', mic: 'Speak' }
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
          onChange={e => setInput(e.target.value)}
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
          {/* Using a simple mic icon for consistency */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default InputSection;