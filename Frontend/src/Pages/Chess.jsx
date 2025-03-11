import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Chess as ChessJS } from "chess.js";

const INITIAL_BOARD = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const PIECE_SYMBOLS = {
  k: "♔",
  q: "♕",
  r: "♖",
  b: "♗",
  n: "♘",
  p: "♙",
  K: "♚",
  Q: "♛",
  R: "♜",
  B: "♝",
  N: "♞",
  P: "♟",
};

function Chess() {
  const [gameMode, setGameMode] = useState(""); // 'pvp' or 'pvc'
  const [difficulty, setDifficulty] = useState("easy");
  const [gameState, setGameState] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [players, setPlayers] = useState({ white: "", black: "" });
  const [isSettingUp, setIsSettingUp] = useState(true);

  useEffect(() => {
    if (!isSettingUp) {
      initializeGame();
    }
  }, [isSettingUp]);

  const initializeGame = () => {
    const chess = new ChessJS();
    setGameState({
      board: INITIAL_BOARD,
      chess,
      turn: "w",
      gameOver: false,
      status: "",
    });
  };

  const handleSquareClick = (row, col) => {
    if (!gameState || gameState.gameOver) return;

    const square = `${String.fromCharCode(97 + col)}${8 - row}`;

    if (selectedSquare === null) {
      const piece = gameState.chess.get(square);
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(square);
        setPossibleMoves(gameState.chess.moves({ square, verbose: true }));
      }
    } else {
      const move = possibleMoves.find((m) => m.to === square);
      if (move) {
        makeMove(move);
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const makeMove = (move) => {
    const newGameState = { ...gameState };
    newGameState.chess.move(move);
    newGameState.turn = newGameState.chess.turn();

    if (newGameState.chess.isGameOver()) {
      newGameState.gameOver = true;
      if (newGameState.chess.isCheckmate()) {
        newGameState.status = `Checkmate! ${
          newGameState.turn === "w" ? "Black" : "White"
        } wins!`;
      } else if (newGameState.chess.isDraw()) {
        newGameState.status = "Game Over - Draw!";
      }
    } else if (newGameState.chess.isCheck()) {
      newGameState.status = "Check!";
    } else {
      newGameState.status = "";
    }

    setGameState(newGameState);

    // Computer's turn
    if (
      gameMode === "pvc" &&
      !newGameState.gameOver &&
      newGameState.turn === "b"
    ) {
      setTimeout(() => makeComputerMove(newGameState), 500);
    }
  };

  const makeComputerMove = (currentState) => {
    const moves = currentState.chess.moves({ verbose: true });
    let bestMove;

    switch (difficulty) {
      case "hard":
        bestMove = getBestMove(moves, currentState.chess, 3);
        break;
      case "medium":
        bestMove = getBestMove(moves, currentState.chess, 2);
        break;
      default:
        bestMove = moves[Math.floor(Math.random() * moves.length)];
    }

    if (bestMove) {
      makeMove(bestMove);
    }
  };

  const getBestMove = (moves, chess, depth) => {
    let bestScore = -Infinity;
    let bestMove = null;

    moves.forEach((move) => {
      chess.move(move);
      const score = minimax(chess, depth - 1, false, -Infinity, Infinity);
      chess.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  };

  const minimax = (chess, depth, isMaximizing, alpha, beta) => {
    if (depth === 0) return evaluatePosition(chess);

    const moves = chess.moves({ verbose: true });

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (let move of moves) {
        chess.move(move);
        const score = minimax(chess, depth - 1, false, alpha, beta);
        chess.undo();
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let move of moves) {
        chess.move(move);
        const score = minimax(chess, depth - 1, true, alpha, beta);
        chess.undo();
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  };

  const evaluatePosition = (chess) => {
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
      P: -1,
      N: -3,
      B: -3,
      R: -5,
      Q: -9,
      K: 0,
    };

    let score = 0;
    const board = chess.board();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          score += pieceValues[piece.type];
        }
      }
    }

    return score;
  };

  if (isSettingUp) {
    return (
      <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

        <div className="relative z-10 w-full max-w-xl mx-auto animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
            ♟️ Chess Master ♟️
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSettingUp(false);
            }}
            className="space-y-8 bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            {/* Game Mode Selection */}
            <div className="space-y-4">
              <label className="block text-cyan-400 mb-4 text-lg font-medium">
                Select Game Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["pvp", "pvc"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setGameMode(mode)}
                    className={`py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 
                    ${
                      gameMode === mode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {mode === "pvp" ? "👥 Player vs Player" : "🤖 vs Computer"}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            {gameMode === "pvc" && (
              <div className="space-y-4">
                <label className="block text-cyan-400 mb-2 text-lg font-medium">
                  Select Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 px-4 rounded-lg capitalize transition-all duration-300 transform hover:scale-105
                        ${
                          difficulty === level
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Player Names */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-cyan-400 mb-2">White Player</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={players.white}
                  onChange={(e) =>
                    setPlayers((prev) => ({ ...prev, white: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-white 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                    transition-all duration-300"
                  required
                />
              </div>
              {gameMode === "pvp" && (
                <div className="space-y-2">
                  <label className="block text-cyan-400 mb-2">
                    Black Player
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={players.black}
                    onChange={(e) =>
                      setPlayers((prev) => ({ ...prev, black: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-white 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                    transition-all duration-300"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                rounded-xl transition-all duration-300 transform hover:scale-105 font-medium text-lg
                hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Start Game 🎮
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Chess Master
        </h1>

        {/* Game Status */}
        <div className="mb-6 text-xl font-medium">
          <span
            className={`px-6 py-2 rounded-full ${
              gameState?.status.includes("Checkmate")
                ? "bg-green-500/20 text-green-400"
                : gameState?.status.includes("Check")
                ? "bg-red-500/20 text-red-400"
                : "bg-slate-700/50 text-cyan-400"
            }`}
          >
            {gameState?.status ||
              `${
                gameState?.turn === "w"
                  ? players.white
                  : gameMode === "pvc"
                  ? "Computer"
                  : players.black
              }'s Turn`}
          </span>
        </div>

        {/* Chess Board */}
        <div className="p-8 bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] rounded-2xl border-4 border-[#3D2B1F] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-8 gap-0.5 p-3 bg-[#3D2B1F] rounded-xl">
            {INITIAL_BOARD.map((row, rowIndex) =>
              row.map((_, colIndex) => {
                const piece = gameState?.chess.get(
                  `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
                );
                const isSelected =
                  selectedSquare ===
                  `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
                const isPossibleMove = possibleMoves.some(
                  (move) =>
                    move.to ===
                    `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`
                );

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={`w-8 h-8 text-center md:w-20 md:h-20 flex items-center justify-center
                      relative overflow-hidden
                      ${
                        (rowIndex + colIndex) % 2 === 0
                          ? "bg-[#EDEDD3] hover:bg-[#F7F7E6]"
                          : "bg-[#4B7399] hover:bg-[#5C84AA]"
                      }
                      ${isSelected ? "ring-2 ring-yellow-400/50" : ""}
                      transition-all duration-300`}
                  >
                    {piece && (
                      <span
                        className={`text-2xl text-center md:text-5xl select-none
                        text-black transition-transform duration-200
                        ${isSelected ? "scale-110" : ""}`}
                      >
                        {
                          PIECE_SYMBOLS[
                            piece.color === "w"
                              ? piece.type.toUpperCase()
                              : piece.type
                          ]
                        }
                      </span>
                    )}

                    {isPossibleMove && !piece && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Enhanced Board Labels */}
          <div className="flex justify-between px-6 mt-4 text-[#B8997A] font-medium">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((label) => (
              <span key={label} className="text-sm uppercase tracking-wider">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => {
              setIsSettingUp(true);
              setGameState(null);
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
            rounded-xl transition-all duration-300 transform hover:scale-105 
            hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
          >
            New Game
          </button>
          <NavLink
            to="/leaderboard"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
            rounded-xl transition-all duration-300 transform hover:scale-105 
            hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] font-medium flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Chess;
