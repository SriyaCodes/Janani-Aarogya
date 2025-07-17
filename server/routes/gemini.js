import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not set in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

router.post('/', async (req, res) => {
  try {
    const { prompt, lang } = req.body;

console.log("🔍 Received prompt:", prompt);
console.log("🌐 Language code:", lang);

if (!prompt) {
  return res.status(400).json({ error: 'Prompt is required' });
}


    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    res.json({ reply: text });

  } catch (err) {
    console.error('❌ Gemini API error:', err?.response || err.message || err);
    if (err.response?.status === 429) {
    return res.status(429).json({
      error: 'Quota exceeded or too many requests. Try again later.',
    });
  }
    res.status(500).json({
      error: err.message || 'Failed to generate response',
      details: err.stack || err,
    });
  }
});


export default router;
