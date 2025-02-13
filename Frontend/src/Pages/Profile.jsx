import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Show alert message
      alert("Please login to view your profile");
      // Redirect to login
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24 bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Profile Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
              {getInitials(user.username)}
            </div>
            
            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <div className="space-y-1 text-gray-300">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {user.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Statistics and Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Scores Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Game Statistics</h2>
            {user.gameScores && user.gameScores.length > 0 ? (
              <div className="space-y-4">
                {user.gameScores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">{score.game}</span>
                    <span className="text-cyan-400 font-semibold">{score.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No games played yet</p>
            )}
          </div>

          {/* Account Details Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Account Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-gray-300">Member Since</span>
                <span className="text-cyan-400 font-semibold">
                  {new Date(user._id.toString().substring(0, 8), 16).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-gray-300">Games Played</span>
                <span className="text-cyan-400 font-semibold">
                  {user.gameScores?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
