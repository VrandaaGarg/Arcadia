import React, { useState } from "react";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Sudoku</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Choose a puzzle:</label>
        <select
          onChange={(e) => handlePuzzleChange(Number(e.target.value))}
          value={selectedPuzzle}
          className="border rounded px-2 py-1"
        >
          {sudokuPuzzles.map((_, index) => (
            <option key={index} value={index}>
              Puzzle {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-9 gap-1 border border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              className="w-10 h-10 text-center border border-gray-500 focus:outline-none"
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              disabled={cell !== ""}
            />
          ))
        )}
      </div>

      <div className="flex gap-6 justify-center">
        <button
          onClick={() => alert(checkWin() ? "You solved it!" : "Keep going!")}
          className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        >
          Check
        </button>

        <button
          onClick={() => setBoard([...sudokuPuzzles[selectedPuzzle]])}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Sudoku;
