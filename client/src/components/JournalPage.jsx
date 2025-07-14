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

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(null); // ❌ not from localStorage
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const todayISO = new Date().toISOString().split('T')[0];

  // 1️⃣ Auth + Fetch Lang & Journal
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const langFromDb = userDoc.data().languageCode || 'en';
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

  // 2️⃣ Fetch entries for today
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

  // 3️⃣ Create journal (in Firestore lang)
  const createJournal = async () => {
    if (entries.length === 0) {
      setError('Please interact at least once today to generate your journal.');
      return;
    }

    if (!lang) {
      setError('Language not set yet. Please wait or refresh.');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const combined = entries
        .map(e => `Q: ${e.input}\nA: ${e.response}`)
        .join('\n\n');

      const prompt = `
You are writing a deeply emotional pregnancy journal — as if it’s written by a mother to her unborn child.

🪔 Guidelines:
- Write entirely in ${lang}
- Do not translate or repeat lines
- Use gentle metaphors (moonlight, heartbeat, warm cocoon, monsoon breeze)
- Keep it short, heart‑touching, and poetic — like a lullaby
- Conclude with this single note line:
Note: This journal entry is crafted to reflect the emotional world of a mother. Some poetic license is used to convey depth and tenderness.

Today the mother shared:
${combined}
`;

      const diary = await getGeminiReply(prompt, lang);

      await setDoc(
        doc(db, 'users', user.uid, 'journals', todayISO),
        { text: diary, createdAt: serverTimestamp() }
      );

      setTodayJournal(diary);
      setMessage('✅ Journal created!');
    } catch (err) {
      console.error(err);
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
