// src/components/InputSection.jsx
import React, { useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getGeminiReply } from '../services/geminiApi';   // create this helper

function InputSection({ onReply }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const user = getAuth().currentUser;
  const userLang = localStorage.getItem('lang') || 'en-IN';   // e.g. hi-IN, te-IN

  /* ---------- Google Speech‑to‑Text --------- */
  const startListening = () => {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('Speech Recognition not supported');
    if (isListening) return;          // avoid double‑start

    recognitionRef.current = new SpeechRec();
    recognitionRef.current.lang = userLang;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      handleSubmit(transcript);       // auto‑submit
      setIsListening(false);
    };
    recognitionRef.current.onerror = (e) => {
      console.error('🎙️ Mic error', e);
      alert('Mic error: ' + e.error);
      setIsListening(false);
    };
    recognitionRef.current.onend = () => setIsListening(false);

    setIsListening(true);
    recognitionRef.current.start();
  };

  /* ---------- Send text to AI & store journal ---------- */
  const handleSubmit = async (textVal) => {
    const finalInput = textVal || input.trim();
    if (!finalInput) return;

    try {
      // 1) get AI reply
      const reply = await getGeminiReply(finalInput, userLang.slice(0, 2)); // 'hi','te',etc.

      // 2) Display in parent (Dashboard)
      onReply(reply);

      // 3) Clear local input box
      setInput('');

      // 4) Store to Firestore for journal
      if (user) {
        const ref = doc(db, 'users', user.uid);
        await updateDoc(ref, {
          journal: arrayUnion({
            input: finalInput,
            response: reply,
            date: new Date().toISOString(),
          }),
        });
      }
    } catch (err) {
      console.error('❌ AI error', err);
      onReply('⚠️ Sorry, I could not process that.');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl w-full max-w-2xl">
      {/* Text + mic row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask your health buddy…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />
        <button
          onClick={() => handleSubmit()}
          className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
        >
          ➤
        </button>
        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-full border ${
            isListening ? 'bg-red-500 text-white' : 'bg-gray-100'
          }`}
          title="Speak"
        >
          🎤
        </button>
      </div>
    </div>
  );
}

export default InputSection;
