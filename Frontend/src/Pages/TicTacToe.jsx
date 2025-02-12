import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function TicTacToe() {
  // Add new state variables for game mode and difficulty
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvc'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [players, setPlayers] = useState({ X: "Player 1", O: "Player 2" });
  const [isSettingNames, setIsSettingNames] = useState(true);
  const [tempNames, setTempNames] = useState({ X: "", O: "" });
  const winner = calculateWinner(board);
  const isDraw = board.every((cell) => cell !== null) && !winner;

  // Add computer move effect
  useEffect(() => {
    if (gameMode === 'pvc' && !isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => makeComputerMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode]);

  // Computer AI functions
  const makeComputerMove = () => {
    let move;
    switch (difficulty) {
      case 'hard':
        move = getBestMove(board);
        break;
      case 'medium':
        move = Math.random() < 0.7 ? getBestMove(board) : getRandomMove();
        break;
      default:
        move = getRandomMove();
    }
    handleClick(move);
  };

  const getRandomMove = () => {
    const emptySquares = board.map((sq, i) => sq === null ? i : null).filter(sq => sq !== null);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const getBestMove = (currentBoard) => {
    // Minimax algorithm for unbeatable AI
    const emptyCells = currentBoard.map((cell, index) => cell === null ? index : null).filter(cell => cell !== null);
    
    if (calculateWinner(currentBoard)) return null;
    
    let bestScore = -Infinity;
    let bestMove = null;

    emptyCells.forEach(cell => {
      const boardCopy = [...currentBoard];
      boardCopy[cell] = 'O';
      const score = minimax(boardCopy, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });

    return bestMove;
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = calculateWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!board.includes(null)) return 0;

    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(cell => cell !== null);

    if (isMaximizing) {
      let bestScore = -Infinity;
      emptyCells.forEach(cell => {
        const boardCopy = [...board];
        boardCopy[cell] = 'O';
        bestScore = Math.max(bestScore, minimax(boardCopy, depth + 1, false));
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      emptyCells.forEach(cell => {
        const boardCopy = [...board];
        boardCopy[cell] = 'X';
        bestScore = Math.min(bestScore, minimax(boardCopy, depth + 1, true));
      });
      return bestScore;
    }
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    setPlayers({
      X: tempNames.X || "Player 1",
      O: tempNames.O || "Player 2"
    });
    setIsSettingNames(false);
  };

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

  const handleResetGame = () => {
    setIsSettingNames(true);
    setTempNames({ X: "", O: "" });
    setScore({ X: 0, O: 0 });
    handleReset();
  };

  if (isSettingNames) {
    return (
      <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />
        
        <div className="relative z-10 w-full max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
            Tic Tac Toe
          </h1>

          <form onSubmit={handleStartGame} className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20">
            {/* Game Mode Selection */}
            <div className="space-y-4">
              <label className="block text-cyan-400 mb-2">Game Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGameMode('pvp')}
                  className={`py-2 rounded-lg transition-all duration-300 ${
                    gameMode === 'pvp' 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  Player👱‍♂️ vs Player👨
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('pvc')}
                  className={`py-2 rounded-lg transition-all duration-300 ${
                    gameMode === 'pvc' 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  vs AI 🤖
                </button>
              </div>
            </div>

            {/* Difficulty Selection (Only for PvC) */}
            {gameMode === 'pvc' && (
              <div className="space-y-2">
                <label className="block text-cyan-400 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-cyan-500/20"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard (YOU CANT'T WIN!!!)</option>
                </select>
              </div>
            )}

            {/* Player Names */}
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-2">Player X Name:</label>
                <input
                  type="text"
                  placeholder="Enter Player X name"
                  value={tempNames.X}
                  onChange={(e) => setTempNames(prev => ({ ...prev, X: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              {gameMode === 'pvp' && (
                <div>
                  <label className="block text-cyan-400 mb-2">Player O Name:</label>
                  <input
                    type="text"
                    placeholder="Enter Player O name"
                    value={tempNames.O}
                    onChange={(e) => setTempNames(prev => ({ ...prev, O: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
          Tic Tac Toe
        </h1>

        {/* Score & Players */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
              <p className="text-cyan-400">{players.X}</p>
              <p className="text-xl font-bold">X: {score.X}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
              <p className="text-cyan-400">{players.O}</p>
              <p className="text-xl font-bold">O: {score.O}</p>
            </div>
          </div>
          <NavLink
            to="/leaderboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>

        {/* Game Status */}
        {(winner || isDraw) && (
          <h2 className="text-3xl font-bold mb-8 text-cyan-400 animate-fadeIn">
            {winner ? `🎉 ${players[winner]} Wins! 🎉` : "🤝 It's a Draw! 🤝"}
          </h2>
        )}

        {/* Current Player */}
        {!winner && !isDraw && (
          <p className="text-xl mb-8 text-cyan-400">
            Current Turn: <span className="font-bold">{players[isXNext ? 'X' : 'O']}</span>
          </p>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={cell || winner || isDraw}
              className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-bold
                bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl
                transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]
                disabled:cursor-not-allowed
                ${cell === 'X' ? 'text-rose-400' : cell === 'O' ? 'text-cyan-400' : 'text-gray-400'}`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {(winner || isDraw) && (
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Next Round
            </button>
          )}
          <button
            onClick={handleResetGame}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

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
