import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signupimage.png";
import bgCurves from "../assets/bg.jpg"; // 🎨 your background

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

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", user);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
      };

      if (userSnap.exists()) {
        const data = userSnap.data();
        userData.language = data.language || null;
        userData.stage = data.stage || null;
      }

      localStorage.setItem("user", JSON.stringify(userData));

      if (!userData.language) {
        navigate("/language-selector");
      } else if (!userData.stage) {
        navigate("/stage-selector");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Login failed:", error.code, error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${bgCurves})`,
      }}
    >
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">

        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Log In</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome back! Please enter your details.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.email}
              onChange={onChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.password}
              onChange={onChange}
              minLength={6}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-purple-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={signupImage}
            alt="Visual"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
