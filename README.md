# JANANI AAROGYA

**India’s First Multilingual Voice-Based AI Health Companion for Mothers**

Janani Aarogya is a voice-first, GenAI-powered health companion that enables Indian mothers—especially those with low digital literacy—to access personalized care, cultural guidance, and emotional support in their own language through smart voice conversations, auto-generated health responses, transliteration, memory journaling, and stage-based insights.

## Features

- 🎤 Voice-first AI assistant for Indian mothers
- 🗣️ Input & output in multiple Indian languages (Hindi, Telugu, Tamil, etc.)
- 🧠 Gemini-powered personalized responses
- 🔄 Converts Roman Indian language to native script 
- 📱 Text or voice input options
- 🔊 Text-to-Speech output in native voice (e.g., Google हिंदी, Google తెలుగు)
- 👶 Stage-wise guidance: Pre-conception, Pregnancy, Postpartum
- 📔 Memory Vault: Automatically stores meaningful AI interactions as a motherhood journal
- 🧘‍♀️ Maternal Yoga section with safe exercises by stage
- 🌿 Ayurveda remedies curated for mothers
- 📈 Tracks usage streaks and preferences
- 🔐 Firebase Authentication & Firestore DB
- 🚀 Fully deployable full-stack app

## 🧪 Tech Stack

Frontend: React  
Styling: Tailwind CSS  
Backend: Node.js, Express  
AI: Gemini API (Generative AI)  
Voice: Browser STT (Google Web Speech API) + TTS with native voices  
Auth: Firebase Authentication  
Database: Firestore (NoSQL)

## 🚀 Deployment

Frontend: Vercel  
Backend: Vercel (Node.js Express API)  
Database & Auth: Firebase (Firestore + Authentication)

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
### 6. Install Dependencies & Start Client
In a new terminal tab:

cd client
npm install
npm start

