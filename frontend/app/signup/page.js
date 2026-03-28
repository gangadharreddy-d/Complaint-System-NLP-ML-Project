"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import Link from "next/link";
import { User, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post("/auth/signup", formData);
      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0d0e15] overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] z-10 px-4"
      >
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition"
          >
            <div className="w-12 h-12 bg-[#8b5cf6] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white hover:text-gray-200 transition-colors">
              EmotionAware
            </span>
          </Link>
        </div>

        <div className="bg-[#1a1c29] rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create an account
            </h2>
            <p className="text-sm text-gray-400">
              Start managing customer emotion with AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#131522] border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all placeholder:text-gray-500 text-sm"
                placeholder="Full Name"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#131522] border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all placeholder:text-gray-500 text-sm"
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-[#131522] border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all placeholder:text-gray-500 text-sm"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium py-3.5 rounded-xl transition-colors duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
