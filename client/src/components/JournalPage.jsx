// src/pages/JournalPage.jsx
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
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [journals, setJournals] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const todayISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTodayEntries = async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(); end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'users', user.uid, 'entries'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt')
      );

      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => d.data()));
    };

    const fetchAllJournals = async () => {
      const snap = await getDocs(collection(db, 'users', user.uid, 'journals'));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date string descending
      data.sort((a, b) => b.id.localeCompare(a.id));
      setJournals(data);
    };

    fetchTodayEntries();
    fetchAllJournals();
  }, [user]);

  const createJournal = async () => {
    if (entries.length === 0) {
      setError('Please interact at least once today to generate your journal.');
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
You are writing a very special, emotional pregnancy journal — as if it’s written by a mother to her unborn baby.

Even if the mother didn’t express much, reflect her inner world — her emotions, her care, her fatigue, her love — through soft, poetic language.

🪔 Style:
- Write in the user’s language
- Use gentle metaphors (like: heartbeat, soft sky, warm cocoon, monsoon breeze)
- Reflect deep maternal love, not just advice
- Keep it short and beautiful — like a lullaby in words
- Avoid listing things; instead, turn them into emotional memories
- Imagine this journal will be shown to the baby one day

Today, this is what the mother shared with her AI:
${combined}
`;

      const diary = await getGeminiReply(prompt, 'hi');

      await setDoc(
        doc(db, 'users', user.uid, 'journals', todayISO),
        {
          text: diary,
          createdAt: serverTimestamp()
        }
      );

      setMessage('✅ Journal created!');

      // Refetch full journal list to reflect latest overwrite
      const snap = await getDocs(collection(db, 'users', user.uid, 'journals'));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a, b) => b.id.localeCompare(a.id));
      setJournals(data);

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
        disabled={creating || entries.length === 0}
        className={`mb-6 px-4 py-2 rounded ${
          entries.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {creating ? 'Generating…' : "Create Today's Journal"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="space-y-4">
        {journals.map(j => (
          <div key={j.id} className="p-4 bg-white shadow rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">📅 {j.id}</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{j.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
