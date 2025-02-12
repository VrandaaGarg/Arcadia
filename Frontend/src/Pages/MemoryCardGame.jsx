import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

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
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    startGame();
  }, []);

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
    } else {
      setTimeout(() => setFlippedCards([]), 800);
    }
  };

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
          Memory Card Game
        </h1>

        {/* Score & Leaderboard */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
            Moves: {moves}
          </p>
          <NavLink
            to="/leaderboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>

        {/* Win Message */}
        {matched.length === cards.length && (
          <div className="text-2xl font-bold text-cyan-400 mb-8 animate-bounce">
            🎉 Congratulations! You Won! 🎉
          </div>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-3xl sm:text-4xl
                flex items-center justify-center transform transition-all duration-300
                ${flippedCards.includes(index) || matched.includes(index)
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-500 rotate-0'
                  : 'bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 rotate-180'
                }
                ${matched.includes(index) && 'animate-pulse'}
                hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]`}
            >
              <span className={`transform transition-all duration-300
                ${flippedCards.includes(index) || matched.includes(index)
                  ? 'rotate-0'
                  : 'rotate-180 opacity-0'
                }`}
              >
                {card.emoji}
              </span>
            </button>
          ))}
        </div>

        {/* Control Button */}
        <button
          onClick={startGame}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          New Game
        </button>
      </div>
    </div>
  );
}

export default MemoryCardGame;
