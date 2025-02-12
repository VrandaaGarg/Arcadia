import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaGamepad,
  FaTrophy,
} from "react-icons/fa";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if a user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setIsLoggedIn(!!user);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="fixed w-full z-50 bg-blue-600/25 backdrop-blur-xs text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Website Name (Clickable - Redirects to Home) */}
        <NavLink to="/" className="text-3xl font-bold">
          Arcadia
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className="hover:text-gray-300 transition">
            Home
          </NavLink>
          <NavLink
            to="/games"
            className="hover:text-gray-300 transition flex items-center gap-1"
          >
            <FaGamepad /> Games
          </NavLink>
          <NavLink
            to="/leaderboard"
            className="hover:text-gray-300 transition flex items-center gap-1"
          >
            <FaTrophy /> Leaderboard
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/profile">
                <FaUserCircle className="text-3xl hover:text-gray-300 transition" />
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hover:text-gray-300 transition flex items-center gap-1"
              >
                <FaSignInAlt /> Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 text-white py-4 text-center">
          <NavLink
            to="/"
            className="block py-2 text-lg hover:bg-blue-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/games"
            className="block py-2 text-lg hover:bg-blue-500 transition flex items-center justify-center gap-1"
            onClick={() => setIsOpen(false)}
          >
            <FaGamepad /> Games
          </NavLink>
          <NavLink
            to="/leaderboard"
            className="block py-2 text-lg hover:bg-blue-500 transition flex items-center justify-center gap-1"
            onClick={() => setIsOpen(false)}
          >
            <FaTrophy /> Leaderboard
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className="block py-2 text-lg hover:bg-blue-500 transition"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full py-2 bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block py-2 text-lg hover:bg-blue-500 transition flex items-center justify-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <FaSignInAlt /> Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block py-2 text-lg bg-green-500 hover:bg-green-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
