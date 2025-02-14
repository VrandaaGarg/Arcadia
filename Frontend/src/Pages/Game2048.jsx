import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    let touchStartX, touchStartY;

    const handleTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
      let touchEndX = event.changedTouches[0].clientX;
      let touchEndY = event.changedTouches[0].clientY;

      let dx = touchEndX - touchStartX;
      let dy = touchEndY - touchStartY;

      let direction = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else {
        direction = dy > 0 ? "down" : "up";
      }

      if (direction) {
        setBoard((prevBoard) => moveBoard(prevBoard, direction, setScore));
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
  };
  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400">
        2048 Game
      </h1>
      <div className="border-1 border-white/30 rounded-lg overflow-hidden shadow-lg shadow-white/10">
        <div className="grid grid-cols-4 gap-2 md:gap-4 bg-[#082B4C] p-4 rounded-lg">
          {board.flat().map((num, index) => (
            <div
              key={index}
              className={`w-16 h-16 md:w-28 md:h-28 flex items-center justify-center border-2 hover:scale-105 hover:shadow-sm hover:shadow-white/70 hover:border-white/40 text-black bg-[radial-gradient(ellipse_at_top,#53D2FF,#0188B9)] border-black text-3xl md:text-5xl font-bold bg-gray-${
                num ? "300" : "500"
              } rounded-lg`}
            >
              {num !== 0 ? num : ""}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center mt-8 gap-10">
        <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl text-xl md:text-3xl ">
          Score: {score}
        </p>
        <button
          onClick={resetGame}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl text-xl md:text-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Game2048;
