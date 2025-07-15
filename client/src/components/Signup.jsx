import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signupimage.png";
import bgCurves from "../assets/bg.jpg"; 

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { email, password, name } = form;

      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        language: "",
        stage: "",
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("user", JSON.stringify({ uid: user.uid, email, name }));

      navigate("/language-selector");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${bgCurves})`,
      }}
    >
      {/* Main Signup Card */}
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">

        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome to Janani Aarogya 👩‍🍼</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.name}
              onChange={onChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.email}
              onChange={onChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.password}
              onChange={onChange}
              minLength={6}
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already a user?{" "}
            <a href="/login" className="text-purple-500 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={signupImage}
            alt="Signup"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
