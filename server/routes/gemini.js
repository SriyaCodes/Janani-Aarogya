// server/routes/gemini.js
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

console.log('🌐 GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { prompt, lang } = req.body;
    console.log('📥 PROMPT:', prompt);
    console.log('🌍 LANG:', lang);

    if (!prompt || !lang) {
      console.warn('⚠️ Missing prompt or lang');
      return res.status(400).json({ error: 'Missing prompt or language' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response; 
    const text = response.text();
    console.log('✅ Gemini responded:', text);

    res.json({ reply: text });

  } catch (err) {
    console.error('❌ GENERATIVE API ERROR:', err.response?.data || err.message || err);
    res.status(500).json({
      error: err.message || 'Failed to generate response',
      details: err.response?.data || err.stack,
    });
  }
});

export default router;
