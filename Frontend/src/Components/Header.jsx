import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink 
          to="/" 
          className="text-2xl sm:text-3xl font-bold transform hover:scale-105 transition-all duration-300"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
            Arcadia
          </span>
        </NavLink>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NavLink
            to="/login"
            className="px-4 py-2 text-sm sm:text-base text-cyan-400 hover:text-cyan-300 transition-all duration-300"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Header;
