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
    
    const populateVoices = () => {
      const voices = speechSynthesisRef.current?.getVoices() || [];
      setAvailableVoices(voices);
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    };
    
    // Load voices immediately if available
    populateVoices();
    
    // Listen for voice changes
    speechSynthesisRef.current.addEventListener('voiceschanged', populateVoices);
    
    return () => {
      speechSynthesisRef.current.removeEventListener('voiceschanged', populateVoices);
      speechSynthesisRef.current.cancel();
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

  /* ───── Enhanced voice selection ──────── */
  const selectBestVoice = (targetLang) => {
    if (!availableVoices.length) return null;

    // Define preferred voice names for each language (native accents)
    const preferredVoices = {
      'hi-IN': ['Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Neel', 'Shreya'],
      'te-IN': ['Google తెలుగు', 'Microsoft Heera', 'Chitra'],
      'ta-IN': ['Google தமிழ்', 'Microsoft Valluvar', 'Karthik'],
      'kn-IN': ['Google ಕನ್ನಡ', 'Microsoft Suma'],
      'mr-IN': ['Google मराठी', 'Microsoft Omkar'],
      'bn-IN': ['Google বাংলা', 'Microsoft Sushmita', 'Bashkar'],
      'gu-IN': ['Google ગુજરાતી', 'Microsoft Gujarati'],
      'ml-IN': ['Google മലയാളം', 'Microsoft Malayalam'],
      'pa-IN': ['Google ਪੰਜਾਬੀ', 'Microsoft Punjabi'],
      'ur-IN': ['Google اردو', 'Microsoft Urdu'],
      'en-IN': ['Google English (India)', 'Microsoft Nandini', 'Ravi', 'Heera']
    };

    // Step 1: Try to find exact language match with preferred voices
    const langPreferred = preferredVoices[targetLang] || [];
    for (const prefName of langPreferred) {
      const voice = availableVoices.find(v => 
        v.name.includes(prefName) || 
        v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (voice) {
        console.log(`✅ Selected preferred voice: ${voice.name} for ${targetLang}`);
        return voice;
      }
    }

    // Step 2: Try exact language code match
    let exactMatch = availableVoices.find(v => v.lang === targetLang);
    if (exactMatch) {
      console.log(`✅ Selected exact match: ${exactMatch.name} for ${targetLang}`);
      return exactMatch;
    }

    // Step 3: Try language family match (e.g., 'hi' for 'hi-IN')
    const baseLang = targetLang.split('-')[0];
    const familyMatch = availableVoices.find(v => v.lang.startsWith(baseLang));
    if (familyMatch) {
      console.log(`✅ Selected family match: ${familyMatch.name} for ${targetLang}`);
      return familyMatch;
    }

    // Step 4: Try alternative regional codes
    const alternativeRegions = {
      'hi': ['hi-IN', 'hi'],
      'te': ['te-IN', 'te'],
      'ta': ['ta-IN', 'ta-LK', 'ta'],
      'kn': ['kn-IN', 'kn'],
      'mr': ['mr-IN', 'mr'],
      'bn': ['bn-IN', 'bn-BD', 'bn'],
      'gu': ['gu-IN', 'gu'],
      'ml': ['ml-IN', 'ml'],
      'pa': ['pa-IN', 'pa-PK', 'pa'],
      'ur': ['ur-IN', 'ur-PK', 'ur'],
      'en': ['en-IN', 'en-US', 'en-GB', 'en-AU', 'en']
    };

    const alternatives = alternativeRegions[baseLang] || [];
    for (const altLang of alternatives) {
      const altVoice = availableVoices.find(v => v.lang === altLang);
      if (altVoice) {
        console.log(`✅ Selected alternative: ${altVoice.name} for ${targetLang}`);
        return altVoice;
      }
    }

    // Step 5: Fallback to English (India) or any English
    const enIndiaVoice = availableVoices.find(v => v.lang === 'en-IN');
    if (enIndiaVoice) {
      console.log(`⚠️ Fallback to English (India): ${enIndiaVoice.name}`);
      return enIndiaVoice;
    }

    const anyEnglish = availableVoices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) {
      console.log(`⚠️ Fallback to English: ${anyEnglish.name}`);
      return anyEnglish;
    }

    // Step 6: Last resort - first available voice
    console.log(`⚠️ Last resort: ${availableVoices[0]?.name}`);
    return availableVoices[0] || null;
  };

  /* ───── Enhanced TTS helper ──────── */
  const speak = (text, lang) => {
    const synth = speechSynthesisRef.current;
    if (!synth || !text.trim()) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    // Wait a moment for cancel to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = lang;
      
      // Configure speech parameters for better quality
      utterance.rate = 0.9;  // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Select the best voice
      const selectedVoice = selectBestVoice(lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🎤 Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.warn('⚠️ No suitable voice found, using default');
      }
      
      // Add event listeners for debugging
      utterance.onstart = () => console.log('🎵 Speech started');
      utterance.onend = () => console.log('🎵 Speech ended');
      utterance.onerror = (e) => console.error('🚫 Speech error:', e);
      
      // Speak with additional delay to ensure proper voice loading
      setTimeout(() => {
        try {
          synth.speak(utterance);
        } catch (error) {
          console.error('Speech synthesis error:', error);
        }
      }, 100);
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
if user mentions any symptoms related to health, give suggestions accordingly. keep in mind that the user is either in pregnancy or prepreganncy or post pregnancy.
• 2‑3 concise lines
• Gentle reassurance, emotional support
• A dash of motivation or cultural wisdom if fitting
User said:
"${finalInput}"`;

      const reply = await getGeminiReply(prompt, langCode);

      /* update UI */
      onReply(reply, responseLang, inputMethod || 'text');
      
      /* speak with enhanced voice selection */
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

  /* ───── translations ────── */
  const translations = {
    'hi-IN': { ph:'जननी से बात करें...', send:'भेजें', mic:'बोलें' },
    'te-IN': { ph:"జననితో మాట్లాడండి...", send:'పంపు', mic:'మాట్లాడు' },
    'ta-IN': { ph:"ஜனனியுடன் பேசுங்கள்...", send:'அனுப்பு', mic:'பேச' },
    'kn-IN': { ph:"ಜನನಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ...", send:'ಕಳುಹೆ', mic:'ಮಾತನಾಡಿ' },
    'mr-IN': { ph:"जननीसोबत बोला...", send:'पाठवा', mic:'बोला' },
    'bn-IN': { ph:"জননির সঙ্গে কথা বলুন...", send:'পাঠান', mic:'বলুন' },
    'gu-IN': { ph:"જનની સાથે વાત કરો...", send:'મોકલો', mic:'બોલો' },
    'ml-IN': { ph:"ജനനിയുമായി സംസാരിക്കുക...", send:'അയയ്ക്കുക', mic:'സംസാരിക്കുക' },
    'pa-IN': { ph:"ਜਨਨੀ ਨਾਲ ਗੱਲ ਕਰੋ...", send:'ਭੇਜੋ', mic:'ਬੋਲੋ' },
    'ur-IN': { ph:'اپنا سوال لکھیں...', send:'بھیجیں', mic:'بولیں' },
    default: { ph:'Talk to Janani...', send:'Send', mic:'Speak' }
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
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Available voices: {availableVoices.length} | User lang: {userLang}
        </div>
      )}
    </div>
  );
}

export default InputSection;