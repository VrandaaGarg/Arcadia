import { Link } from "react-router-dom";

const LeaderboardButton = ({ gameLink }) => {
  return (
    <Link to={`/${gameLink}/leaderboard`}>
      <button className="group px-6 py-3 
        bg-gradient-to-r from-indigo-600 to-purple-600 
        text-white rounded-xl
        hover:from-indigo-700 hover:to-purple-700
        shadow-md hover:shadow-xl
        transition-all duration-300 ease-in-out
        flex items-center space-x-3
        transform hover:scale-102
        border border-transparent hover:border-indigo-300">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 group-hover:animate-pulse" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
        <span className="font-bold tracking-wide">View Leaderboard</span>
      </button>
    </Link>
  );
};

export default LeaderboardButton;
