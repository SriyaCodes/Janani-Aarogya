import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  orderBy,
  query,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import Navbar from './Navbar';


const memoryVaultTranslations = {
  'hi-IN': 'मेमोरी वॉल्ट',
  'en-IN': 'Memory Vault',
  'ta-IN': 'நினைவுக் களஞ்சியம்',
  'te-IN': 'మెమరీ వాల్ట్',
  'kn-IN': 'ಮೆಮೊರಿ ವಾಲ್ಟ್',
  'mr-IN': 'मेमरी व्हॉल्ट',
  'bn-IN': 'মেমোরি ভল্ট',
  'gu-IN': 'મેમરી વોલ્ટ',
  'ml-IN': 'മെമ്മറി വോൾട്ട്',
  'pa-IN': 'ਮੈਮੋਰੀ ਵੌਲਟ'
};

const MemoryVault = () => {
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en-IN');
  const [streak, setStreak] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      if (u) {
        setUser(u);
        setLanguage(localStorage.getItem('lang') || 'en-IN');
      } else {
        navigate('/login');
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchJournals = async () => {
      const q = query(
        collection(db, 'users', user.uid, 'journals'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJournals(data);
      setLoading(false);

      // Calculate streak
      const sorted = [...data].sort((a, b) => {
  const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
  const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
  return dateB - dateA;
});

let streak = 0;
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // 🔥 Normalize to 00:00:00

for (let j of sorted) {
  const entryDate = new Date(j.createdAt?.toDate?.() || j.createdAt);
  entryDate.setHours(0, 0, 0, 0); // 🔥 Also normalize this

  // ✅ Strict date match
  if (entryDate.getTime() === currentDate.getTime()) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1); // Move 1 day back
  } else {
    break;
  }
}

setStreak(streak);

    };

    fetchJournals();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-24 bg-gradient-to-br from-pink-500 to-rose-700 rounded-lg shadow-lg animate-pulse mb-4 mx-auto"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-pink-300 rounded animate-pulse"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-pink-300 rounded animate-pulse"></div>
          </div>
          <p className="text-xl text-rose-800 font-serif animate-pulse">Opening your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 relative overflow-hidden">
      {/* ✅ Navbar with translated title + streak */}
     <Navbar
  title={memoryVaultTranslations[language] || 'Memory Vault'}
  streak={streak}
  lang={language}
/>


      {/* Diary texture background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M0 10h40M0 20h40M0 30h40' stroke='%23ec4899' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main diary content */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700 rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 opacity-20 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='0.5'%3E%3Cpath d='M0 0l60 60M60 0L0 60'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-16 bg-gradient-to-b from-pink-300 to-pink-500 rounded-full shadow-lg"></div>
          <h1 className="text-4xl font-serif font-bold text-pink-100 text-center tracking-wide">
            💖 {memoryVaultTranslations[language] || 'Memory Vault'}
          </h1>
        </div>

        {journals.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="relative mx-auto w-48 h-64 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl shadow-xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform -rotate-1 border-l-4 border-pink-400">
                <div className="p-6 h-full flex flex-col justify-center items-center">
                  <div className="text-6xl mb-4 animate-bounce">🌸</div>
                  <div className="w-24 h-1 bg-pink-200 mb-2"></div>
                  <div className="w-20 h-1 bg-pink-200 mb-2"></div>
                  <div className="w-16 h-1 bg-pink-200"></div>
                </div>
              </div>
            </div>
            <p className="text-xl text-rose-700 font-serif mb-4">Your memory vault is waiting...</p>
            <p className="text-rose-600 font-serif italic">Your precious moments will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {journals.map((j, index) => (
              <div key={j.id} className="group relative animate-slideInUp" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-pink-400 overflow-hidden">
                  <div className="absolute left-8 top-0 bottom-0 flex flex-col justify-center space-y-8">
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="h-full bg-repeat-y" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='30' viewBox='0 0 100 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='29' x2='100' y2='29' stroke='%23ec4899' stroke-width='1'/%3E%3C/svg%3E")`,
                      backgroundSize: '100% 30px'
                    }}></div>
                  </div>
                  <div className="relative p-8 pl-16">
                    <div className="mb-6">
                      <h3 className="font-serif text-xl text-rose-700 mb-2 flex items-center gap-3">
                        <span className="text-2xl">📅</span>
                        <span className="border-b-2 border-pink-300 pb-1">{j.id}</span>
                      </h3>
                      <div className="w-full h-px bg-gradient-to-r from-pink-300 to-transparent"></div>
                    </div>
                    <p className="font-serif text-lg text-gray-800 leading-relaxed whitespace-pre-wrap mb-6 text-justify">
                      {j.text}
                    </p>
                    <div className="flex justify-end items-center mt-8">
                      <div className="text-right">
                        <div className="w-32 h-px bg-pink-300 mb-2"></div>
                        <p className="text-sm text-pink-600 font-serif italic">~ My thoughts</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 transform rotate-45 origin-bottom-left shadow-sm"></div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/5 to-transparent"></div>
                  </div>
                </div>
                <div className="absolute inset-x-2 -bottom-1 h-full bg-pink-50 rounded-2xl shadow-md -z-10 transform rotate-0.5"></div>
                <div className="absolute inset-x-4 -bottom-2 h-full bg-rose-50 rounded-2xl shadow-sm -z-20 transform -rotate-0.5"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out both;
        }
        .rotate-0.5 {
          transform: rotate(0.5deg);
        }
        .-rotate-0.5 {
          transform: rotate(-0.5deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryVault;
