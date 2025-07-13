// src/services/geminiApi.js
import axios from 'axios';

/**
 * getGeminiReply
 * @param {string} text   User's question / symptom
 * @param {string} lang   Language code like 'hi', 'te', 'ta', 'en'
 * @returns {Promise<string>} AI reply
 */
export const getGeminiReply = async (text, lang = 'en') => {
  try {
    // 👉 replace with your own backend URL OR Google MakerSuite endpoint
    const { data } = await axios.post(
      'https://YOUR_BACKEND_URL/chat',      // <— change this
      { prompt: text, lang }
    );
    return data.reply;                      // { reply: "..." }
  } catch (err) {
    console.error('Gemini error:', err);
    return 'Sorry, something went wrong 😔';
  }
};
