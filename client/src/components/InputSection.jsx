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
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  /* ───────── refs ────────── */
  const silenceTimerRef   = useRef(null);
  const recognitionRef    = useRef(null);
  const speechSynthesisRef = useRef(null);

  /* ───────── user / lang ─── */
  const user     = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';

  /* ─────── Enhanced voice setup with better loading ───── */
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      return new Promise((resolve) => {
        let voices = speechSynthesisRef.current?.getVoices() || [];
        
        if (voices.length > 0) {
          resolve(voices);
        } else {
          // Wait for voices to load
          const handleVoicesChanged = () => {
            voices = speechSynthesisRef.current?.getVoices() || [];
            if (voices.length > 0) {
              speechSynthesisRef.current.removeEventListener('voiceschanged', handleVoicesChanged);
              resolve(voices);
            }
          };
          
          speechSynthesisRef.current.addEventListener('voiceschanged', handleVoicesChanged);
          
          // Fallback timeout
          setTimeout(() => {
            speechSynthesisRef.current.removeEventListener('voiceschanged', handleVoicesChanged);
            resolve(speechSynthesisRef.current?.getVoices() || []);
          }, 3000);
        }
      });
    };
    
    const initializeVoices = async () => {
      try {
        const voices = await loadVoices();
        setAvailableVoices(voices);
        setVoicesLoaded(true);
        console.log('🎤 Loaded voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.localService ? 'Local' : 'Remote'}`));
      } catch (error) {
        console.error('❌ Failed to load voices:', error);
        setVoicesLoaded(true); // Set to true anyway to prevent infinite loading
      }
    };
    
    initializeVoices();
    
    return () => {
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  /* ───── Enhanced voice selection with better native accent detection ──────── */
  const selectBestVoice = (targetLang) => {
    if (!availableVoices.length) {
      console.warn('⚠️ No voices available');
      return null;
    }

    console.log(`🔍 Searching for native voice for language: ${targetLang}`);
    
    // Enhanced voice patterns with native accent preferences
    const nativeVoicePatterns = {
      'hi-IN': {
        priority: [
          // Prefer local/native voices first
          { patterns: [/Google.*हिन्दी/i, /Microsoft.*Kalpana/i, /Shreya/i], native: true },
          { patterns: [/hindi/i, /हिन्दी/i], native: true },
          { patterns: [/Hemant/i, /Lekha/i], native: true }
        ],
        fallback: ['hi-IN', 'hi']
      },
      'te-IN': {
        priority: [
          { patterns: [/Google.*తెలుగు/i, /Microsoft.*Heera/i, /Chitra/i], native: true },
          { patterns: [/telugu/i, /తెలుగు/i], native: true }
        ],
        fallback: ['te-IN', 'te']
      },
      'ta-IN': {
        priority: [
          { patterns: [/Google.*தமிழ்/i, /Microsoft.*Valluvar/i, /Karthik/i], native: true },
          { patterns: [/tamil/i, /தமிழ்/i], native: true }
        ],
        fallback: ['ta-IN', 'ta', 'ta-LK']
      },
      'kn-IN': {
        priority: [
          { patterns: [/Google.*ಕನ್ನಡ/i, /Microsoft.*Suma/i], native: true },
          { patterns: [/kannada/i, /ಕನ್ನಡ/i], native: true }
        ],
        fallback: ['kn-IN', 'kn']
      },
      'mr-IN': {
        priority: [
          { patterns: [/Google.*मराठी/i, /Microsoft.*Omkar/i], native: true },
          { patterns: [/marathi/i, /मराठी/i], native: true }
        ],
        fallback: ['mr-IN', 'mr']
      },
      'bn-IN': {
        priority: [
          { patterns: [/Google.*বাংলা/i, /Microsoft.*Sushmita/i, /Bashkar/i], native: true },
          { patterns: [/bengali/i, /বাংলা/i], native: true }
        ],
        fallback: ['bn-IN', 'bn', 'bn-BD']
      },
      'gu-IN': {
        priority: [
          { patterns: [/Google.*ગુજરાતી/i, /Microsoft.*Gujarati/i], native: true },
          { patterns: [/gujarati/i, /ગુજરાતી/i], native: true }
        ],
        fallback: ['gu-IN', 'gu']
      },
      'ml-IN': {
        priority: [
          { patterns: [/Google.*മലയാളം/i, /Microsoft.*Malayalam/i], native: true },
          { patterns: [/malayalam/i, /മലയാളം/i], native: true }
        ],
        fallback: ['ml-IN', 'ml']
      },
      'pa-IN': {
        priority: [
          { patterns: [/Google.*ਪੰਜਾਬੀ/i, /Microsoft.*Punjabi/i], native: true },
          { patterns: [/punjabi/i, /ਪੰਜਾਬੀ/i], native: true }
        ],
        fallback: ['pa-IN', 'pa', 'pa-PK']
      },
      'ur-IN': {
        priority: [
          { patterns: [/Google.*اردو/i, /Microsoft.*Urdu/i], native: true },
          { patterns: [/urdu/i, /اردو/i], native: true }
        ],
        fallback: ['ur-IN', 'ur', 'ur-PK']
      },
      'en-IN': {
        priority: [
          { patterns: [/Google.*English.*India/i, /Microsoft.*Nandini/i, /Ravi/i], native: true },
          { patterns: [/english.*india/i, /indian/i], native: true }
        ],
        fallback: ['en-IN', 'en-US', 'en-GB']
      }
    };

    const config = nativeVoicePatterns[targetLang];
    if (!config) {
      console.warn(`⚠️ No voice configuration for ${targetLang}`);
      return availableVoices.find(v => v.lang === targetLang) || availableVoices[0];
    }

    // Step 1: Try priority patterns (native voices first)
    for (const priorityGroup of config.priority) {
      for (const pattern of priorityGroup.patterns) {
        const voice = availableVoices.find(v => {
          const match = pattern.test ? pattern.test(v.name) : v.name.toLowerCase().includes(pattern.toLowerCase());
          return match;
        });
        
        if (voice) {
          // Prefer local/native voices
          if (voice.localService || priorityGroup.native) {
            console.log(`✅ Selected native voice: ${voice.name} (${voice.lang}) - Local: ${voice.localService}`);
            return voice;
          }
          console.log(`🔍 Found voice but checking for better native option: ${voice.name}`);
        }
      }
    }

    // Step 2: Try exact language matches from fallback list
    for (const fallbackLang of config.fallback) {
      const voice = availableVoices.find(v => v.lang === fallbackLang);
      if (voice) {
        console.log(`✅ Selected fallback voice: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // Step 3: Try any voice that starts with the base language
    const baseLang = targetLang.split('-')[0];
    const baseVoice = availableVoices.find(v => v.lang.startsWith(baseLang));
    if (baseVoice) {
      console.log(`✅ Selected base language voice: ${baseVoice.name} (${baseVoice.lang})`);
      return baseVoice;
    }

    // Step 4: Ultimate fallback to English (India) or any English
    const englishIndia = availableVoices.find(v => v.lang === 'en-IN');
    if (englishIndia) {
      console.log(`⚠️ Fallback to English (India): ${englishIndia.name}`);
      return englishIndia;
    }

    const anyEnglish = availableVoices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) {
      console.log(`⚠️ Fallback to English: ${anyEnglish.name}`);
      return anyEnglish;
    }

    console.log(`⚠️ Last resort: ${availableVoices[0]?.name}`);
    return availableVoices[0] || null;
  };

  /* ───── Enhanced TTS with better reliability and multiple attempts ──────── */
  const speak = async (text, lang) => {
    if (!voicesLoaded) {
      console.warn('⚠️ Voices not loaded yet, waiting...');
      setTimeout(() => speak(text, lang), 500);
      return;
    }

    const synth = speechSynthesisRef.current;
    if (!synth || !text.trim()) {
      console.warn('⚠️ Speech synthesis not available or empty text');
      return;
    }
    
    // Cancel any ongoing speech
    synth.cancel();
    
    // Wait for cancel to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const attemptSpeech = (attempt = 1, maxAttempts = 3) => {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech parameters for better quality
        utterance.lang = lang;
        utterance.rate = lang.startsWith('hi') || lang.startsWith('te') || lang.startsWith('ta') ? 0.8 : 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Select the best voice
        const selectedVoice = selectBestVoice(lang);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`🎤 Attempt ${attempt}: Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        } else {
          console.warn(`⚠️ Attempt ${attempt}: No suitable voice found, using system default`);
        }
        
        let speechStarted = false;
        let speechEnded = false;
        
        utterance.onstart = () => {
          speechStarted = true;
          console.log(`🎵 Speech started successfully on attempt ${attempt}`);
        };
        
        utterance.onend = () => {
          speechEnded = true;
          console.log(`🎵 Speech ended successfully on attempt ${attempt}`);
          resolve();
        };
        
        utterance.onerror = (e) => {
          console.error(`🚫 Speech error on attempt ${attempt}:`, e);
          if (attempt < maxAttempts) {
            console.log(`🔄 Retrying speech attempt ${attempt + 1}...`);
            setTimeout(() => {
              attemptSpeech(attempt + 1, maxAttempts)
                .then(resolve)
                .catch(reject);
            }, 300);
          } else {
            reject(e);
          }
        };
        
        try {
          synth.speak(utterance);
          
          // Check if speech started within reasonable time
          setTimeout(() => {
            if (!speechStarted && !speechEnded) {
              console.warn(`⚠️ Speech didn't start within timeout on attempt ${attempt}`);
              if (attempt < maxAttempts) {
                synth.cancel();
                setTimeout(() => {
                  attemptSpeech(attempt + 1, maxAttempts)
                    .then(resolve)
                    .catch(reject);
                }, 300);
              } else {
                reject(new Error('Speech failed to start'));
              }
            }
          }, 1000);
          
        } catch (error) {
          console.error(`❌ Speech synthesis error on attempt ${attempt}:`, error);
          if (attempt < maxAttempts) {
            setTimeout(() => {
              attemptSpeech(attempt + 1, maxAttempts)
                .then(resolve)
                .catch(reject);
            }, 300);
          } else {
            reject(error);
          }
        }
      });
    };
    
    try {
      await attemptSpeech();
    } catch (error) {
      console.error('❌ All speech attempts failed:', error);
      
      // Try English fallback if original language failed
      if (lang !== 'en-IN' && lang !== 'en-US') {
        console.log('🔄 Trying English fallback...');
        try {
          await attemptSpeech(1, 2); // Fewer attempts for fallback
        } catch (fallbackError) {
          console.error('❌ English fallback also failed:', fallbackError);
        }
      }
    }
  };

  /* ───────── cleanup ───────── */
  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop();
      speechSynthesisRef.current?.cancel();
    };
  }, []);

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
      
      /* speak with enhanced voice selection - ALWAYS speak the response */
      console.log(`🎤 Speaking response in ${responseLang}: "${reply.substring(0, 50)}..."`);
      await speak(reply, responseLang);
      
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
      await speak(fallback, userLang);
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
    'hi-IN': { ph:'जननी से बात करें...', send:'भेजें', mic:'बोलें', test:'आवाज़ टेस्ट करें' },
    'te-IN': { ph:"జననితో మాట్లాడండి...", send:'పంపు', mic:'మాట్లాడు', test:'వాయిస్ టెస్ట్' },
    'ta-IN': { ph:"ஜனனியுடன் பேசுங்கள்...", send:'அனுப்பு', mic:'பேச', test:'குரல் சோதனை' },
    'kn-IN': { ph:"ಜನನಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ...", send:'ಕಳುಹೆ', mic:'ಮಾತನಾಡಿ', test:'ಧ್ವನಿ ಪರೀಕ್ಷೆ' },
    'mr-IN': { ph:"जननीसोबत बोला...", send:'पाठवा', mic:'बोला', test:'आवाज चाचणी' },
    'bn-IN': { ph:"জননির সঙ্গে কথা বলুন...", send:'পাঠান', mic:'বলুন', test:'ভয়েস টেস্ট' },
    'gu-IN': { ph:"જનની સાથે વાત કરો...", send:'મોકલો', mic:'બોલો', test:'અવાજ ટેસ્ટ' },
    'ml-IN': { ph:"ജനനിയുമായി സംസാരിക്കുക...", send:'അയയ്ക്കുക', mic:'സംസാരിക്കുക', test:'ശബ്ദ പരിശോധന' },
    'pa-IN': { ph:"ਜਨਨੀ ਨਾਲ ਗੱਲ ਕਰੋ...", send:'ਭੇਜੋ', mic:'ਬੋਲੋ', test:'ਆਵਾਜ਼ ਟੈਸਟ' },
    'ur-IN': { ph:'اپنا سوال لکھیں...', send:'بھیجیں', mic:'بولیں', test:'آواز ٹیسٹ' },
    default: { ph:'Talk to Janani...', send:'Send', mic:'Speak', test:'Test Voice' }
  };
  
  const t = translations[userLang] || translations.default;
  const { ph: placeholder, send, mic: speakLabel, test: testLabel } = t;

  /* ───── Test voice function ─── */
  const testVoice = () => {
    const testMessages = {
      'hi-IN': 'नमस्ते, मैं जननी हूं। मैं आपकी मदद के लिए यहां हूं।',
      'te-IN': 'నమస్కారం, నేను జనని. మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.',
      'ta-IN': 'வணக்கம், நான் ஜனனி. உங்களுக்கு உதவ நான் இங்கே இருக்கிறேன்.',
      'kn-IN': 'ನಮಸ್ಕಾರ, ನಾನು ಜನನಿ. ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.',
      'mr-IN': 'नमस्कार, मी जनानी. मी तुमच्या मदतीसाठी येथे आहे.',
      'bn-IN': 'নমস্কার, আমি জননি। আমি আপনার সাহায্যের জন্য এখানে আছি।',
      'gu-IN': 'નમસ્તે, હું જનની. હું તમારી મદદ માટે અહીં છું.',
      'ml-IN': 'നമസ്കാരം, ഞാൻ ജനനി. നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.',
      'pa-IN': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਜਨਨੀ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ।',
      'ur-IN': 'سلام، میں جننی ہوں۔ میں آپ کی مدد کے لیے یہاں ہوں۔',
      'en-IN': 'Hello, I am Janani. I am here to help you.'
    };
    
    const testMessage = testMessages[userLang] || testMessages['en-IN'];
    speak(testMessage, userLang);
  };

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
          <div>
            Available voices: {availableVoices.length} | User lang: {userLang} | Voices loaded: {voicesLoaded ? '✅' : '⏳'}
          </div>
          <div className="max-h-20 overflow-y-auto">
            <strong>Native voices:</strong> {availableVoices
              .filter(v => v.localService || v.lang.includes(userLang.split('-')[0]))
              .map(v => `${v.name} (${v.lang}) ${v.localService ? '📍' : '☁️'}`)
              .join(', ') || 'None found'}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={testVoice}
              disabled={!voicesLoaded}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
            >
              {testLabel}
            </button>
            <button 
              onClick={() => {
                console.log('🔍 Available voices:', availableVoices);
                console.log('🎯 Selected voice for', userLang, ':', selectBestVoice(userLang));
              }}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Debug Voices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputSection;