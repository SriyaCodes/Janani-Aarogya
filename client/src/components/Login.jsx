// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const userData = snap.data();
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.language) localStorage.setItem('lang', userData.language + '');
        navigate('/dashboard');
      } else {
        alert('User data not found');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-rose-600">Log In</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-rose-500 text-white p-2 rounded hover:bg-rose-600 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
