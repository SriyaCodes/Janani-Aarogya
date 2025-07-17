#JANANI AAROGYA

**India’s First Multilingual Voice-Based AI Health Companion for Mothers**

Janani Aarogya is a voice-first, AI-powered platform that empowers Indian mothers—especially those with low digital literacy—to access health support in their own language.

---

## Features

- 🎤 Voice-first AI assistant for Indian mothers
- 🗣️ Input & output in multiple Indian languages (Hindi, Telugu, Tamil, etc.)
- 🧠 Gemini-powered personalized responses
- 🔄 Converts Roman Indian language to native script (e.g., "naku vomit vastundi" → "నాకు వాంతి వస్తోంది")
- 📱 Text or voice input options
- 🔊 Text-to-Speech output in native voice (e.g., Google हिंदी, Google తెలుగు)
- 👶 Stage-wise guidance: Pre-conception, Pregnancy, Postpartum
- 📔 Memory Vault: Automatically stores meaningful AI interactions as a motherhood journal
- 🧘‍♀️ Maternal Yoga section with safe exercises by stage
- 🌿 Ayurveda remedies curated for mothers
- 📈 Tracks usage streaks and preferences
- 🔐 Firebase Authentication & Firestore DB
- 🚀 Fully deployable full-stack app

---

## ⚙️ Local Development Setup

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

git clone https://github.com/SriyaCodes/Janani-Aarogya.git

### 2. Navigate to the Project Directory

cd Janani-Aarogya
### 3. Create .env File 
Inside the server folder:
GEMINI_API_KEY=AIzaSyDD8B2tI77KaVg8h7L6GYh7wZPVntmIw90
### 4. Install Dependencies & Start Server
cd server
npm install
npm start
💻 Frontend Setup
### 6. Install Dependencies & Start Client
In a new terminal tab:
cd client
npm install
npm start

🧪 Tech Stack
Frontend: React, Tailwind CSS

Backend: Node.js, Express

AI: Gemini API (Generative AI)

Voice Input: Google STT

Transliteration: @ai4bharat/indic-transliteration

Voice Output: Browser TTS with native voices

Auth & DB: Firebase Auth + Firestore

🚀 Deployment
Frontend: Vercel

Backend: Vercel (Express API)

Firebase: Firestore & Auth




