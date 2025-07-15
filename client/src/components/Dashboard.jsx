import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputSection from './InputSection';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import dayjs from 'dayjs';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function Dashboard() {
  /* ─────────────────────── state ─────────────────────── */
  const [aiReply,   setAiReply]        = useState('');
  const [stage,     setStage]          = useState('');
  const [checks,    setChecks]         = useState([]);
  const [streak,    setStreak]         = useState(0);

  const [reminderDate, setReminderDate] = useState('');
  const [reminderFreq, setReminderFreq] = useState('once');
  const [msg,          setMsg]          = useState(null);

  const [showConfetti, setShowConfetti] = useState(false);

  /* ─────────────────────── setup ─────────────────────── */
  const CHECK_ITEMS = [
    'Drink 3 L Water',
    'Do Maternal Yoga',
    'Eat a Healthy Meal',
    'Take Prenatal Vitamins',
    'Practice Breathing',
  ];
  const todayKey = () => `checklist_${new Date().toISOString().split('T')[0]}`;

  const auth     = getAuth();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  /* ───────────────── Checklist localStorage ───────────── */
  useEffect(() => {
    const key   = todayKey();
    const saved = JSON.parse(localStorage.getItem(key) || '[]');

    if (Array.isArray(saved) && saved.length === CHECK_ITEMS.length) {
      setChecks(saved);
    } else {
      const fresh = Array(CHECK_ITEMS.length).fill(false);
      setChecks(fresh);
      localStorage.setItem(key, JSON.stringify(fresh));
    }
  }, []);

  /* ───────────────── Stage (once) ─────────────────────── */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setStage(d.stage || 'prepregnancy');
        setStreak(d.streak || 0);             // <<< load streak here
      }
    });
    return () => unsub();
  }, [auth]);

  /* ───────────────── Update streak & fireworks ───────── */
  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const updateStreakInFirestore = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref   = doc(db, 'users', user.uid);
    const snap  = await getDoc(ref);
    if (!snap.exists()) return;

    const today     = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const data      = snap.data();

    if (data.lastCheckinDate === today) {
      // already counted; keep existing streak
      return;
    }

    const newStreak =
      data.lastCheckinDate === yesterday ? (data.streak || 0) + 1 : 1;

    await updateDoc(ref, {
      streak: newStreak,
      lastCheckinDate: today,
    });

    setStreak(newStreak);
  };

  /* ───────────────── Reminder save ───────────────────── */
  const saveReminder = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!reminderDate) {
      setMsg({ type: 'error', text: 'Please pick a date.' });
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', user.uid, 'reminder', 'settings'),
        {
          email: user.email,
          date: reminderDate,
          frequency: reminderFreq,
        },
        { merge: true }
      );
      setMsg({ type: 'success', text: 'Reminder saved!' });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Could not save reminder.' });
    }
  };

  /* ───────────────── Paths helpers ───────────────────── */
  const getAyurvedaPath = () =>
    stage === 'prepregnancy'
      ? '/preconception-ayurveda'
      : stage === 'pregnancy'
      ? '/pregnancy-ayurveda'
      : '/post-ayurveda';

  const getYogaPath = () =>
    stage === 'prepregnancy'
      ? '/preconception-yoga'
      : stage === 'pregnancy'
      ? '/pregnancy-yoga'
      : '/post-yoga';

  const handleNavigate = (title) => {
    if (title === 'Maternal Yoga') return navigate(getYogaPath());
    if (title === 'Ayurveda')      return navigate(getAyurvedaPath());

    const link = features.find(f => f.title === title)?.link;
    if (link) navigate(link);
  };

  /* ───────────────── Features list ───────────────────── */
  const features = [
    { title: 'Memory Vault', desc: 'Capture and relive your motherhood journey.', img: 'https://via.placeholder.com/100', link: '/memory-vault' },
    { title: 'Maternal Yoga', desc: 'Curated yoga routines for each stage.', img: 'https://via.placeholder.com/100' },
    { title: 'Ayurveda',      desc: 'Ayurvedic wisdom tailored for you.',    img: 'https://via.placeholder.com/100' },
    { title: 'Journal',       desc: 'Create daily emotional summaries.',      img: 'https://via.placeholder.com/100', link: '/journal' },
  ];

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <div className="min-h-screen bg-rose-50 relative overflow-hidden">
      {/* ───── Navbar ───── */}
      <nav className="bg-white shadow-md flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-pink-600">Janani Aarogya</h1>

        <div className="flex gap-4 text-sm font-medium items-center">
          {/* 🔥 streak badge always visible */}
          {streak > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              🔥 {streak}-day Streak
            </span>
          )}
          <button onClick={() => navigate('/memory-vault')}  className="hover:text-pink-600">Memory Vault</button>
          <button onClick={() => navigate(getYogaPath())}    className="hover:text-pink-600">Maternal Yoga</button>
          <button onClick={() => navigate(getAyurvedaPath())}className="hover:text-pink-600">Ayurveda</button>
          <button onClick={() => navigate('/journal')}       className="hover:text-pink-600">Journal</button>
          <button onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:ring hover:ring-pink-300">
            👤
          </button>
        </div>
      </nav>

      {/* ───── Heading ───── */}
      <h2 className="text-center mt-6 text-2xl font-semibold text-pink-700">
        Welcome to Janani Aarogya, your health companion
      </h2>

      {/* ───── Doctor‑visit Reminder card ───── */}
      <div className="mt-6 max-w-xl mx-auto bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-semibold text-pink-600 mb-3">🗓️ Doctor‑Visit Reminder</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Visit Date</label>
            <input type="date" value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Repeat</label>
            <select value={reminderFreq}
              onChange={(e) => setReminderFreq(e.target.value)}
              className="w-full border rounded p-2">
              <option value="once">Once</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button onClick={saveReminder}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium">
            Save Reminder
          </button>
          {msg && (
            <p className={`text-sm ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {msg.text}
            </p>
          )}
        </div>
      </div>

      {/* ───── Checklist ───── */}
      <div className="mt-6 max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-pink-600 mb-3">🌸 Daily Wellness Checklist</h2>
        <ul className="space-y-2">
          {CHECK_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checks[idx] || false}
                onChange={async () => {
                  // toggle and persist
                  const updated      = [...checks];
                  updated[idx]       = !updated[idx];
                  setChecks(updated);
                  localStorage.setItem(todayKey(), JSON.stringify(updated));

                  // if all completed → update streak + confetti
                  if (updated.every(Boolean)) {
                    triggerCelebration();
                    await updateStreakInFirestore();
                  }
                }}
                className="w-5 h-5 text-pink-500 focus:ring-pink-400" />
              <span className={checks[idx] ? 'line-through text-gray-400' : 'text-gray-700'}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ───── Persistent streak card ───── */}
      {streak > 0 && (
        <div className="mt-6 max-w-xl mx-auto bg-white border-2 border-yellow-300 rounded-lg shadow-md p-6 text-center animate-pulse">
          <h2 className="text-xl font-bold text-yellow-600 mb-1">🔥 You're on a Streak!</h2>
          <p className="text-lg text-gray-700">Day {streak} of consistency</p>
          <p className="text-sm text-gray-500 mt-1">Keep going, you're doing amazing 💪</p>
        </div>
      )}

      {/* ───── AI input & response ───── */}
      <div className="mt-6 flex justify-center">
        <InputSection onReply={setAiReply} />
      </div>
      {aiReply && (
        <div className="mt-4 mx-auto w-11/12 md:w-2/3 bg-white p-4 rounded-lg shadow text-gray-800">
          <strong>Janani Says:</strong>
          <div>{aiReply}</div>
        </div>
      )}

      {/* ───── Feature thumbnails ───── */}
      <div className="mt-10 space-y-6 px-4 max-w-3xl mx-auto">
        {features.map(({ title, desc, img }) => (
          <div key={title} className="flex bg-white shadow-md rounded-lg overflow-hidden">
            <img src={img} alt={title} className="w-28 h-28 object-cover" />
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-1 text-pink-600">{title}</h3>
              <p className="text-sm text-gray-600 mb-2">{desc}</p>
              <button
                onClick={() => handleNavigate(title)}
                className="text-sm font-medium text-white bg-pink-500 px-4 py-1.5 rounded hover:bg-pink-600">
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ───── Confetti overlay ───── */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} numberOfPieces={280} recycle={false} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
