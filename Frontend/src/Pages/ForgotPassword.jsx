import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });
      setMessage(res.data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
      setMessageType("error");
    }
  };
  // Hide message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [message]);
  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-md mx-auto animate-fadeIn">
        <AnimatePresence>
          {message && (
            <motion.div
              className={`fixed text-xl border top-20 left-1/2 transform backdrop-blur-xs -translate-x-1/2 px-4 py-3 rounded-md text-white shadow-lg ${
                messageType === "success"
                  ? "bg-green-500/60 border-green-400"
                  : "bg-red-500/50 border-red-500"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center">
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
            Forget Password
          </motion.span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20"
        >
          <label className="block text-cyan-400 mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-gray-100 
                focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                transition-all duration-300"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex place-content-center">
            <button
              type="submit"
              className="w-max px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              rounded-lg transition-all duration-300 transform hover:scale-105 
              hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
