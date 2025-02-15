import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaGamepad, FaTrophy, FaClock } from "react-icons/fa";
import API from "../api";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please login to view your profile");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await API.get(`/api/users/${user._id}`);
        console.log("User data:", userResponse.data);
        setUserData(userResponse.data);
        setEmail(userResponse.data.email);
        setPhone(userResponse.data.phone);

        // Fetch all games to match game names
        const gamesResponse = await API.get("/api/games");
        setGames(gamesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserData();
    }
  }, [isAuthenticated, navigate, user?._id]);

  if (!isAuthenticated) return null;

  const handleUpdate = async () => {
    try {
      const updatedUser = { email, phone }; // ✅ Only updating email & phone
      const response = await API.put(`/api/users/${user._id}`, updatedUser);

      // Preserve existing user data while updating email & phone
      setUserData((prevUserData) => ({
        ...prevUserData,
        email: response.data.email,
        phone: response.data.phone,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <p>Failed to load user data</p>
      </div>
    );
  }

  // Function to get game name from ID
  const getGameName = (gameId) => {
    const game = games.find((g) => g._id === gameId);
    return game ? game.name : "Unknown Game";
  };

  const getHighestScore = () => {
    if (!userData.gameScores?.length) return 0;
    return Math.max(...userData.gameScores.map(score => score.highestScore));
  };

  const getTotalScore = () => {
    if (!userData.gameScores?.length) return 0;
    return userData.gameScores.reduce((total, score) => total + score.highestScore, 0);
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 py-8 sm:py-16 bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10 space-y-4 sm:space-y-8"
      >
        {/* Profile Header */}
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gray-800/50 mt-14 sm:mt-10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-cyan-500/20"
        >
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold
                hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {/* Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 
                flex items-center justify-center text-3xl sm:text-4xl font-bold text-white
                shadow-lg shadow-cyan-500/20"
            >
              {userData.username?.charAt(0).toUpperCase()}
            </motion.div>

            {/* User Info */}
            <div className="flex-1 space-y-3 sm:space-y-4 w-full sm:w-auto">
              <h1 className="text-2xl sm:text-4xl font-bold text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {userData.username}
              </h1>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-cyan-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-2 rounded-lg bg-gray-900/50 transition-all duration-200
                      ${isEditing ? 'border border-cyan-500/50 focus:border-cyan-500' : 'border border-transparent'}`}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-cyan-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-2 rounded-lg bg-gray-900/50 transition-all duration-200
                      ${isEditing ? 'border border-cyan-500/50 focus:border-cyan-500' : 'border border-transparent'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              className="mt-6 mx-auto block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
                rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 
                transition-all duration-300 shadow-lg shadow-green-500/20"
            >
              Save Changes
            </motion.button>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {/* Game Statistics */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-500/20"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <FaGamepad className="text-xl sm:text-2xl text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Game Statistics
              </h2>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {userData.gameScores && userData.gameScores.length > 0 ? (
                userData.gameScores.map((score, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex justify-between items-center p-3 sm:p-4 bg-gray-900/50 rounded-lg
                      hover:bg-gray-900/70 transition-colors duration-200"
                  >
                    <div className="text-gray-300 flex items-center gap-2">
                      <FaTrophy className="text-yellow-500 text-sm sm:text-base" />
                      <span className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                        {getGameName(score.gameId)}
                      </span>
                    </div>
                    <span className="text-cyan-400 font-bold text-sm sm:text-base">{score.highestScore}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No games played yet</p>
              )}
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaClock className="text-2xl text-cyan-400" />
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Account Details
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                <span className="text-gray-300">Games Played</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {userData.gameScores?.length || 0}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                <span className="text-gray-300">Highest Score</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {getHighestScore()}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                <span className="text-gray-300">Total Score</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {getTotalScore()}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg">
                <span className="text-gray-300">Username</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {userData.username}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
