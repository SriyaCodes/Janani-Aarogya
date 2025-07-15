// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputSection from './InputSection';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import dayjs from 'dayjs';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion } from 'framer-motion';
import HeroImage from '../assets/logo.png';

function Dashboard() {
  const [aiReply, setAiReply] = useState('');
  const [stage, setStage] = useState('');
  const [checks, setChecks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderFreq, setReminderFreq] = useState('once');
  const [daysLeft, setDaysLeft] = useState(null);          // ⬅️ NEW
  const [msg, setMsg] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const CHECK_ITEMS = [
    'Drink 3 L Water',
    'Do Maternal Yoga',
    'Eat a Healthy Meal',
    'Take Prenatal Vitamins',
    'Practice Breathing',
  ];

  const todayKey = () => `checklist_${new Date().toISOString().split('T')[0]}`;
  const auth = getAuth();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  /* --- Load saved checklist for today --- */
  useEffect(() => {
    const key = todayKey();
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved) && saved.length === CHECK_ITEMS.length) {
      setChecks(saved);
    } else {
      const fresh = Array(CHECK_ITEMS.length).fill(false);
      setChecks(fresh);
      localStorage.setItem(key, JSON.stringify(fresh));
    }
  }, []);

  /* --- Load user + reminder details --- */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      // User basics
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const d = userSnap.data();
        setStage(d.stage || 'prepregnancy');
        setStreak(d.streak || 0);
      }

      // Reminder settings
      const reminderSnap = await getDoc(
        doc(db, 'users', user.uid, 'reminder', 'settings')
      );
      if (reminderSnap.exists()) {
        const r = reminderSnap.data();
        setReminderDate(r.date || '');
        setReminderFreq(r.frequency || 'once');
      }
    });
    return () => unsub();
  }, [auth]);

  /* --- Re‑compute daysLeft every hour --- */
  useEffect(() => {
    const calc = () => {
      if (!reminderDate) {
        setDaysLeft(null);
        return;
      }
      const diff = dayjs(reminderDate)
        .startOf('day')
        .diff(dayjs().startOf('day'), 'day');
      setDaysLeft(diff);
    };
    calc();
    const id = setInterval(calc, 3600 * 1000); // hourly
    return () => clearInterval(id);
  }, [reminderDate]);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const updateStreakInFirestore = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const data = snap.data();

    if (data.lastCheckinDate === today) return;
    const newStreak =
      data.lastCheckinDate === yesterday ? (data.streak || 0) + 1 : 1;

    await updateDoc(ref, { streak: newStreak, lastCheckinDate: today });
    setStreak(newStreak);
  };

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
    if (title === 'Ayurveda') return navigate(getAyurvedaPath());
    const link = features.find((f) => f.title === title)?.link;
    if (link) navigate(link);
  };

  const features = [
    {
      title: 'Journal',
      desc: 'Daily emotional summaries powered by AI, helping you track mood shifts and celebrate small wins.',
      img: 'https://via.placeholder.com/150',
      link: '/journal',
    },
    {
      title: 'Memory Vault',
      desc: 'Preserve milestones, emotions, and photos in one space you can revisit anytime.',
      img: 'https://via.placeholder.com/150',
      link: '/memory-vault',
    },
    {
      title: 'Ayurveda',
      desc: 'Indian wisdom for your trimester or postpartum — food, herbs & rituals personalised to you.',
      img: 'https://via.placeholder.com/150',
    },
    {
      title: 'Maternal Yoga',
      desc: 'Stage-wise yoga routines to nurture your strength, peace and connection.',
      img: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50 relative overflow-x-hidden">
      <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-rose-200">
        <h1 className="text-2xl font-extrabold text-rose-600 tracking-wide">
          Janani Aarogya
        </h1>
        <div className="flex gap-4 items-center text-sm font-semibold text-gray-700">
          {streak > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
              🔥 {streak}-day Streak
            </span>
          )}
          <button onClick={() => navigate('/journal')} className="hover:text-rose-600">
            Journal
          </button>
          <button
            onClick={() => navigate('/memory-vault')}
            className="hover:text-rose-600"
          >
            Memory Vault
          </button>
          <button
            onClick={() => navigate(getAyurvedaPath())}
            className="hover:text-rose-600"
          >
            Ayurveda
          </button>
          <button onClick={() => navigate(getYogaPath())} className="hover:text-rose-600">
            Yoga
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center hover:ring hover:ring-rose-300"
          >
            👤
          </button>
        </div>
      </nav>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto mt-6 bg-white border border-rose-100 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-8 hover:shadow-pink-200"
      >
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <h2 className="text-4xl font-bold text-rose-700 mb-4 leading-snug">
            A gentle companion for every Indian mother
          </h2>
          <p className="text-gray-700 mb-2 leading-relaxed">
            Janani Aarogya blends AI with ancient Indian care wisdom to support
            rural mothers — across pre-pregnancy, pregnancy, and postpartum.
          </p>
          <p className="text-gray-700">
            Voice-first, language-aware and deeply personal. From Ayurveda to
            memories, it walks with you.
          </p>
        </motion.div>
        <motion.img
          src={HeroImage}
          alt="Janani Aarogya Illustration"
          className="w-full md:w-80 rounded-xl shadow-md object-cover"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
      </motion.section>

      {/* --- Countdown Banner --- */}
      {daysLeft !== null && (
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            {daysLeft > 0 && (
              <p className="text-blue-700 font-semibold">
                🩺 {daysLeft}{' '}
                {daysLeft === 1 ? 'day' : 'days'} left until your doctor visit on{' '}
                {dayjs(reminderDate).format('D MMM YYYY')}
              </p>
            )}
            {daysLeft === 0 && (
              <p className="text-green-700 font-semibold">
                🩺 Today is your scheduled doctor visit!
              </p>
            )}
            {daysLeft < 0 && (
              <p className="text-gray-600">
                🩺 Your scheduled visit date has passed.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Existing components below */}
      <div className="mt-8 px-4">
        <div className="flex justify-center">
          <InputSection onReply={setAiReply} />
        </div>

        {aiReply && (
          <div className="mt-4 mx-auto w-11/12 md:w-2/3 bg-white p-4 rounded-lg shadow text-gray-800">
            <strong>Janani Says:</strong>
            <div>{aiReply}</div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Checklist */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-pink-600 mb-3">
              🌸 Daily Wellness Checklist
            </h2>
            <ul className="space-y-2">
              {CHECK_ITEMS.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checks[idx] || false}
                    onChange={async () => {
                      const updated = [...checks];
                      updated[idx] = !updated[idx];
                      setChecks(updated);
                      localStorage.setItem(todayKey(), JSON.stringify(updated));
                      if (updated.every(Boolean)) {
                        triggerCelebration();
                        await updateStreakInFirestore();
                      }
                    }}
                    className="w-5 h-5 text-pink-500 focus:ring-pink-400"
                  />
                  <span
                    className={
                      checks[idx] ? 'line-through text-gray-400' : 'text-gray-700'
                    }
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reminder */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-pink-600 mb-3">
              🗓️ Doctor‑Visit Reminder
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repeat</label>
                <select
                  value={reminderFreq}
                  onChange={(e) => setReminderFreq(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="once">Once</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button
                onClick={saveReminder}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium"
              >
                Save Reminder
              </button>
              {msg && (
                <p
                  className={`text-sm ${
                    msg.type === 'success' ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {streak > 0 && (
          <div className="mt-6 max-w-xl mx-auto bg-white border-2 border-yellow-300 rounded-lg shadow-md p-6 text-center animate-pulse">
            <h2 className="text-xl font-bold text-yellow-600 mb-1">
              🔥 You're on a Streak!
            </h2>
            <p className="text-lg text-gray-700">
              Day {streak} of consistency
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Keep going, you're doing amazing 💪
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {features.map(({ title, desc, img }) => (
            <div
              key={title}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img src={img} alt={title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-pink-600">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{desc}</p>
                <button
                  onClick={() => handleNavigate(title)}
                  className="text-sm font-medium text-white bg-pink-500 px-4 py-1.5 rounded hover:bg-pink-600"
                >
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={280}
            recycle={false}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
