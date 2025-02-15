import { Link } from "react-router-dom";

const LeaderboardButton = ({ gameLink }) => {
  return (
    <Link to={`/${gameLink}/leaderboard`}>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        View Leaderboard
      </button>
    </Link>
  );
};

export default LeaderboardButton;
