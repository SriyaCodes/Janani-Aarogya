import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getGeminiReply } from '../services/geminiApi';
import Navbar from './Navbar';
import './journal.css';

const isTrivial = (text) =>
  !text ||
  text.trim().length < 3 ||
  /^(hi|hello|hey|namaste|hola)$/i.test(text.trim());

const journalUITranslations = {
  'en-IN': {
    title: 'Your Daily Journal',
    entriesToday: 'Messages today:',
    createButton: 'Create Today’s Journal',
    generating: 'Generating...',
    journalTitle: 'Today’s Journal',
    noEntriesError: 'Please interact at least once today to create journal.',
    noLanguageError: 'Language not set yet. Please wait or refresh.',
    trivialError: 'Todays messages are just greetings. Have a deeper chat, then try again!',
    successMessage: '✅ Journal created!',
    errorMessage: 'Error generating journal. Please try again.',
    themeLabel: 'Choose Paper Style',
  },
  'hi-IN': {
    title: 'आपकी दैनिक डायरी',
    entriesToday: 'आज के संवाद:',
    createButton: "आज की डायरी बनाएं",
    generating: 'बना रहा है...',
    journalTitle: "आज की डायरी",
    noEntriesError: 'कृपया जर्नल बनाने के लिए आज कम से कम एक बार बातचीत करें।',
    noLanguageError: 'भाषा अभी सेट नहीं हुई है। कृपया प्रतीक्षा करें या पृष्ठ को ताज़ा करें।',
    trivialError: 'आज के संवाद केवल अभिवादन हैं। कृपया कुछ गहरी बातचीत करके फिर कोशिश करें!',
    successMessage: '✅ डायरी बन गई!',
    errorMessage: 'डायरी बनाने में त्रुटि। कृपया पुनः प्रयास करें।',
    themeLabel: 'कागज़ का प्रकार चुनें',
  },
  'te-IN': {
    title: 'మీ రోజువారీ జర్నల్',
    entriesToday: 'ఈరోజు చర్చలు:',
    createButton: "ఈరోజు జర్నల్‌ను సృష్టించండి",
    generating: 'సృష్టిస్తోంది...',
    journalTitle: "ఈరోజు జర్నల్",
    noEntriesError: 'ఈరోజు మీ జర్నల్‌ను సృష్టించడానికి కనీసం ఒకసారి సంభాషణ చేయండి.',
    noLanguageError: 'భాష ఇంకా సెటప్ కాలేదు. దయచేసి వేచి ఉండండి లేదా పేజీని రిఫ్రెష్ చేయండి.',
    trivialError: 'ఈరోజు వార్తలు కేవలం శుభాకాంక్షలే. లోతైన సంభాషణను కొనసాగించండి, తర్వాత మళ్లీ ప్రయత్నించండి!',
    successMessage: '✅ జర్నల్ విజయవంతంగా సృష్టించబడింది!',
    errorMessage: 'జర్నల్ సృష్టించడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.',
    themeLabel: 'కాగితం శైలి ఎంచుకోండి',
  },
  // Add other languages below if needed
};

const JournalPage = () => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(null);
  const [entries, setEntries] = useState([]);
  const [todayJournal, setTodayJournal] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('plain');
  const themes = ['plain', 'grid', 'sticky'];

  const todayISO = new Date().toISOString().split('T')[0];
  const t = journalUITranslations[lang] || journalUITranslations['en-IN'];

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) return;
      setUser(u);

      const userRef = doc(db, 'users', u.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userLang = userSnap.data().language;
        if (userLang) setLang(userLang);
      }

      const journalSnap = await getDoc(doc(db, 'users', u.uid, 'journals', todayISO));
      if (journalSnap.exists()) {
        setTodayJournal(journalSnap.data().text);
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
        where('timestamp', '>=', start),
        where('timestamp', '<=', end),
        orderBy('timestamp')
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

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const combined = meaningful
        .map((e) => `👩 ${e.input}\n🤖 ${e.response}`)
        .join('\n\n');

      const prompt = `Summarize today’s maternal health conversation between a mother and her AI companion into a warm, supportive journal entry.\n\n${combined}`;

      const diary = await getGeminiReply(prompt, lang, 'journal');

      await setDoc(doc(db, 'users', user.uid, 'journals', todayISO), {
        text: diary,
        createdAt: serverTimestamp(),
      });

      setTodayJournal(diary);
      setMessage(t.successMessage);
    } catch (err) {
      setError(t.errorMessage);
      console.error('Journal creation failed:', err);
    }

    setCreating(false);
  };

  return (
    <div className="journal-page overflow-x-hidden">
      <Navbar lang={lang} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-pink-600 mb-2 text-center">{t.title}</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {t.entriesToday} <strong>{entries.length}</strong>
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={createJournal}
            disabled={creating || entries.length === 0 || !lang}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all shadow ${
              creating || entries.length === 0 || !lang
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {creating ? t.generating : t.createButton}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        {todayJournal && (
          <div className={`journal-paper ${theme}`}>
            <div className="tape-left"></div>
            <div className="tape-right"></div>
            <h3 className="font-bold text-xl mb-3 text-rose-600 border-b border-rose-200 pb-1">
              📓 {t.journalTitle}
            </h3>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-[1.05rem] tracking-wide">
              {todayJournal}
            </p>
            <div className="flex justify-center mt-4">
              <label className="text-sm text-gray-700 mr-2">{t.themeLabel}:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border border-rose-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-rose-200"
              >
                {['plain', 'grid', 'sticky'].map((th) => (
                  <option key={th} value={th}>
                    {th.charAt(0).toUpperCase() + th.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalPage;
