import { useEffect, useState } from "react";
import API from "../api";
import { FaUserCircle, FaCrown, FaMedal, FaGamepad } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [gameId, setGameId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameId();
  }, []);

  const fetchGameId = async () => {
    try {
      const response = await API.get("/api/games");
      const currentPath = window.location.pathname.split("/")[1];

      const game = response.data.find((g) => g.link === `/${currentPath}`);
      if (game) {
        setGameId(game._id);
      } else {
        console.error("Game not found for this URL.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    if (!gameId) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/api/games/${gameId}/leaderboard`);
        setLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameId]);

  const renderTopThree = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-center md:gap-12 gap-6 mb-8 md:mb-16 w-full max-w-xl md:max-w-4xl px-4">
        {/* Second Place */}
        {leaderboard[1] && (
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="text-center relative md:mt-8 flex md:flex-col items-center bg-gray-800/50 rounded-xl p-4 md:p-6">
            <div className="relative mr-4 md:mr-0">
              <FaUserCircle className="text-5xl md:text-7xl text-silver-400" />
              <FaMedal className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-2xl md:text-3xl text-gray-300" />
            </div>
            <div className="text-left md:text-center md:mt-4">
              <p className="text-lg md:text-xl font-bold text-gray-300">2nd Place</p>
              <p className="text-base md:text-lg font-medium">{leaderboard[1]?.username}</p>
              <p className="text-lg md:text-xl font-bold text-purple-400">{leaderboard[1]?.score}</p>
            </div>
          </motion.div>
        )}

        {/* First Place */}
        {leaderboard[0] && (
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="text-center relative order-first md:order-none flex md:flex-col items-center bg-purple-900/50 rounded-xl p-4 md:p-6 border border-purple-500/30">
            <div className="relative mr-4 md:mr-0">
              <FaUserCircle className="text-6xl md:text-8xl text-yellow-400" />
              <FaCrown className="absolute -top-4 md:-top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-5xl text-yellow-500 animate-bounce" />
            </div>
            <div className="text-left md:text-center md:mt-4">
              <p className="text-xl md:text-2xl font-bold text-yellow-400">1st Place</p>
              <p className="text-lg md:text-xl font-medium">{leaderboard[0]?.username}</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-400">{leaderboard[0]?.score}</p>
            </div>
          </motion.div>
        )}

        {/* Third Place */}
        {leaderboard[2] && (
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="text-center relative md:mt-8 flex md:flex-col items-center bg-gray-800/50 rounded-xl p-4 md:p-6">
            <div className="relative mr-4 md:mr-0">
              <FaUserCircle className="text-5xl md:text-7xl text-bronze-400" />
              <FaMedal className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-2xl md:text-3xl text-yellow-700" />
            </div>
            <div className="text-left md:text-center md:mt-4">
              <p className="text-lg md:text-xl font-bold text-yellow-700">3rd Place</p>
              <p className="text-base md:text-lg font-medium">{leaderboard[2]?.username}</p>
              <p className="text-lg md:text-xl font-bold text-purple-400">{leaderboard[2]?.score}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!leaderboard.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6">
          <FaGamepad className="text-6xl md:text-7xl text-purple-400 animate-bounce" />
          <h2 className="text-2xl md:text-3xl font-bold">No Players Yet!</h2>
          <p className="text-gray-400 text-lg md:text-xl mb-4">Be the first to play and claim the top spot!</p>
          <Link 
            to={`/${window.location.pathname.split("/")[1]}`}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
            Play Game
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 md:px-4 py-8 md:py-16 flex flex-col items-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        LEADERBOARD
      </motion.h2>

      {leaderboard.length > 0 && renderTopThree()}

      {leaderboard.length > 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl px-2 md:px-4">
          <div className="bg-purple-900/30 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[300px]">
                <thead>
                  <tr className="bg-purple-800/50">
                    <th className="p-3 md:p-4 text-left text-sm md:text-base">Rank</th>
                    <th className="p-3 md:p-4 text-left text-sm md:text-base">Player</th>
                    <th className="p-3 md:p-4 text-right text-sm md:text-base">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(3).map((player, index) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={player.userId}
                      className="border-t border-purple-700/30 hover:bg-purple-700/20 transition-colors">
                      <td className="p-3 md:p-4 text-gray-300 text-sm md:text-base">{index + 4}</td>
                      <td className="p-3 md:p-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <FaUserCircle className="text-lg md:text-xl text-purple-400" />
                          <span className="font-medium text-sm md:text-base">{player.username}</span>
                        </div>
                      </td>
                      <td className="p-3 md:p-4 text-right font-bold text-purple-400 text-sm md:text-base">{player.score}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;
