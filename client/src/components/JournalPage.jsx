import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';
import './journal.css'; 

const isTrivial = (text) =>
  !text || text.trim().length < 3 || /^(hi|hello|hey|namaste|hola)$/i.test(text.trim());

const journalUITranslations = {
  'en-IN': {
    title: 'Your Daily Journal',
    entriesToday: 'Entries detected today:',
    createButton: "Create Today's Journal",
    generating: 'Generating...',
    journalTitle: "Today's Journal",
    noEntriesError: 'Please interact at least once today to generate your journal.',
    noLanguageError: 'Language not set yet. Please wait or refresh.',
    trivialError: 'Todays messages are just greetings. Have a deeper chat, then try again!',
    successMessage: '✅ Journal created!',
    errorMessage: 'Error generating journal. Please try again.',
    themeLabel: 'Choose Paper Style',
  },
};

const Navbar = ({ translations }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-rose-200">
      <h1 className="text-2xl font-extrabold text-rose-600 tracking-wide">
        {translations.title}
      </h1>
      <div className="flex gap-4 items-center text-sm font-semibold text-gray-700">
        <button onClick={() => navigate('/journal')} className="hover:text-rose-600">
          {translations.journal || 'Journal'}
        </button>
        <button onClick={() => navigate('/memory-vault')} className="hover:text-rose-600">
          {translations.memoryVault || 'Memory Vault'}
        </button>
        <button onClick={() => navigate('/ayurveda')} className="hover:text-rose-600">
          {translations.ayurveda || 'Ayurveda'}
        </button>
        <button onClick={() => navigate('/yoga')} className="hover:text-rose-600">
          {translations.yoga || 'Yoga'}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:ring hover:ring-rose-300"
        >
          👤
        </button>
      </div>
    </nav>
  );
};

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en-IN');
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('plain');
  const [mood, setMood] = useState('🌸 Peaceful');
  const themes = ['plain', 'grid', 'sticky'];

  const todayISO = new Date().toISOString().split('T')[0];
  const t = journalUITranslations[lang] || journalUITranslations['en-IN'];

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const userLang = userDoc.data().language || 'en-IN';
          setLang(userLang);
        }

        const journalSnap = await getDoc(doc(db, 'users', u.uid, 'journals', todayISO));
        if (journalSnap.exists()) {
          setTodayJournal(journalSnap.data().text);
        }
      } catch (err) {
        console.error('Error loading language or journal:', err);
      }
    });
    return () => unsub();
  }, [todayISO]);

  useEffect(() => {
    if (!user) return;
    const fetchTodayEntries = async () => {
      const now = Timestamp.now().toDate();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'users', user.uid, 'entries'),
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt')
      );

      const snap = await getDocs(q);
      setEntries(snap.docs.map((d) => d.data()));
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
You are helping an expectant mother keep a pregnancy journal. Give the journal in mothers point of view, helping her to preserve her pregnancy journey memories with emotion.

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

      await setDoc(doc(db, 'users', user.uid, 'journals', todayISO), {
        text: diary,
        createdAt: serverTimestamp(),
      });

      setTodayJournal(diary);
      setMessage(t.successMessage);
    } catch (err) {
      console.error('❌ Error creating journal:', err);
      setError(t.errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="journal-page overflow-x-hidden">
      <Navbar translations={t} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-pink-600 mb-2 text-center">{t.title}</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {t.entriesToday} <strong>{entries.length}</strong>
        </p>

        <div className="flex justify-center mb-2">
          <button
            onClick={createJournal}
            className="px-6 py-2 rounded-full text-white font-semibold transition-all shadow bg-pink-500 hover:bg-pink-600"
          >
            {creating ? t.generating : t.createButton}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <label className="text-sm text-gray-700 mr-2">{t.themeLabel}:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border border-rose-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-rose-200"
          >
            {themes.map((th) => (
              <option key={th} value={th}>
                {th.charAt(0).toUpperCase() + th.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        {todayJournal && (
          <>
           
            <div className={`journal-paper ${theme}`}>
              <div className="tape-left"></div>
              <div className="tape-right"></div>
              <h3 className="font-bold text-xl mb-3 text-rose-600 border-b border-rose-200 pb-1">
                📓 {t.journalTitle}
              </h3>
              
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-[1.05rem] tracking-wide">
                {todayJournal}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default JournalPage;
