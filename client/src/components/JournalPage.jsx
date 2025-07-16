// src/pages/JournalPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';
import './journal.css';
import Navbar from '../components/Navbar';
import journalTranslations from '../translations/journalTranslations';

const isTrivial = (text) =>
  !text || text.trim().length < 3 || /^(hi|hello|hey|namaste|hola)$/i.test(text.trim());

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en-IN');
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('plain');
  const themes = ['plain', 'grid', 'sticky'];
const navigate = useNavigate();

  const todayISO = new Date().toISOString().split('T')[0];
  const t = journalTranslations[lang] || journalTranslations['en-IN'];

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setLang(userDoc.data().language || 'en-IN');
        }

        const journalSnap = await getDoc(doc(db, 'users', u.uid, 'journals', todayISO));
        if (journalSnap.exists()) {
          setTodayJournal(journalSnap.data().text);
        }
      } catch (err) {
        console.error('Error loading journal/lang:', err);
      }
    });
    return () => unsub();
  }, [todayISO]);

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

  const createJournal = async () => {
    if (!entries.length) {
      setError(t.noEntriesError);
      return;
    }

    if (!lang) {
      setError(t.noLanguageError);
      return;
    }

    const meaningful = entries.filter(
      (e) => !isTrivial(e.input) && !isTrivial(e.response)
    );

    if (!meaningful.length) {
      setError(t.trivialError);
      return;
    }

    const combined = meaningful
      .map((e) => `Q: ${e.input}\nA: ${e.response}`)
      .join('\n\n');

    const prompt = `
You are helping an expectant mother keep a pregnancy journal. Give the journal in mother's point of view, helping her to preserve her pregnancy journey memories with emotion.

Rules:
- You must write **only in ${lang.split('-')[0]}**. Do not mix with other languages.
- You must write fully and ONLY in native script.
- Never mix Roman script or English.
- Never translate or explain anything in English except when the user language is english.
- Use ONLY what she actually shared today.
- if the conversation is just a casual one like hi how are you, give output as something like "today, I interacted with Janani Aarogya..." 
- If it's longer, use a gentle, lyrical tone, showcasing the emotions of the mother (max ~120 words).
- Never switch languages — use ${lang.split('-')[0]} throughout.
- Never invent new events or feelings. Use only feelings and events shared by user.
- if the user shares something about her baby, represent the emotional love towards her baby in a creative way.

Mother's conversation today:
${combined}
    `.trim();

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
      setMessage(t.successMessage);
    } catch (err) {
      console.error('❌ Error creating journal:', err);
      setError(t.errorMessage);
    } finally {
      setCreating(false);
    }
  };
const handleCreateEntry = () => {
  navigate('/journal'); // ✅ or use the actual route where user writes new journal
};
return (
  <div className="journal-page bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 min-h-screen pt-0">
    {/* 🌸 Navbar */}
    <Navbar />

    {/* Page Heading + Description */}
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <h1 className="text-3xl font-bold text-rose-700 mb-2 font-serif text-center">
        {t.heading}
      </h1>
      <p className="text-md text-gray-700 text-center mb-6 max-w-xl mx-auto font-serif">
        {t.description}
      </p>

      {/* 🪄 Journal Card */}
      <div className="bg-white rounded-xl shadow-xl border border-rose-100 p-6 md:p-8 relative overflow-hidden">
        {/* 📌 Decorative */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-pink-200"></div>

        {/* Card Content */}
        <div className="flex flex-col justify-center items-center text-center space-y-4">
          <p className="text-rose-600 font-medium">
            {t.entriesToday}: <span className="font-bold">{entries.length}</span>
          </p>

          <button
            onClick={() => {
              if (entries.length === 0) {
                setError(t.noEntriesError);
              } else {
                createJournal();
              }
            }}
            disabled={creating}
            className={`${
              creating ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
            } text-white px-5 py-2 rounded-lg text-sm shadow-md transition`}
          >
            {creating ? t.creating : t.createBtn}
          </button>

          {/* ✅ Show error/success */}
          {error && <p className="text-red-500 text-sm italic mt-2">{error}</p>}
          {message && <p className="text-green-600 text-sm italic mt-2">{message}</p>}

          {/* 📓 Show journal if exists */}
          {todayJournal && (
            <div className="journal-paper mt-6 w-full relative">
              <div className="tape-left"></div>
              <div className="tape-right"></div>

              <h3 className="font-bold text-xl mb-3 text-rose-600 border-b border-rose-200 pb-1">
                {t.journalTitle}
              </h3>

              <div className="text-gray-600 text-sm mb-2">
                {new Date(todayISO).toLocaleDateString(lang || 'en-IN', t.dateFormat)}
              </div>

              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-[1.05rem] tracking-wide">
                {todayJournal}
              </p>
            </div>
          )}
        </div>

        {/* If journal not created yet */}
        {!todayJournal && entries.length > 0 && (
          <div className="text-center text-gray-500 italic mt-6">
            {t.noJournalYet}
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default JournalPage;
