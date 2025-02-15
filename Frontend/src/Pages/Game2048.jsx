import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import API from "../api";
import LeaderboardButton from "../Components/LeaderboardButton.jsx";

const SIZE = 4;

const initializeBoard = () => {
  let board = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board) => {
  let emptyTiles = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length) {
    let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
};

const moveBoard = (board, direction, setScore) => {
  let newBoard = board.map((row) => [...row]);
  let scoreIncrement = 0;

  const slide = (row) => {
    let filtered = row.filter((num) => num !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        scoreIncrement += filtered[i];
        filtered[i + 1] = 0;
      }
    }
    return [
      ...filtered.filter((num) => num !== 0),
      ...Array(SIZE - filtered.filter((num) => num !== 0).length).fill(0),
    ];
  };

  if (direction === "left") {
    newBoard = newBoard.map((row) => slide(row));
  } else if (direction === "right") {
    newBoard = newBoard.map((row) => slide(row.reverse()).reverse());
  } else if (direction === "up" || direction === "down") {
    for (let c = 0; c < SIZE; c++) {
      let col = newBoard.map((row) => row[c]);
      if (direction === "down") col.reverse();
      col = slide(col);
      if (direction === "down") col.reverse();
      for (let r = 0; r < SIZE; r++) {
        newBoard[r][c] = col[r];
      }
    }
  }

  addRandomTile(newBoard);
  setScore((prevScore) => prevScore + scoreIncrement);
  return newBoard;
};

const Game2048 = () => {
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

  const [board, setBoard] = useState(initializeBoard);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let direction = null;
      if (event.key === "ArrowUp" || event.key === "w") direction = "up";
      if (event.key === "ArrowDown" || event.key === "s") direction = "down";
      if (event.key === "ArrowLeft" || event.key === "a") direction = "left";
      if (event.key === "ArrowRight" || event.key === "d") direction = "right";

      if (direction) {
        event.preventDefault();
        setBoard((prevBoard) => moveBoard(prevBoard, direction, setScore));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDirectionClick = (direction) => {
    setBoard((prevBoard) => moveBoard(prevBoard, direction, setScore));
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setScoreToSubmit(score); // Store the score for submission
    setScore(0);
  };

  // Trigger `submitScore()` when `scoreToSubmit` is set
  useEffect(() => {
    if (scoreToSubmit !== null) {
      submitScore(scoreToSubmit);
      setScoreToSubmit(null);
    }
  }, [scoreToSubmit]);

  //submitting the score

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

  const getTileColor = (num) => {
    const colors = {
      2: 'bg-gradient-to-br from-blue-200 to-blue-300',
      4: 'bg-gradient-to-br from-green-200 to-green-300',
      8: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
      16: 'bg-gradient-to-br from-orange-200 to-orange-300',
      32: 'bg-gradient-to-br from-red-200 to-red-300',
      64: 'bg-gradient-to-br from-pink-200 to-pink-300',
      128: 'bg-gradient-to-br from-purple-200 to-purple-300',
      256: 'bg-gradient-to-br from-indigo-200 to-indigo-300',
      512: 'bg-gradient-to-br from-cyan-200 to-cyan-300',
      1024: 'bg-gradient-to-br from-emerald-200 to-emerald-300',
      2048: 'bg-gradient-to-br from-yellow-200 to-red-300',
    };
    return colors[num] || 'bg-gray-700/50';
  };

  return (
    <div className="min-h-screen px-4 py-16 flex flex-col items-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          2048 Game
        </h1>

        {/* Controls Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
            <p className="text-xl sm:text-2xl font-bold">Score: {score}</p>
          </div>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xl font-bold transition-all duration-300 
              hover:shadow-lg hover:shadow-cyan-500/20"
          >
            New Game
          </button>
          <LeaderboardButton gameLink="2048" />
        </div>

        {/* Game Board */}
        <div className="bg-[#082B4C]/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-xl border border-blue-500/20">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 aspect-square w-[280px] sm:w-[400px] md:w-[440px]">
            {board.flat().map((num, index) => (
              <div
                key={index}
                className={`w-full aspect-square rounded-lg flex items-center justify-center 
                  ${getTileColor(num)} shadow-inner transition-colors duration-200`}
              >
                <span className={`font-bold ${num >= 100 ? 'text-2xl' : 'text-3xl'} text-gray-800`}>
                  {num !== 0 ? num : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Arrow Controls */}
        <div className="md:hidden mt-8 flex flex-col items-center gap-2">
          <button
            onClick={() => handleDirectionClick("up")}
            className="w-16 h-16 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 
              flex items-center justify-center border border-gray-600
              active:transform active:scale-95 transition-all duration-150"
          >
            <FaArrowUp className="text-2xl text-cyan-400" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleDirectionClick("left")}
              className="w-16 h-16 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 
                flex items-center justify-center border border-gray-600
                active:transform active:scale-95 transition-all duration-150"
            >
              <FaArrowLeft className="text-2xl text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirectionClick("down")}
              className="w-16 h-16 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 
                flex items-center justify-center border border-gray-600
                active:transform active:scale-95 transition-all duration-150"
            >
              <FaArrowDown className="text-2xl text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirectionClick("right")}
              className="w-16 h-16 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 
                flex items-center justify-center border border-gray-600
                active:transform active:scale-95 transition-all duration-150"
            >
              <FaArrowRight className="text-2xl text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Desktop Instructions */}
        <div className="mt-8 hidden md:block text-center text-gray-400">
          <p className="mb-3 text-lg">Use arrow keys to move tiles</p>
          <div className="flex justify-center gap-3">
            <kbd className="px-3 py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">↑</kbd>
            <kbd className="px-3 py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">↓</kbd>
            <kbd className="px-3 py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">←</kbd>
            <kbd className="px-3 py-1.5 bg-gray-700/50 rounded-lg border border-gray-600">→</kbd>
          </div>
        </div>

        {/* Submit Score Button */}
        <button
          onClick={() => submitScore(score)}
          className="mt-8 px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 
            border border-purple-500/30 rounded-xl transition-all duration-300
            text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/20"
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export default Game2048;
