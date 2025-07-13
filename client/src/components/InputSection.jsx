import React, { useState, useRef, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getGeminiReply } from '../services/geminiApi';
import { franc } from 'franc';

function InputSection({ onReply }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMethod, setInputMethod] = useState(null);
  const silenceTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const user = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';

  // Initialize speech synthesis with better voice handling
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Some browsers need this to populate voices
    const handleVoicesChanged = () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.getVoices();
      }
    };
    
    speechSynthesisRef.current.addEventListener('voiceschanged', handleVoicesChanged);
    
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.removeEventListener('voiceschanged', handleVoicesChanged);
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  /* ---------- Enhanced Text-to-Speech with Native Voices --------- */
  const speak = (text, lang) => {
    if (!speechSynthesisRef.current) return;
    
    speechSynthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Get all available voices
    const voices = speechSynthesisRef.current.getVoices();
    
    // Language-specific voice selection logic
    const getPreferredVoice = () => {
      // Try to find exact match first
      const exactMatch = voices.find(v => v.lang === lang);
      if (exactMatch) return exactMatch;
      
      // Then try language code match (e.g., 'hi' for 'hi-IN')
      const langCode = lang.split('-')[0];
      const langMatch = voices.find(v => v.lang.startsWith(langCode));
      if (langMatch) return langMatch;
      
      // Fallback to any voice that can speak the language
      const fallback = voices.find(v => v.lang.includes(langCode));
      if (fallback) return fallback;
      
      // Default to first available voice
      return voices[0];
    };
    
    const preferredVoice = getPreferredVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Speak with a slight delay to ensure voice is ready
    setTimeout(() => {
      speechSynthesisRef.current.speak(utterance);
    }, 100);
  };

  /* ---------- Language Detection --------- */
  const detectLanguage = (text) => {
    if (text.length < 3) return userLang;
    
    const langMap = {
      hin: 'hi-IN', // Hindi
      tel: 'te-IN', // Telugu
      tam: 'ta-IN', // Tamil
      kan: 'kn-IN', // Kannada
      eng: 'en-IN', // English
      mar: 'mr-IN', // Marathi
      ben: 'bn-IN', // Bengali
      guj: 'gu-IN', // Gujarati
      mal: 'ml-IN', // Malayalam
      pan: 'pa-IN', // Punjabi
      urd: 'ur-IN', // Urdu
    };
    
    const detected = franc(text, { minLength: 3, only: Object.keys(langMap) });
    return langMap[detected] || userLang;
  };

  /* ---------- Enhanced Speech Recognition --------- */
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = userLang;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;
    recognitionRef.current.maxAlternatives = 1;

    // Reset silence timer on any sound
    const resetSilenceTimer = () => {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, 3000); // 3 seconds of silence
    };

    recognitionRef.current.onresult = (event) => {
      resetSilenceTimer();
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      if (event.results[event.results.length - 1].isFinal) {
        setInputMethod('speech');
        const detectedLang = detectLanguage(transcript);
        handleSubmit(transcript, detectedLang);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Recognition error:', event);
      stopListening();
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
    };

    setIsListening(true);
    recognitionRef.current.start();
    resetSilenceTimer();
  };

  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  /* ---------- Enhanced Handle Submission with Mother-Friendly Responses --------- */
  const handleSubmit = async (textVal, forcedLang) => {
    const finalInput = textVal || input.trim();
    if (!finalInput) return;

    try {
      setIsProcessing(true);
      const responseLang = forcedLang || detectLanguage(finalInput);
      const langCode = responseLang.slice(0, 2);

      // Modify the prompt to ensure mother-friendly, optimistic responses
      const ayurvedicPrompt = `Act as a traditional Indian mother giving loving advice to her pregnant daughter. 
      Respond to the following concern in ${langCode} with warm, nurturing tone combining:
      1. Ancient Ayurvedic remedies (use ingredients like ginger, turmeric, ghee, etc.)
      2. Simple yoga asanas (mention trimester-specific safe poses)
      3. Traditional Indian practices (like oil massage, dietary tips)
      4. Emotional support with cultural wisdom (shlokas or proverbs if appropriate)
      5. Home-ready solutions using common Indian kitchen ingredients

      Keep responses practical, safe for pregnancy, and rooted in Indian tradition and response should be given in the same langaue as the ques was asked for.
      The concern is: ${finalInput}`;

      // Get AI response
      const reply = await getGeminiReply(ayurvedicPrompt, langCode);

      // Update UI and store data
      onReply(reply, responseLang, inputMethod || 'text');
      setInput('');
      setInputMethod(null);

      // Speak the response with native voice
      speak(reply, responseLang);

      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          journal: arrayUnion({
            input: finalInput,
            response: reply,
            date: new Date().toISOString(),
            lang: responseLang,
            inputMethod: inputMethod || 'text',
            adviceType: 'ayurvedic_pregnancy'
          }),
        });
      }
    } catch (err) {
      console.error('AI error', err);
      const errorMsg = userLang.includes('hi') ? 'प्रिय बेटी,क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।' : 
                      'Dear beta,sorry an error occurred. Please try again.';
      onReply(errorMsg, userLang, inputMethod || 'text');
      speak(errorMsg, userLang);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    setInputMethod('text');
    handleSubmit();
  };

  // Get localized UI text
  const getLocalizedText = () => {
    const translations = {
      'hi-IN': {
        placeholder: 'अपना प्रश्न पूछें...',
        send: 'भेजें',
        speak: 'बोलकर पूछें'
      },
      'te-IN': {
        placeholder: 'మీ ప్రశ్న అడగండి...',
        send: 'పంపండి',
        speak: 'మాట్లాడి అడగండి'
      },
      'ta-IN': {
        placeholder: 'உங்கள் கேள்வியைக் கேளுங்கள்...',
        send: 'அனுப்பு',
        speak: 'பேசிக் கேளுங்கள்'
      },
      'kn-IN': {
        placeholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
        send: 'ಕಳುಹಿಸಿ',
        speak: 'ಮಾತನಾಡಿ ಕೇಳಿ'
      },
      'mr-IN': {
        placeholder: 'तुमचा प्रश्न विचारा...',
        send: 'पाठवा',
        speak: 'बोलून विचारा'
      },
      'bn-IN': {
        placeholder: 'আপনার প্রশ্ন জিজ্ঞাসা করুন...',
        send: 'পাঠান',
        speak: 'বলে জিজ্ঞাসা করুন'
      },
      'gu-IN': {
        placeholder: 'તમારો પ્રશ્ન પૂછો...',
        send: 'મોકલો',
        speak: 'બોલીને પૂછો'
      },
      'ml-IN': {
        placeholder: 'നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക...',
        send: 'അയയ്ക്കുക',
        speak: 'സംസാരിച്ച് ചോദിക്കുക'
      },
      'pa-IN': {
        placeholder: 'ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ...',
        send: 'ਭੇਜੋ',
        speak: 'ਬੋਲ ਕੇ ਪੁੱਛੋ'
      },
      'ur-IN': {
        placeholder: 'اپنا سوال پوچھیں...',
        send: 'بھیجیں',
        speak: 'بول کر پوچھیں'
      },
      default: {
        placeholder: 'Ask your question...',
        send: 'Send',
        speak: 'Speak'
      }
    };
    
    return translations[userLang] || translations.default;
  };

  const { placeholder, send, speak: speakLabel } = getLocalizedText();

  return (
    <div className="p-4 bg-white shadow rounded-xl w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
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
          className={`px-4 py-2 rounded-full border ${
            isListening ? 'bg-red-500 text-white' : 'bg-gray-100'
          } disabled:opacity-50`}
          title={speakLabel}
        >
          {isProcessing ? '...' : '🎤'}
        </button>
      </div>
    </div>
  );
}

export default InputSection;