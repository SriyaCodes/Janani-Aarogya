import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';

// Helper to skip trivial messages like "hi"
const isTrivial = (text) =>
  !text ||
  text.trim().length < 3 ||
  /^(hi|hello|hey|namaste|hola)$/i.test(text.trim());

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(null);
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const todayISO = new Date().toISOString().split('T')[0];

  // 1️⃣ Load authenticated user + language + journal
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const langFromDb = userDoc.data().languageShort || 'en';

          console.log('📣 Language loaded:', langFromDb); // 🔍 DEBUG
          setLang(langFromDb);
        }

        const journalSnap = await getDoc(
          doc(db, 'users', u.uid, 'journals', todayISO)
        );
        if (journalSnap.exists()) {
          setTodayJournal(journalSnap.data().text);
        }
      } catch (err) {
        console.error('Error loading language or journal:', err);
      }
    });
    return () => unsub();
  }, []);

  // 2️⃣ Fetch today's entries
  useEffect(() => {
    if (!user) return;

    const fetchTodayEntries = async () => {
      const now = Timestamp.now().toDate();
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      const end = new Date(now); end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'users', user.uid, 'entries'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt')
      );

      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => d.data()));
    };

    fetchTodayEntries();
  }, [user]);

  // 3️⃣ Create today's journal using actual conversations
  const createJournal = async () => {
    
    if (!entries.length) {
      setError('Please interact at least once today to generate your journal.');
      return;
    }

    if (!lang) {
      setError('Language not set yet. Please wait or refresh.');
      return;
    }

    const meaningful = entries.filter(
      (e) => !isTrivial(e.input) && !isTrivial(e.response)
    );

    if (!meaningful.length) {
      setError(
        'Today’s messages are just greetings. Have a deeper chat, then try again!'
      );
      return;
    }

    const combined = meaningful
      .map((e) => `Q: ${e.input}\nA: ${e.response}`)
      .join('\n\n');

    const prompt = `
You are helping an expectant mother keep a pregnancy journal.

Rules:
- You must write **only in ${lang}**. Do not mix with other languages.
- You must write fully and ONLY in native ${lang} script.
- Never mix Roman script or English.
- Never translate or explain anything in English except when the user language is english.
- Use ONLY what she actually shared today.
- If the conversation is SHORT (under 4 lines), respond with just 1–2 heartfelt sentences.
- If it’s longer, you may use a gentle, lyrical tone (max ~120 words).
- Never switch languages — use ${lang} throughout.
- Never invent new events or feelings.
-if the user shares something about her baby, give story like emotional feeling, but in a short way.
Mother's conversation today:
${combined}
    `.trim();
console.log('📤 Prompt to Gemini:', prompt);
console.log('🌐 Language being sent:', lang);

    console.log('📤 Prompt sent to Gemini:\n', prompt); // 🔍 DEBUG

    try {
      setCreating(true);
      setError('');
      setMessage('');

      const diary = await getGeminiReply(prompt, lang, 'journal');

      await setDoc(
        doc(db, 'users', user.uid, 'journals', todayISO),
        { text: diary, createdAt: serverTimestamp() }
      );

      setTodayJournal(diary);
      setMessage('✅ Journal created!');
    } catch (err) {
      console.error('❌ Error creating journal:', err);
      setError('Error generating journal. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Your Daily Journal</h2>

      <p className="text-sm text-gray-600 mb-2">
        Entries detected today: <strong>{entries.length}</strong>
      </p>

      <button
        onClick={createJournal}
        disabled={creating || entries.length === 0 || !lang}
        className={`mb-6 px-4 py-2 rounded ${
          entries.length === 0 || !lang
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {creating ? 'Generating…' : "Create Today's Journal"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {todayJournal && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">📓 Today's Journal</h3>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{todayJournal}</p>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
