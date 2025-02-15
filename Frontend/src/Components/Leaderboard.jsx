import { useEffect, useState } from "react";
import API from "../api"; // Adjust path as needed
import { FaUserCircle, FaCrown } from "react-icons/fa";

const Leaderboard = () => {
  const [gameId, setGameId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchGameId();
  }, []);

  const fetchGameId = async () => {
    try {
      const response = await API.get("/api/games"); // Fetch all games
      const currentPath = window.location.pathname.split("/")[1]; // Extract "2048" from "/2048/leaderboard"

      const game = response.data.find((g) => g.link === `/${currentPath}`); // Compare with "/2048"
      if (game) {
        setGameId(game._id); // Set gameId when found
      } else {
        console.error("Game not found for this URL.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    if (!gameId) return; // Ensure gameId is set before making the API call

    const fetchLeaderboard = async () => {
      try {
        const response = await API.get(`/api/games/${gameId}/leaderboard`);
        setLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [gameId]); // Runs when gameId updates

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <h2 className="text-3xl font-bold text-center mb-4">LEADERBOARD</h2>

      {/* Top 3 Players Section */}
      {leaderboard.length >= 3 && (
        <div className="flex justify-center gap-8 mb-6 my-12">
          <div className="text-center flex flex-col items-center justify-center">
            <FaUserCircle className="text-7xl text-cyan-500" />
            <p className="text-xl font-bold ">2nd</p>
            <p className="text-xl">{leaderboard[1]?.username}</p>
            <p className="text-xl">{leaderboard[1]?.score}</p>
          </div>

          <div className="text-center flex flex-col items-center justify-center mb-14">
            <div className="relative ">
              <FaUserCircle className="text-8xl text-cyan-400" />
              <FaCrown className="absolute text-7xl -top-14 left-1/2 transform -translate-x-1/2 text-yellow-500" />
            </div>
            <p className="text-xl font-bold ">1st</p>
            <p className="text-xl">{leaderboard[0]?.username}</p>
            <p className="text-xl">{leaderboard[0]?.score}</p>
          </div>

          <div className="text-center flex flex-col items-center justify-center">
            <FaUserCircle className="text-7xl text-cyan-600" />
            <p className="text-xl font-bold text-white">3rd</p>
            <p className="text-xl">{leaderboard[2]?.username}</p>
            <p className="text-xl">{leaderboard[2]?.score}</p>
          </div>
        </div>
      )}

      {/* Rest of the Leaderboard Table */}
      <div className="overflow-x-auto flex place-content-center">
        <table className="w-3xl border-collapse text-center bg-purple-800 rounded-xl">
          <thead>
            <tr className="bg-purple-700 text-white">
              <th className="p-2">Rank</th>
              <th className="p-2">Name</th>
              <th className="p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(3).map((player, index) => (
              <tr key={player.userId} className="border-b  border-purple-600">
                <td className="p-2">{index + 4}</td>
                <td className="p-2 flex items-center justify-center gap-2">
                  <FaUserCircle className="text-lg text-white" />
                  {player.username}
                </td>
                <td className="p-2">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
