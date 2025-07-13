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
    const { prompt, stage = 'pregnancy', language = 'English' } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // ✨ Customize prompt with tone, stage, and language
    const customPrompt = `
You are Janani Aarogya, a caring and culturally sensitive AI health companion for Indian women.
This user is currently in the ${stage} stage and prefers responses in ${language}.
Your goal is to provide answers that are gentle, supportive, emotionally warm, and easy to understand.
Avoid medical jargon. Keep it friendly and human-like.

Question: ${prompt}
`;

    const result = await model.generateContent(customPrompt);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
