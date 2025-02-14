import React, { useState, useEffect } from "react";
import { FaBomb, FaFlag, FaRedo } from "react-icons/fa";

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

  return (
    <div className="min-h-screen relative px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white ">
      <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
        Minesweeper
      </h1>
      <div className="flex mb-4">
        {Object.keys(DIFFICULTY).map((level) => (
          <button
            key={level}
            className={`px-4 py-2 m-1 rounded-lg text-white font-semibold  duration-200 hover:from-cyan-600 hover:to-blue-600 ${
              difficulty === level
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 scale-105 "
                : "bg-gradient-to-r from-cyan-400 to-blue-500 scale-90"
            }`}
            onClick={() => setDifficulty(level)}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-1 bg-gray-400">
        <div
          className="grid gap-1 bg-gray-700 p-2 "
          style={{
            gridTemplateColumns: `repeat(${DIFFICULTY[difficulty].cols}, 1fr)`,
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center cursor-pointer text-2xl text-cyan-500 font-bold ${
                  cell.revealed || gameOver
                    ? "bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-300 border-4 border-l-white border-t-white border-b-gray-900 border-r-gray-900"
                } ${cell.clicked ? "bg-gray-400" : ""}`}
                onClick={() => handleClick(rIdx, cIdx)}
                onContextMenu={(e) => handleRightClick(e, rIdx, cIdx)}
              >
                {cell.revealed || gameOver ? (
                  cell.value === "M" ? (
                    <FaBomb className="text-red-600" />
                  ) : (
                    cell.value || ""
                  )
                ) : cell.flagged ? (
                  <FaFlag className="text-blue-600" />
                ) : (
                  ""
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-row items-center mt-8 gap-10">
        <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl text-xl md:text-3xl ">
          Score: {score}
        </p>
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl text-xl md:text-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          onClick={restartGame}
        >
          Restart
        </button>
      </div>

      {gameOver && (
        <div className="absolute h-screen w-full bg-gray-800/30 backdrop-blur-xs gap-14 md:gap-16 flex items-center flex-col py-56 md:py-40 ">
          <p className="text-red-700 block font-bold text-6xl md:text-8xl text-center">
            Game Over!
          </p>
          <div className="flex gap-8">
            <button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl text-xl md:text-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              onClick={restartGame}
            >
              Play Again
            </button>
            <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl text-xl md:text-3xl ">
              Score: {score}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
