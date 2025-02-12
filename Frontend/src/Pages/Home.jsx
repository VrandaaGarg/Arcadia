import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const games = [
  { name: "Tic Tac Toe", path: "/tictactoe", image: "/OIP.jpeg" },
  {
    name: "Rock Paper Scissors",
    path: "/rockpaperscissors",
    image: "/RockPaperScissors.jpeg",
  },
  {
    name: "Memory Card Game",
    path: "/memorycardgame",
    image: "/MemoryCardGame.jpg",
  },
  {
    name: "Sudoku",
    path: "/sudoku",
    image: "/sudoku.png",
  },
];

function Home() {
  const [search, setSearch] = useState("");

  // Filter games based on search input
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-32 px-9 pt-24 flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Arcadia</h1>
      <p className="text-xl mb-6 italic opacity-90">
        Play, Compete, and Have Fun! 🎮
      </p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a game..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 px-4 py-2 rounded-full text-black focus:outline-none shadow-lg mb-6"
      />

      {/* Display Filtered Games */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <NavLink key={index} to={game.path} className="group">
              <img
                src={game.image}
                alt={game.name}
                className="w-96 h-64 object-cover rounded-xl shadow-lg transition-transform transform group-hover:scale-110"
              />
              <p className="text-center mt-2 text-2xl font-mono font-semibold">
                {game.name}
              </p>
            </NavLink>
          ))
        ) : (
          <p className="text-2xl font-semibold text-gray-200">No games found</p>
        )}
      </div>
    </div>
  );
}

export default Home;
