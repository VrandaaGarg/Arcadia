import React, { useState, useEffect } from "react";

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

const MemoryCardGame = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Memory Card Game</h1>
      <p className="text-lg mb-2">Moves: {moves}</p>
      {matched.length === cards.length && (
        <p className="text-2xl font-bold text-green-400 mb-4">🎉 You Won! 🎉</p>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <button
            key={index}
            className={`w-20 h-20 text-3xl flex items-center justify-center rounded-lg transition ${
              flippedCards.includes(index) || matched.includes(index)
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => handleCardClick(index)}
          >
            {flippedCards.includes(index) || matched.includes(index)
              ? card.emoji
              : "❓"}
          </button>
        ))}
      </div>

      <button
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg"
        onClick={startGame}
      >
        Restart Game
      </button>
    </div>
  );
};

export default MemoryCardGame;
