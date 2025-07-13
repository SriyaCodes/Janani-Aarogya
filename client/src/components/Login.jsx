// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password } = form;

      // 1️⃣ Firebase Auth
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", user);

      // 2️⃣ Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
        })
      );

      // 3️⃣ Redirect to dashboard or appropriate page
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login failed:", error.code, error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
          Welcome Back
        </h2>

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
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={form.password}
          onChange={onChange}
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-pink-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;