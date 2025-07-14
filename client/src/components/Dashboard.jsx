import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputSection from './InputSection';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Dashboard() {
  const [aiReply, setAiReply] = useState('');
  const [stage, setStage] = useState('');
  const [checks, setChecks] = useState([]);
  const navigate = useNavigate();

  const CHECK_ITEMS = [
    'Drink 3L Water',
    'Do Maternal Yoga',
    'Eat a Healthy Meal',
    'Take Prenatal Vitamins',
    'Practice Breathing',
  ];

  const todayKey = () => `checklist_${new Date().toISOString().split('T')[0]}`;

  // 🔄 Load checklist from localStorage
  useEffect(() => {
    const key = todayKey();
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(saved) && saved.length === CHECK_ITEMS.length) {
        setChecks(saved);
      } else {
        const fresh = Array(CHECK_ITEMS.length).fill(false);
        setChecks(fresh);
        localStorage.setItem(key, JSON.stringify(fresh));
      }
    } catch (e) {
      const fallback = Array(CHECK_ITEMS.length).fill(false);
      setChecks(fallback);
      localStorage.setItem(key, JSON.stringify(fallback));
    }
  }, []);

  // 🌿 Fetch user stage
  useEffect(() => {
    const fetchStage = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userStage = userDoc.data().stage || 'prepregnancy';
          setStage(userStage);
        }
      }
    };
    fetchStage();
  }, []);

  // 🌿 Stage-based routing
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
    switch (title) {
      case 'Maternal Yoga':
        navigate(getYogaPath());
        break;
      case 'Ayurveda':
        navigate(getAyurvedaPath());
        break;
      default:
        const link = features.find((f) => f.title === title)?.link;
        if (link) navigate(link);
    }
  };

  const features = [
    {
      title: 'Memory Vault',
      desc: 'Capture and relive your motherhood journey.',
      img: 'https://i.pinimg.com/1200x/40/8f/7a/408f7ab46a5d8c992e9054212699689b.jpg',
      link: '/memory-vault',
    },
    {
      title: 'Maternal Yoga',
      desc: 'Curated yoga routines for each stage.',
      img: 'https://i.pinimg.com/736x/ca/48/1d/ca481d99f8431d1c6b4ada5f626a6433.jpg',
    },
    {
      title: 'Ayurveda',
      desc: 'Ayurvedic wisdom tailored for you.',
      img: 'https://i.pinimg.com/736x/08/ce/80/08ce80b82d735ed30bcd6122d0ffbca6.jpg',
    },
    {
      title: 'Journal',
      desc: 'Create daily emotional summaries of your journey.',
      img: 'https://i.pinimg.com/1200x/b3/e9/9e/b3e99e71f23f5b4819d451907e7f81ec.jpg',
      link: '/journal',
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-pink-600">Janani Aarogya</h1>
        <div className="flex gap-6 text-sm font-medium">
          <button onClick={() => navigate('/memory-vault')} className="hover:text-pink-600">Memory Vault</button>
          <button onClick={() => navigate(getYogaPath())} className="hover:text-pink-600">Maternal Yoga</button>
          <button onClick={() => navigate(getAyurvedaPath())} className="hover:text-pink-600">Ayurveda</button>
          <button onClick={() => navigate('/journal')} className="hover:text-pink-600">Journal</button>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:ring hover:ring-pink-300"
          >
            👤
          </button>
        </div>
      </nav>

      {/* Heading */}
      <div className="text-center mt-6 text-2xl font-semibold text-pink-700">
        Welcome to Janani Aarogya, your health companion
      </div>

      {/* Checklist Section */}
      <div className="mt-6 max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-pink-600 mb-3">🌸 Daily Wellness Checklist</h2>
        <ul className="space-y-2">
          {CHECK_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checks[idx] || false}
                onChange={() => {
                  const updated = [...checks];
                  updated[idx] = !updated[idx];
                  setChecks(updated);
                  localStorage.setItem(todayKey(), JSON.stringify(updated));
                }}
                className="w-5 h-5 text-pink-500 focus:ring-pink-400"
              />
              <span className={checks[idx] ? 'line-through text-gray-400' : 'text-gray-700'}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Input Section */}
      <div className="mt-6 flex justify-center">
        <InputSection onReply={setAiReply} />
      </div>

      {/* AI Response */}
      {aiReply && (
        <div className="mt-4 mx-auto w-11/12 md:w-2/3 bg-white p-4 rounded-lg shadow text-gray-800">
          <strong>Janani Says:</strong>
          <div>{aiReply}</div>
        </div>
      )}

      {/* Feature Thumbnails */}
      <div className="mt-10 space-y-6 px-4 max-w-3xl mx-auto">
        {features.map(({ title, desc, img }) => (
          <div key={title} className="flex bg-white shadow-md rounded-lg overflow-hidden">
            <img src={img} alt={title} className="w-28 h-28 object-cover" />
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-1 text-pink-600">{title}</h3>
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
  );
}

export default Dashboard;
