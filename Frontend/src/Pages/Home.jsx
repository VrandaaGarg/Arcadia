import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import API from "../api";

function Home() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  //fetch games from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await API.get("api/games"); // Adjust endpoint if needed
        setGames(response.data);
        console.log("Games fetched:", response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games based on search input
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-9 pt-24 flex flex-col items-center justify-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rotate-12 transform-gpu animate-pulse" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-blue-500/10 to-transparent rotate-45 transform-gpu animate-pulse delay-150" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-5xl md:text-8xl font-black mb-4 text-center animate-slideDown">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400 transition-all duration-700">
            Arcadia
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-16 text-center text-cyan-300/80 animate-slideUp">
          Level Up Your Gaming Experience 🎮
        </p>

        {/* Enhanced Search Bar */}
        <div className="relative w-full max-w-lg mx-auto mb-16 animate-slideRight">
          <input
            type="text"
            placeholder="Search your next adventure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl text-gray-100 bg-slate-800/50 border border-cyan-500/20 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 animate-pulse"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Enhanced Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fadeIn">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <NavLink
                key={index}
                to={game.link} // Adjust route if needed
                className="group perspective"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 transition-all duration-500 hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transform-gpu hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-10" />
                  <img
                    src={game.ImgUrl} // Adjust image source if needed
                    alt={game.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {game.name}
                    </p>
                    <div className="flex items-center mt-2 text-cyan-400 opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="text-sm font-medium">Play Now</span>
                      <svg
                        className="w-4 h-4 ml-2 animate-bounceX"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="col-span-full text-center animate-fadeIn">
              <p className="text-2xl font-semibold text-cyan-500/70">
                No games found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
