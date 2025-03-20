import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        toast.success("Password successfully reset!");
        setTimeout(() => {
          window.location.href = "/login"; // ✅ Redirect using window.location.href
        }, 1000);
      } else {
        toast.error("Password reset failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
      <div className="relative z-10 w-full max-w-md mx-auto animate-fadeIn">
        <h1 className="text-xl md:text-3xl font-black mb-8 text-center">
          <motion.span
            className="bg-clip-text text-transparent"
            animate={{
              backgroundImage: [
                "linear-gradient(to right, #06b6d4, #3b82f6, #9333ea)", // cyan -> blue -> purple
                "linear-gradient(to right, #9333ea, #3b82f6, #06b6d4)", // purple -> blue -> cyan
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2, // Adjust speed of transition
              ease: "easeInOut",
            }}
          >
            Reset Password
          </motion.span>
        </h1>

        <div className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-gray-100 
            focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
            transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-gray-100 
            focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
            transition-all duration-300"
          />
          <div className="flex place-content-center">
            <button
              onClick={handleSubmit}
              className="w-max px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              rounded-lg transition-all duration-300 transform hover:scale-105 
              hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
