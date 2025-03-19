import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { IoGameControllerOutline } from "react-icons/io5";

function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const Loader = () => (
    <div className="min-h-screen px-4 sm:px-9  flex flex-col items-center justify-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rotate-12 transform-gpu animate-pulse" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-blue-500/10 to-transparent rotate-45 transform-gpu animate-pulse delay-150" />
      </div>
      <motion.div
        className="flex flex-col items-center justify-center h-screen  text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.2 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
        }}
      >
        <IoGameControllerOutline className="mr-2 text-cyan-300/80 block text-7xl" />
        Loading...
      </motion.div>
    </div>
  );
  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}
export default Layout;
