import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sudokuPuzzles = [
  [
    ["", "", "", 2, 6, "", 7, "", 1],
    [6, 8, "", "", 7, "", "", 9, ""],
    [1, 9, "", "", "", 4, 5, "", ""],
    [8, 2, "", 1, "", "", "", 4, ""],
    ["", "", 4, 6, "", 2, 9, "", ""],
    ["", 5, "", "", "", 3, "", 2, 8],
    ["", "", 9, 3, "", "", "", 7, 4],
    ["", 4, "", "", 5, "", "", 3, 6],
    [7, "", 3, "", 1, 8, "", "", ""],
  ],
  [
    [1, "", "", 4, 8, 9, "", "", 6],
    [7, 3, "", "", "", "", "", 4, ""],
    ["", "", "", "", "", 1, 2, 9, 5],
    ["", "", 7, 1, 2, "", 6, "", ""],
    [5, "", "", 7, "", 3, "", "", 8],
    ["", "", 6, "", 9, 5, 7, "", ""],
    [9, 1, 4, 6, "", "", "", "", ""],
    ["", 2, "", "", "", "", "", 3, 7],
    [8, "", "", 5, 1, 2, "", "", 4],
  ],
  [
    ["", "", "", 6, "", "", 4, "", ""],
    [7, "", "", "", "", 3, 6, "", ""],
    ["", "", "", "", 9, 1, "", 8, ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", 5, "", 1, 8, "", "", "", 3],
    ["", "", "", 3, "", 6, "", 4, 5],
    ["", 4, "", 2, "", "", "", 6, ""],
    [9, "", 3, "", "", "", "", "", ""],
    ["", 2, "", "", "", "", 1, "", ""],
  ],
];

const solutionBoard = [
  [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
  ],

  [
    [1, 5, 2, 4, 8, 9, 3, 7, 6],
    [7, 3, 9, 2, 5, 6, 8, 4, 1],
    [4, 6, 8, 3, 7, 1, 2, 9, 5],
    [3, 8, 7, 1, 2, 4, 6, 5, 9],
    [5, 9, 1, 7, 6, 3, 4, 2, 8],
    [2, 4, 6, 8, 9, 5, 7, 1, 3],
    [9, 1, 4, 6, 3, 7, 5, 8, 2],
    [6, 2, 5, 9, 4, 8, 1, 3, 7],
    [8, 7, 3, 5, 1, 2, 9, 6, 4],
  ],
  [
    [5, 8, 1, 6, 7, 2, 4, 3, 9],
    [7, 9, 2, 8, 4, 3, 6, 5, 1],
    [3, 6, 4, 5, 9, 1, 7, 8, 2],
    [4, 3, 8, 9, 5, 7, 2, 1, 6],
    [2, 5, 6, 1, 8, 4, 9, 7, 3],
    [1, 7, 9, 3, 2, 6, 8, 4, 5],
    [8, 4, 5, 2, 1, 9, 3, 6, 7],
    [9, 1, 3, 7, 6, 8, 5, 2, 4],
    [6, 2, 7, 4, 3, 5, 1, 9, 8],
  ],
];

function Sudoku() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(0);
  const [board, setBoard] = useState([...sudokuPuzzles[selectedPuzzle]]);
  const [solved, setSolved] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) =>
          rIdx === row && cIdx === col ? (value === "" ? "" : Number(value)) : c
        )
      );
      setBoard(newBoard);
    }
  };

  const isFilled = (board) => {
    return board.every((row) => row.every((cell) => cell !== ""));
  };

  const checkWin = () => {
    // Check rows and columns
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

    // Check 3x3 subgrids
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        let gridSet = new Set();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            let num = board[boxRow * 3 + row][boxCol * 3 + col];
            if (gridSet.has(num)) return false;
            gridSet.add(num);
          }
        }
      }
    }

    setSolved(true);
    return true;
  };

  const handlePuzzleChange = (index) => {
    setSelectedPuzzle(index);
    setBoard([...sudokuPuzzles[index]]);
  };

  const checkSolution = () => {
    setBoard([...solutionBoard[selectedPuzzle]]);
    setSolved(true);
    setPopup({
      show: true,
      type: "solution",
      message: "Here's the correct solution!",
    });
    // Auto-hide after 5 seconds
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 5000);
  };

  // Close popup function
  const closePopup = () => {
    setPopup({ show: false, type: "", message: "" });
  };

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      {/* Popup System */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50  max-w-md w-full p-4"
          >
            <div
              className={`rounded-xl shadow-2xl p-6 backdrop-blur-md flex items-center gap-4 border
                ${
                  popup.type === "success"
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : popup.type === "error"
                    ? "bg-red-500/20 border-red-500/50"
                    : "bg-blue-500/20 border-blue-500/50"
                }`}
            >
              <div
                className={`p-3 rounded-full 
                ${
                  popup.type === "success"
                    ? "bg-emerald-500"
                    : popup.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {popup.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : popup.type === "error" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-bold text-lg 
                  ${
                    popup.type === "success"
                      ? "text-emerald-400"
                      : popup.type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {popup.type === "success"
                    ? "Success!"
                    : popup.type === "error"
                    ? "Incorrect Solution"
                    : "Solution"}
                </h4>
                <p className="text-gray-200">{popup.message}</p>
              </div>
              <button
                onClick={closePopup}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 ">
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
            Sudoku
          </motion.span>
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
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
                disabled={
                  sudokuPuzzles[selectedPuzzle][rowIndex][colIndex] !== ""
                }
                className={`w-6 h-6 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-medium
                  ${(rowIndex + 1) % 3 === 0 && "border-b-2 border-cyan-500/30"}
                  ${(colIndex + 1) % 3 === 0 && "border-r-2 border-cyan-500/30"}
                  ${cell ? "text-cyan-400" : "text-gray-400"}
                  ${
                    sudokuPuzzles[selectedPuzzle][rowIndex][colIndex] !== ""
                      ? "bg-slate-700/50"
                      : "bg-slate-800/30"
                  }
                  focus:outline-none focus:bg-slate-700/70 transition-colors duration-200
                  hover:bg-slate-700/50`}
              />
            ))
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
           rounded-xl transition-all duration-300 transform hover:scale-105 
           hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
            onClick={() => {
              const boardFilled = isFilled(board);

              if (checkWin()) {
                setPopup({
                  show: true,
                  type: "success",
                  message: "Congratulations! You solved the puzzle correctly.",
                });
                // Auto-hide after 5 seconds
                setTimeout(
                  () => setPopup({ show: false, type: "", message: "" }),
                  5000
                );
              } else {
                if (!boardFilled) {
                  setPopup({
                    show: true,
                    type: "error",
                    message:
                      "Fill all the boxes to check your solution properly.",
                  });
                  // Don't auto-hide error message for incomplete puzzle
                } else {
                  setPopup({
                    show: true,
                    type: "error",
                    message:
                      "Your solution is incorrect. Would you like to see the answer?",
                  });
                  // Don't auto-hide to give user time to decide
                }
              }
            }}
          >
            Check Solution
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setBoard([...sudokuPuzzles[selectedPuzzle]]);
              setSolved(false);
              setPopup({ show: false, type: "", message: "" });
            }}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-red-500/20 
              hover:border-red-500/40 rounded-xl transition-all duration-300 text-red-400 hover:text-red-300"
          >
            Reset Board
          </motion.button>

          {/* Show solution button - appears only when error popup is shown */}
          <AnimatePresence>
            {popup.show && popup.type === "error" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 
                  hover:border-blue-500/50 rounded-xl transition-all duration-300 text-blue-400 hover:text-blue-300"
                onClick={checkSolution}
              >
                Show Solution
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Sudoku;
