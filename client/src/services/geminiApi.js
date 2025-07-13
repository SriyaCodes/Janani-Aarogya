// src/services/geminiApi.js
import axios from 'axios';

/**
 * @param {string} prompt  User question
 * @param {string} lang    'hi' | 'te' | 'ta' | 'en' ...
 */
export const getGeminiReply = async (prompt, lang) => {
  try {
    // TODO: replace with your backend or MakerSuite endpoint
    const { data } = await axios.post(
      'http://localhost:5000/api/gemini',
      { prompt, lang }
    );
    return data.reply || 'No reply.';
  } catch (err) {
    console.error('Gemini API error:', err);
    throw err;
  }
};
