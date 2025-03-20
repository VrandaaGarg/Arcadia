import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import API from "../api";
import LeaderboardButton from "../Components/LeaderboardButton";
import { motion } from "framer-motion";

const cardsArray = [
  { id: 1, emoji: "🍎" },
  { id: 2, emoji: "🍌" },
  { id: 3, emoji: "🍒" },
  { id: 4, emoji: "🍇" },
  { id: 5, emoji: "🍉" },
  { id: 6, emoji: "🍍" },
  { id: 7, emoji: "🍑" },
  { id: 8, emoji: "🍓" },
];

function MemoryCardGame() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.error("User not found in localStorage");
    }
  }, []);

  useEffect(() => {
    fetchGameId();
  }, []);

  useEffect(() => {
    if (gameId) {
      console.log("Game ID is now set:");
    }
  }, [gameId]);

  // Initialize game when component mounts
  useEffect(() => {
    startGame();
  }, []);

  const fetchGameId = async () => {
    try {
      const response = await API.get("/api/games");

      const currentPath = window.location.pathname;

      const game = response.data.find((g) => g.link === currentPath);

      if (game) {
        setGameId(game._id);
      } else {
        console.error("Game not found for this URL:", currentPath);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const startGame = () => {
    const shuffledCards = [...cardsArray, ...cardsArray]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matched.includes(index)
    )
      return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = ([firstIndex, secondIndex]) => {
    if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
      setMatched((prev) => [...prev, firstIndex, secondIndex]);
      setFlippedCards([]);

      if (matched.length + 2 === cards.length) {
        submitScore(moves + 1);
      }
    } else {
      setTimeout(() => setFlippedCards([]), 800);
    }
  };

  const submitScore = async (score) => {
    if (!user || !user._id) {
      console.error("User not logged in!");
      return;
    }
    if (!gameId) {
      console.error("Game ID not found!");
      return;
    }

    try {
      const response = await API.post(`/api/games/${gameId}/scores`, {
        userId: user._id,
        score,
      });
      console.log("Score submitted:", response.data);
    } catch (error) {
      console.error(
        "Error submitting score:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl text-center md:text-5xl font-black mb-8 ">
          <motion.span
            className="bg-clip-text text-transparent"
            animate={{
              backgroundImage: [
                "linear-gradient(to right, #06b6d4, #3b82f6, #9333ea)", // cyan -> blue -> purple
                "linear-gradient(to right, #9333ea, #3b82f6, #06b6d4)", // purple -> blue -> cyan
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2, // Adjust speed of transition
              ease: "easeInOut",
            }}
          >
            Memory Card Game
          </motion.span>
        </h1>
        {/* Score & Leaderboard */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <p className="px-4 sm:px-6 py-1 sm:py-2 rounded-xl bg-slate-800/70 text-purple-400 font-bold text-sm sm:text-xl">
            Moves: {moves}
          </p>

          {/* Pass link without "/" */}
        </div>
        {/* Win Message - Only show when there are cards and all are matched */}
        {cards.length > 0 && matched.length === cards.length && (
          <div className="text-2xl font-bold text-cyan-400 mb-8 animate-bounce">
            🎉 Congratulations! You Won! 🎉
          </div>
        )}
        {/* Game Grid */}
        <div className="grid grid-cols-4  gap-2 md:gap-4 mb-8">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-16 h-16 md:w-20 md:h-20 sm:w-24 sm:h-24 rounded-xl text-3xl sm:text-4xl
                flex items-center justify-center transform transition-all duration-300
                ${
                  flippedCards.includes(index) || matched.includes(index)
                    ? "bg-gradient-to-br from-cyan-500 to-blue-500 rotate-0"
                    : "bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 rotate-180"
                }
                ${matched.includes(index) && "animate-pulse"}
                hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]`}
            >
              <span
                className={`transform transition-all duration-300
                ${
                  flippedCards.includes(index) || matched.includes(index)
                    ? "rotate-0"
                    : "rotate-180 opacity-0"
                }`}
              >
                {card.emoji}
              </span>
            </button>
          ))}
        </div>
        {/* Control Button */}
        <div className="flex flex-wrap justify-center gap-4 mt-3.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.7 }}
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            New Game
          </motion.button>
          <LeaderboardButton gameLink="memorycardgame" />{" "}
        </div>
      </div>
    </div>
  );
}

export default MemoryCardGame;
