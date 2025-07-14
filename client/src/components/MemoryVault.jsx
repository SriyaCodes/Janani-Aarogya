// src/pages/MemoryVault.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '../firebase';

const MemoryVault = () => {
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Watch for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  // 📥 Fetch all journals
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
    };

    fetchJournals();
  }, [user]);

  if (loading) return <p className="p-6 text-gray-500">Loading your memories...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🪔 Memory Vault</h2>

      {journals.length === 0 ? (
        <p className="text-gray-500">No journals yet. Once you generate a journal, it will appear here.</p>
      ) : (
        <div className="space-y-6">
          {journals.map(j => (
            <div key={j.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold text-pink-600 mb-2">📅 {j.id}</h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{j.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryVault;
