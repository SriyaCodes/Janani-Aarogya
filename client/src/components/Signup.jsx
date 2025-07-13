// src/components/Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { email, password, name } = form;

      // 1️⃣ Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Signup successful:", user);

      // 2️⃣ Firestore User Profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        language: "",
        stage: "",
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email,
          name,
        })
      );

      // 4️⃣ Redirect to stage selector
      navigate("/stage-selector");
    } catch (error) {
      console.error("❌ Signup failed:", error.code, error.message);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
          Create Account
        </h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          className="w-full p-2 mb-4 border rounded"
          value={form.password}
          onChange={onChange}
          minLength={6}
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already a user?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
