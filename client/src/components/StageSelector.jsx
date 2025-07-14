import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

function StageSelector() {
  const navigate = useNavigate();

  const stages = [
    { key: 'prepregnancy', label: 'Pre-Pregnancy' },
    { key: 'pregnancy', label: 'Pregnancy' },
    { key: 'postpartum', label: 'Postpartum' },
  ];

  const handleSelect = async (stage) => {
    try {
      localStorage.setItem('stage', stage);

      const user = auth.currentUser;
      if (!user) {
        alert("User not found. Please log in again.");
        navigate('/login');
        return;
      }

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { stage });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Error saving stage:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        What stage are you in?
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => handleSelect(s.key)}
            className="py-4 px-6 rounded-xl bg-rose-600 text-white text-lg font-semibold shadow hover:bg-rose-700 transition"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StageSelector;
