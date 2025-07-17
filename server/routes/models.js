import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1/models',
      { params: { key: process.env.GEMINI_API_KEY } }
    );
    console.log('📦 Available models:', response.data.models.map(m => m.name));
    return res.json(response.data);
  } catch (err) {
    console.error('❌ List models error:', err.message || err);
    return res.status(500).json({ error: 'Could not list models' });
  }
});

export default router;