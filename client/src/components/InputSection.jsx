// src/components/InputSection.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

function InputSection() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const user = getAuth().currentUser;

  // Google STT
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = localStorage.getItem("lang") || "en-IN"; // fallback
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      handleSubmit(transcript);
    };

    recognitionRef.current.onerror = (e) => {
      console.error("🎙️ Mic Error:", e);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleSubmit = async (customInput) => {
    const finalInput = customInput || input;
    if (!finalInput) return;

    try {
      const res = await axios.post("https://genai-api-endpoint.com/gemini", {
        prompt: finalInput,
      });

      setResponse(res.data.reply);

      // Store to Firestore
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          journal: arrayUnion({
            input: finalInput,
            response: res.data.reply,
            date: new Date().toISOString(),
          }),
        });
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("Error generating response");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl mb-6">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded-xl"
          placeholder="Ask your health buddy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
        >
          ➤
        </button>
        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-full border ${isListening ? "bg-red-500 text-white" : "bg-gray-100"}`}
        >
          🎤
        </button>
      </div>

      {response && (
        <div className="mt-4 p-4 bg-rose-50 rounded-lg text-gray-800 whitespace-pre-wrap">
          <strong>Janani Says:</strong>
          <div>{response}</div>
        </div>
      )}
    </div>
  );
}

export default InputSection;
