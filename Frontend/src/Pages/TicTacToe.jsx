import React, { useState } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const winner = calculateWinner(board);
  const isDraw = board.every((cell) => cell !== null) && !winner;

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const handlePlayAgain = () => {
    if (winner) {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
    }
    handleReset();
  };

  const handleResetScores = () => {
    setScore({ X: 0, O: 0 });
    handleReset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>

      {/* Score Board */}
      <div className="flex justify-between gap-8 mb-4 text-xl font-semibold">
        <p className="bg-gray-700 px-4 py-2 rounded-lg">X Wins: {score.X}</p>
        <p className="bg-gray-700 px-4 py-2 rounded-lg">O Wins: {score.O}</p>
      </div>

      {/* Hide Board if Game Ends */}
      {winner || isDraw ? (
        <h2 className="text-3xl font-semibold mt-4">
          {winner ? `🎉 Winner: ${winner} 🎉` : "🤝 It's a Draw! 🤝"}
        </h2>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => (
            <button
              key={index}
              className="w-24 h-24 flex items-center justify-center text-3xl font-bold bg-gray-700 border-2 border-gray-500 rounded-lg hover:bg-gray-600 transition-all"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>
      )}

      {/* Play Again & Reset Scores Buttons */}
      <div className="flex gap-4 mt-6">
        {(winner || isDraw) && (
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-all"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        )}
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-lg transition-all"
          onClick={handleResetScores}
        >
          Reset Scores
        </button>
      </div>

      {/* Next Player Info */}
      {!winner && !isDraw && (
        <h2 className="text-xl mt-4">Next Player: {isXNext ? "X" : "O"}</h2>
      )}
    </div>
  );
};

// Function to check for a winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return "X" or "O"
    }
  }
  return null; // No winner
};

export default TicTacToe;
