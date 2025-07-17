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

  /* ───── Enhanced voice selection with extensive fallbacks ──────── */
  const selectBestVoice = (targetLang) => {
    if (!availableVoices.length) return null;

    console.log(`🔍 Searching for voice for language: ${targetLang}`);
    console.log(`📋 Available voices:`, availableVoices.map(v => `${v.name} (${v.lang})`));

    // Define comprehensive voice patterns for each language
    const voicePatterns = {
      'hi-IN': [
        // Exact name matches
        'Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Neel', 'Shreya',
        // Pattern matches
        /hindi/i, /हिन्दी/i, /devanagari/i, /kalpana/i, /hemant/i
      ],
      'te-IN': [
        'Google తెలుగు', 'Microsoft Heera', 'Chitra',
        /telugu/i, /తెలుగు/i, /heera/i, /chitra/i
      ],
      'ta-IN': [
        'Google தமிழ்', 'Microsoft Valluvar', 'Karthik',
        /tamil/i, /தமிழ்/i, /valluvar/i, /karthik/i
      ],
      'kn-IN': [
        'Google ಕನ್ನಡ', 'Microsoft Suma',
        /kannada/i, /ಕನ್ನಡ/i, /suma/i
      ],
      'mr-IN': [
        'Google मराठी', 'Microsoft Omkar',
        /marathi/i, /मराठी/i, /omkar/i
      ],
      'bn-IN': [
        'Google বাংলা', 'Microsoft Sushmita', 'Bashkar',
        /bengali/i, /বাংলা/i, /sushmita/i, /bashkar/i
      ],
      'gu-IN': [
        'Google ગુજરાતી', 'Microsoft Gujarati',
        /gujarati/i, /ગુજરાતી/i
      ],
      'ml-IN': [
        'Google മലയാളം', 'Microsoft Malayalam',
        /malayalam/i, /മലയാളം/i
      ],
      'pa-IN': [
        'Google ਪੰਜਾਬੀ', 'Microsoft Punjabi',
        /punjabi/i, /ਪੰਜਾਬੀ/i
      ],
      'ur-IN': [
        'Google اردو', 'Microsoft Urdu',
        /urdu/i, /اردو/i
      ],
      'en-IN': [
        'Google English (India)', 'Microsoft Nandini', 'Ravi', 'Heera',
        /english.*india/i, /nandini/i, /ravi/i
      ]
    };

    // Step 1: Try preferred patterns for the target language
    const patterns = voicePatterns[targetLang] || [];
    for (const pattern of patterns) {
      let voice;
      if (typeof pattern === 'string') {
        // Exact string match
        voice = availableVoices.find(v => 
          v.name === pattern || 
          v.name.toLowerCase().includes(pattern.toLowerCase())
        );
      } else if (pattern instanceof RegExp) {
        // Regex pattern match
        voice = availableVoices.find(v => pattern.test(v.name));
      }
      
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

    // Step 4: Try alternative regional codes and variations
    const alternativeRegions = {
      'hi': ['hi-IN', 'hi-PK', 'hi'],
      'te': ['te-IN', 'te'],
      'ta': ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
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

    // Step 5: Try to find any voice that contains the language name
    const languageNames = {
      'hi-IN': ['hindi', 'हिन्दी'],
      'te-IN': ['telugu', 'తెలుగు'],
      'ta-IN': ['tamil', 'தமிழ்'],
      'kn-IN': ['kannada', 'ಕನ್ನಡ'],
      'mr-IN': ['marathi', 'मराठी'],
      'bn-IN': ['bengali', 'বাংলা'],
      'gu-IN': ['gujarati', 'ગુજરાતી'],
      'ml-IN': ['malayalam', 'മലയാളം'],
      'pa-IN': ['punjabi', 'ਪੰਜਾਬੀ'],
      'ur-IN': ['urdu', 'اردو']
    };

    const nameVariants = languageNames[targetLang] || [];
    for (const name of nameVariants) {
      const nameMatch = availableVoices.find(v => 
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (nameMatch) {
        console.log(`✅ Selected name match: ${nameMatch.name} for ${targetLang}`);
        return nameMatch;
      }
    }

    // Step 6: Fallback to English (India) for Indian languages
    if (targetLang.endsWith('-IN')) {
      const enIndiaVoice = availableVoices.find(v => v.lang === 'en-IN');
      if (enIndiaVoice) {
        console.log(`⚠️ Fallback to English (India): ${enIndiaVoice.name}`);
        return enIndiaVoice;
      }
    }

    // Step 7: Try any English voice
    const anyEnglish = availableVoices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) {
      console.log(`⚠️ Fallback to English: ${anyEnglish.name}`);
      return anyEnglish;
    }

    // Step 8: Last resort - first available voice
    console.log(`⚠️ Last resort: ${availableVoices[0]?.name}`);
    return availableVoices[0] || null;
  };

  /* ───── Enhanced TTS helper with fallback strategies ──────── */
  const speak = (text, lang) => {
    const synth = speechSynthesisRef.current;
    if (!synth || !text.trim()) {
      console.warn('⚠️ Speech synthesis not available or empty text');
      return;
    }
    
    // Cancel any ongoing speech
    synth.cancel();
    
    // Wait a moment for cancel to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = lang;
      
      // Configure speech parameters for better quality
      utterance.rate = 0.85;  // Slower for Indian languages
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Select the best voice
      const selectedVoice = selectBestVoice(lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🎤 Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang}) for text: "${text.substring(0, 50)}..."`);
      } else {
        console.warn('⚠️ No suitable voice found, using system default');
        // Try to force the language even without a specific voice
        utterance.lang = lang;
      }
      
      // Add event listeners for debugging and fallback
      utterance.onstart = () => {
        console.log('🎵 Speech started successfully');
      };
      
      utterance.onend = () => {
        console.log('🎵 Speech ended successfully');
      };
      
      utterance.onerror = (e) => {
        console.error('🚫 Speech error:', e);
        
        // If there's an error, try with English fallback
        if (lang !== 'en-IN' && lang !== 'en-US') {
          console.log('🔄 Trying English fallback...');
          setTimeout(() => {
            speak(`English translation: ${text}`, 'en-IN');
          }, 500);
        }
      };
      
      // Multiple attempts with different timing
      const attemptSpeech = (attempt = 1) => {
        try {
          console.log(`🎯 Speech attempt ${attempt} for language: ${lang}`);
          synth.speak(utterance);
          
          // Check if speech is actually working after a delay
          setTimeout(() => {
            if (!synth.speaking && !synth.pending) {
              console.warn(`⚠️ Speech may have failed silently on attempt ${attempt}`);
              if (attempt < 3) {
                console.log(`🔄 Retrying speech attempt ${attempt + 1}...`);
                attemptSpeech(attempt + 1);
              } else {
                console.error('❌ All speech attempts failed');
              }
            }
          }, 100);
          
        } catch (error) {
          console.error(`❌ Speech synthesis error on attempt ${attempt}:`, error);
          if (attempt < 3) {
            setTimeout(() => attemptSpeech(attempt + 1), 200);
          }
        }
      };
      
      // Start the speech attempts
      attemptSpeech();
      
    }, 150); // Increased delay for better reliability
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
      
      {/* Enhanced debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <div>Available voices: {availableVoices.length} | User lang: {userLang}</div>
          <div className="max-h-20 overflow-y-auto">
            <strong>Voices:</strong> {availableVoices.map(v => `${v.name} (${v.lang})`).join(', ')}
          </div>
          <button 
            onClick={() => speak('Test voice in ' + userLang, userLang)}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Test Voice
          </button>
        </div>
      )}
    </div>
  );
}

export default InputSection;