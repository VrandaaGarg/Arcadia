import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const sudokuPuzzles = [
  [
    [5, 3, "", "", 7, "", "", "", ""],
    [6, "", "", 1, 9, 5, "", "", ""],
    ["", 9, 8, "", "", "", "", 6, ""],
    [8, "", "", "", 6, "", "", "", 3],
    [4, "", "", 8, "", 3, "", "", 1],
    [7, "", "", "", 2, "", "", "", 6],
    ["", 6, "", "", "", "", 2, 8, ""],
    ["", "", "", 4, 1, 9, "", "", 5],
    ["", "", "", "", 8, "", "", 7, 9],
  ],
  [
    ["", 2, "", 4, "", 5, "", 7, ""],
    [1, "", 5, "", "", "", 8, "", 6],
    ["", 3, "", "", "", "", "", 9, ""],
    [5, "", "", "", 7, "", "", "", 2],
    ["", "", "", 8, "", 6, "", "", ""],
    [8, "", "", "", 9, "", "", "", 4],
    ["", 1, "", "", "", "", "", 3, ""],
    [9, "", 8, "", "", "", 4, "", 7],
    ["", 6, "", 3, "", 7, "", 2, ""],
  ],
  [
    [7, "", "", "", "", "", "", "", 9],
    ["", "", "", 6, "", 8, "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", 3, "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    [2, "", "", "", "", "", "", "", 5],
  ],
];

function Sudoku() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(0);
  const [board, setBoard] = useState([...sudokuPuzzles[selectedPuzzle]]);

  const handleChange = (row, col, value) => {
    if (value >= 1 && value <= 9) {
      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) => (rIdx === row && cIdx === col ? Number(value) : c))
      );
      setBoard(newBoard);
    }
  };

  const checkWin = () => {
    for (let i = 0; i < 9; i++) {
      let rowSet = new Set();
      let colSet = new Set();
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "" || board[j][i] === "") return false;
        rowSet.add(board[i][j]);
        colSet.add(board[j][i]);
      }
      if (rowSet.size !== 9 || colSet.size !== 9) return false;
    }
    return true;
  };

  const handlePuzzleChange = (index) => {
    setSelectedPuzzle(index);
    setBoard([...sudokuPuzzles[index]]);
  };

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B8AC]">
          Sudoku
        </h1>

        {/* Puzzle Selection & Leaderboard */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select
            onChange={(e) => handlePuzzleChange(Number(e.target.value))}
            value={selectedPuzzle}
            className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl text-gray-200 focus:outline-none focus:border-cyan-500/50"
          >
            {sudokuPuzzles.map((_, index) => (
              <option key={index} value={index} className="bg-slate-800">
                Puzzle {index + 1}
              </option>
            ))}
          </select>

          <NavLink
            to="/leaderboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>

        {/* Sudoku Grid */}
        <div className="grid grid-cols-9 gap-0.5 p-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                disabled={sudokuPuzzles[selectedPuzzle][rowIndex][colIndex] !== ""}
                className={`w-8 h-8 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-medium
                  ${(rowIndex + 1) % 3 === 0 && 'border-b-2 border-cyan-500/30'}
                  ${(colIndex + 1) % 3 === 0 && 'border-r-2 border-cyan-500/30'}
                  ${cell ? 'text-cyan-400' : 'text-gray-400'}
                  ${sudokuPuzzles[selectedPuzzle][rowIndex][colIndex] !== "" ? 'bg-slate-700/50' : 'bg-slate-800/30'}
                  focus:outline-none focus:bg-slate-700/70 transition-colors duration-200
                  hover:bg-slate-700/50`}
              />
            ))
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => alert(checkWin() ? "🎉 Congratulations! You solved it!" : "Keep trying! You're doing great!")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Check Solution
          </button>
          <button
            onClick={() => setBoard([...sudokuPuzzles[selectedPuzzle]])}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Reset Board
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sudoku;
