import React, { useState, useEffect } from "react";
import { FaBomb, FaFlag, FaRedo, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import LeaderboardButton from "../Components/LeaderboardButton";
import API from "../api";

const DIFFICULTY = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 8, cols: 8, mines: 25 },
  hard: { rows: 8, cols: 8, mines: 40 },
};

const createBoard = (rows, cols, mines) => {
  let board = Array(rows)
    .fill()
    .map(() => Array(cols).fill({ value: 0, revealed: false, flagged: false }));

  let minePositions = new Set();
  while (minePositions.size < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    minePositions.add(`${r},${c}`);
    board[r][c] = { value: "M", revealed: false, flagged: false };
  }

  const directions = [-1, 0, 1];
  minePositions.forEach((pos) => {
    let [r, c] = pos.split(",").map(Number);
    directions.forEach((dr) =>
      directions.forEach((dc) => {
        let nr = r + dr,
          nc = c + dc;
        if (board[nr] && board[nr][nc] && board[nr][nc].value !== "M") {
          board[nr][nc] = { ...board[nr][nc], value: board[nr][nc].value + 1 };
        }
      })
    );
  });
  return board;
};

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [scoreToSubmit, setScoreToSubmit] = useState(null);

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

  const fetchGameId = async () => {
    try {
      const response = await API.get("/api/games");

      const currentPath = window.location.pathname;

      const game = response.data.find((g) => g.link === currentPath);

      if (game) {
        setGameId(game._id);
      } else {
        console.error("Game not found for this URL:");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    restartGame();
  }, [difficulty]);

  const revealBoard = () => {
    setBoard((prevBoard) =>
      prevBoard.map((row) => row.map((cell) => ({ ...cell, revealed: true })))
    );
  };

  const handleClick = (r, c) => {
    if (gameOver || board[r][c].revealed) return;
    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].revealed = true;
    newBoard[r][c].clicked = true;

    if (newBoard[r][c].value === "M") {
      setGameOver(true);
      setScoreToSubmit(score);
      revealBoard();
    } else {
      setScore((prev) => prev + 10);
    }
    setBoard(newBoard);
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    let newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  };

  const restartGame = () => {
    let { rows, cols, mines } = DIFFICULTY[difficulty];
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (scoreToSubmit !== null) {
      submitScore(scoreToSubmit);
      setScoreToSubmit(null);
    }
  }, [scoreToSubmit]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-16 flex flex-col items-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white"
    >
      <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
        Minesweeper
      </h1>

      {/* Difficulty Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.keys(DIFFICULTY).map((level) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={level}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200
              ${difficulty === level
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20"
                : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
              }`}
            onClick={() => setDifficulty(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Game Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 px-4 py-2 rounded-lg">
          <p className="text-xl font-semibold">Score: {score}</p>
        </div>
      </div>

      {/* Game Board */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 shadow-xl"
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${DIFFICULTY[difficulty].cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <motion.div
                key={`${rIdx}-${cIdx}`}
                whileHover={{ scale: 0.95 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer text-xl
                  rounded-md transition-all duration-200
                  ${cell.revealed || gameOver
                    ? "bg-gray-700/50 shadow-inner"
                    : "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-md"
                  } 
                  ${cell.clicked ? "bg-gray-600/50" : ""}`}
                onClick={() => handleClick(rIdx, cIdx)}
                onContextMenu={(e) => handleRightClick(e, rIdx, cIdx)}
              >
                {cell.revealed || gameOver ? (
                  cell.value === "M" ? (
                    <FaBomb className="text-red-500" />
                  ) : (
                    <span className={`font-bold ${
                      cell.value === 1 ? "text-blue-400" :
                      cell.value === 2 ? "text-green-400" :
                      cell.value === 3 ? "text-yellow-400" :
                      cell.value === 4 ? "text-red-400" :
                      "text-purple-400"
                    }`}>
                      {cell.value || ""}
                    </span>
                  )
                ) : cell.flagged ? (
                  <FaFlag className="text-cyan-400" />
                ) : (
                  ""
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
            px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-cyan-500/20
            flex items-center gap-2"
          onClick={restartGame}
        >
          <FaRedo />
          Restart
        </motion.button>
        <LeaderboardButton gameLink="minesweeper" />
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/90 p-8 rounded-xl flex flex-col items-center gap-6 border border-gray-700 max-w-md mx-4"
          >
            <h2 className="text-4xl font-bold text-red-500">Game Over!</h2>
            <p className="text-2xl">Final Score: {score}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-lg font-semibold"
                onClick={restartGame}
              >
                Play Again
              </motion.button>
              <LeaderboardButton gameLink="minesweeper" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Minesweeper;
