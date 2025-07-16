import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1/models',
      {
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    console.log('📦 Available models:', response.data.models.map(m => m.name));
    return res.status(200).json(response.data);
  } catch (err) {
    console.error('❌ List models error:', err.message || err);
    return res.status(500).json({ error: 'Could not list models' });
  }
}
