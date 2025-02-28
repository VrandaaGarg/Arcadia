import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (username) => {
    if (!username) return ''; // Add fallback for undefined username
    
    return username
      .split(' ')
      .map(word => word?.[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                {/* User Avatar with Initials - Add fallback */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm transition-transform group-hover:scale-105">
                  {getInitials(user?.username) || '?'}
                </div>
                <span className="text-cyan-400 hidden sm:block">
                  {user?.username || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-cyan-500/20">
                  <div className="px-4 py-2 border-b border-cyan-500/20">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-cyan-400">{user?.username || 'User'}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
