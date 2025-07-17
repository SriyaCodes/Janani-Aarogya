// src/components/InputSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getGeminiReply } from '../services/geminiApi';
import { franc } from 'franc';

function InputSection({ onReply }) {
  /* ───────── state ───────── */
  const [input, setInput]           = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMethod, setInputMethod] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  /* ───────── refs ────────── */
  const silenceTimerRef   = useRef(null);
  const recognitionRef    = useRef(null);
  const speechSynthesisRef = useRef(null);

  /* ───────── user / lang ─── */
  const user     = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';

  /* ─────── voice setup ───── */
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = speechSynthesisRef.current?.getVoices() || [];
      setAvailableVoices(voices);
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    };
    
    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voice changes (some browsers load voices asynchronously)
    speechSynthesisRef.current.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesisRef.current?.removeEventListener('voiceschanged', loadVoices);
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

  /* ───── enhanced voice selection ──────── */
  const selectBestVoice = (targetLang) => {
    if (!availableVoices.length) return null;

    // Language priority mappings for Indian languages
    const languagePriorities = {
      'hi-IN': ['hi-IN', 'hi', 'Hindi'],
      'te-IN': ['te-IN', 'te', 'Telugu'],
      'ta-IN': ['ta-IN', 'ta', 'Tamil'],
      'kn-IN': ['kn-IN', 'kn', 'Kannada'],
      'mr-IN': ['mr-IN', 'mr', 'Marathi'],
      'bn-IN': ['bn-IN', 'bn', 'Bengali'],
      'gu-IN': ['gu-IN', 'gu', 'Gujarati'],
      'ml-IN': ['ml-IN', 'ml', 'Malayalam'],
      'pa-IN': ['pa-IN', 'pa', 'Punjabi'],
      'ur-IN': ['ur-IN', 'ur', 'Urdu'],
      'en-IN': ['en-IN', 'en-US', 'en-GB', 'en']
    };

    const priorities = languagePriorities[targetLang] || [targetLang];
    
    // Try to find voice by exact language match first
    for (const priority of priorities) {
      const exactMatch = availableVoices.find(voice => 
        voice.lang === priority || 
        voice.lang.toLowerCase() === priority.toLowerCase()
      );
      if (exactMatch) {
        console.log(`Found exact match for ${targetLang}: ${exactMatch.name} (${exactMatch.lang})`);
        return exactMatch;
      }
    }
    
    // Try to find voice by language name in voice name
    const langBase = targetLang.split('-')[0];
    const nameMatch = availableVoices.find(voice => 
      voice.name.toLowerCase().includes(langBase) ||
      voice.name.toLowerCase().includes(priorities[0]?.toLowerCase())
    );
    if (nameMatch) {
      console.log(`Found name match for ${targetLang}: ${nameMatch.name} (${nameMatch.lang})`);
      return nameMatch;
    }
    
    // Try to find voice by language code prefix
    const prefixMatch = availableVoices.find(voice => 
      voice.lang.startsWith(langBase)
    );
    if (prefixMatch) {
      console.log(`Found prefix match for ${targetLang}: ${prefixMatch.name} (${prefixMatch.lang})`);
      return prefixMatch;
    }
    
    // Fallback to first available voice
    console.log(`No specific voice found for ${targetLang}, using default: ${availableVoices[0].name}`);
    return availableVoices[0];
  };

  /* ───── enhanced TTS helper ──────── */
  const speak = (text, lang) => {
    const synth = speechSynthesisRef.current;
    if (!synth) {
      console.error('Speech synthesis not available');
      return;
    }
    
    // Cancel any ongoing speech
    synth.cancel();
    
    // Wait a moment for cancellation to complete
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language
        utterance.lang = lang;
        
        // Select the best voice
        const selectedVoice = selectBestVoice(lang);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Configure speech parameters for better clarity
        utterance.rate = 0.9;  // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Add event listeners for debugging
        utterance.onstart = () => {
          console.log(`Started speaking: "${text}" in ${lang} with voice: ${selectedVoice?.name || 'default'}`);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
        };
        
        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
        };
        
        // Speak the text
        synth.speak(utterance);
        
      } catch (error) {
        console.error('Error in speech synthesis:', error);
      }
    }, 100);
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
    if (!SR) return alert('Speech Recognition not supported in this browser');
    
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
    
    recognitionRef.current.onerror = (err) => { 
      console.error('Speech recognition error:', err); 
      stopListening(); 
    };
    
    recognitionRef.current.onend = () => { 
      setIsListening(false); 
      setIsProcessing(false); 
    };

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

      /* ---------- EMOTIONAL PROMPT ---------- */
      const prompt = `
You are a wise, emotionally strong Indian woman (like an elder sister or trusted midwife).
Give a short, warm, and deeply empathetic reply in ${langCode}.
If user mentions any symptoms related to health, give suggestions accordingly. Keep in mind that the user is either in pregnancy or prepregnancy or post pregnancy.
• 2‑3 concise lines
• Gentle reassurance, emotional support
• A dash of motivation or cultural wisdom if fitting
User said:
"${finalInput}"`;

      const reply = await getGeminiReply(prompt, langCode);

      /* update UI */
      onReply(reply, responseLang, inputMethod || 'text');
      
      /* speak with proper voice */
      speak(reply, responseLang);
      
      setInput('');
      setInputMethod(null);

      /* store entry */
      if (user) {
        console.log('📦 Saving entry for UID:', user.uid);
        await addDoc(collection(db, 'users', user.uid, 'entries'), {
          input: finalInput,
          response: reply,
          lang: responseLang,
          inputMethod: inputMethod || 'text',
          createdAt: serverTimestamp()
        });
      } else {
        console.warn('⚠️ No authenticated user, skipping Firestore write');
      }
    } catch (err) {
      console.error('Gemini error', err);
      const fallback = userLang.startsWith('hi')
        ? 'क्षमा करें, अभी उत्तर उपलब्ध नहीं है। कृपया पुनः प्रयास करें।'
        : 'Sorry, Im unable to respond right now. Please try again.';
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

  /* ───── test voice function ─── */
  const testVoice = () => {
    const testTexts = {
      'hi-IN': 'नमस्ते, मैं जननी हूं',
      'te-IN': 'నమస్కారం, నేను జనని',
      'ta-IN': 'வணக்கம், நான் ஜனனி',
      'kn-IN': 'ನಮಸ್ಕಾರ, ನಾನು ಜನನಿ',
      'mr-IN': 'नमस्कार, मी जननी',
      'bn-IN': 'নমস্কার, আমি জননি',
      'gu-IN': 'નમસ્તે, હું જનની',
      'ml-IN': 'നമസ്കാരം, ഞാൻ ജനനി',
      'pa-IN': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਜਨਨੀ',
      'ur-IN': 'السلام علیکم، میں جننی ہوں',
      'en-IN': 'Hello, I am Janani'
    };
    
    const testText = testTexts[userLang] || testTexts['en-IN'];
    speak(testText, userLang);
  };

  /* ───── translations ────── */
  const translations = {
    'hi-IN': { ph:'जननी से बात करें...', send:'भेजें', mic:'बोलें', test:'आवाज़ टेस्ट' },
    'te-IN': { ph:"జననితో మాట్లాడండి...", send:'పంపు', mic:'మాట్లాడు', test:'వాయిస్ టెస్ట్' },
    'ta-IN': { ph:"ஜனனியுடன் பேசுங்கள்...", send:'அனுப்பு', mic:'பேச', test:'குரல் சோதனை' },
    'kn-IN': { ph:"ಜನನಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ...", send:'ಕಳುಹೆ', mic:'ಮಾತನಾಡಿ', test:'ಧ್ವನಿ ಪರೀಕ್ಷೆ' },
    'mr-IN': { ph:"जननीसोबत बोला...", send:'पाठवा', mic:'बोला', test:'आवाज टेस्ट' },
    'bn-IN': { ph:"জননির সঙ্গে কথা বলুন...", send:'পাঠান', mic:'বলুন', test:'কণ্ঠস্বর পরীক্ষা' },
    'gu-IN': { ph:"જનની સાથે વાત કરો...", send:'મોકલો', mic:'બોલો', test:'અવાજ ટેસ્ટ' },
    'ml-IN': { ph:"ജനനിയുമായി സംസാരിക്കുക...", send:'അയയ്ക്കുക', mic:'സംസാരിക്കുക', test:'ശബ്ദ പരിശോധന' },
    'pa-IN': { ph:"ਜਨਨੀ ਨਾਲ ਗੱਲ ਕਰੋ...", send:'ਭੇਜੋ', mic:'ਬੋਲੋ', test:'ਆਵਾਜ਼ ਟੈਸਟ' },
    'ur-IN': { ph:'اپنا سوال لکھیں...', send:'بھیجیں', mic:'بولیں', test:'آواز ٹیسٹ' },
    default: { ph:'Talk to Janani...', send:'Send', mic:'Speak', test:'Voice Test' }
  };
  
  const t = translations[userLang] || translations.default;
  const { ph: placeholder, send, mic: speakLabel, test: testLabel } = t;

  /* ───── render ───── */
  return (
    <div className="p-4 bg-white shadow rounded-xl w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
          className="flex-1 border p-2 rounded-lg"
          disabled={isProcessing}
        />
        <button
          onClick={handleTextSubmit}
          disabled={isProcessing}
          className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50"
        >
          {isProcessing ? '...' : send}
        </button>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`px-4 py-2 rounded-lg text-white hover:bg-pink-600 disabled:opacity-50 ${
            isListening ? 'bg-red-500' : 'bg-pink-500'
          }`}
          title={speakLabel}
        >
          {isProcessing ? '...' : '🎙️'}
        </button>
      </div>
      
      {/* Voice Test Button */}
      <div className="flex justify-center">
        <button
          onClick={testVoice}
          disabled={isProcessing}
          className="px-3 py-1 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          title={testLabel}
        >
          🔊 {testLabel}
        </button>
      </div>
    </div>
  );
}

export default InputSection;