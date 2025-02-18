import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // Initialize token state

  // Extract token from URL using useEffect to avoid infinite loop
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []); // Empty dependency array ensures this runs only once

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch(
      "http://localhost:5002/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token, newPassword: newPassword }),
      }
    );

    if (response.ok) {
      alert("Password successfully reset!");
      // Redirect or perform another action after reset
    } else {
      alert("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
      <div className="relative z-10 w-full max-w-md mx-auto animate-fadeIn">
        <h1 className="text-xl md:text-3xl font-black mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400 transition-all duration-500">
            Reset Your Password
          </span>
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
            <NavLink to="/login">
              <button
                onClick={handlePasswordReset}
                className="w-max px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              rounded-lg transition-all duration-300 transform hover:scale-105 
              hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
              >
                Reset Password
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
