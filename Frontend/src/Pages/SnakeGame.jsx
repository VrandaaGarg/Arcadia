import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import API from "../api";
import LeaderboardButton from "../Components/LeaderboardButton";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const getResponsiveCellSize = () => {
  // Calculate cell size based on screen width
  const width = window.innerWidth;
  if (width < 400) return 15; // smaller cells for very small screens
  if (width < 768) return 20; // medium cells for mobile
  return 25; // default size for larger screens
};

const INITIAL_SPEED = 240;
const SPEED_INCREASE = 0.95;

function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cellSize, setCellSize] = useState(getResponsiveCellSize());

  ////////////////////////////////////////////----?----////////////////////////////////////////////
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

  // Updated controls with proper direction handling
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          // Space bar to pause/resume
          setIsPlaying((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  // Add touch controls for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;
    let touchMoved = false;

    const handleTouchMove = (e) => {
      if (!isPlaying || gameOver) return;
      touchMoved = true;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      // Reduced threshold for more responsive controls
      if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && direction !== "LEFT") {
            setDirection("RIGHT");
          } else if (deltaX < 0 && direction !== "RIGHT") {
            setDirection("LEFT");
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && direction !== "UP") {
            setDirection("DOWN");
          } else if (deltaY < 0 && direction !== "DOWN") {
            setDirection("UP");
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (!touchMoved && !gameOver) {
        // Toggle pause on tap
        setIsPlaying((prev) => !prev);
      }
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    const handleResize = () => {
      setCellSize(getResponsiveCellSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newHead = { ...currentSnake[0] };

        switch (direction) {
          case "UP":
            newHead.y -= 1;
            break;
          case "DOWN":
            newHead.y += 1;
            break;
          case "LEFT":
            newHead.x -= 1;
            break;
          case "RIGHT":
            newHead.x += 1;
            break;
          default:
            break;
        }

        // Check collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          currentSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          setScoreToSubmit(score);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 10);
          setSpeed((prev) => Math.max(prev * SPEED_INCREASE, 50));
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPlaying, speed]);

  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  };

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    generateFood([{ x: 10, y: 10 }]);
    setIsPlaying(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Update canvas size
    canvas.width = GRID_SIZE * cellSize;
    canvas.height = GRID_SIZE * cellSize;

    // Clear canvas
    ctx.fillStyle = "#1a2234";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#2a3244";
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }

    // Draw snake with yellow gradient
    snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * cellSize,
        segment.y * cellSize,
        (segment.x + 1) * cellSize,
        (segment.y + 1) * cellSize
      );
      gradient.addColorStop(0, index === 0 ? "#ffd700" : "#ffdb4d"); // Brighter yellow for head
      gradient.addColorStop(1, index === 0 ? "#ffdb4d" : "#ffc800"); // Darker yellow for body

      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize - 1,
        cellSize - 1
      );

      // Add shine effect
      const shine = ctx.createLinearGradient(
        segment.x * cellSize,
        segment.y * cellSize,
        segment.x * cellSize,
        (segment.y + 1) * cellSize
      );
      shine.addColorStop(0, "rgba(255, 255, 255, 0.2)");
      shine.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = shine;
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize - 1,
        cellSize - 1
      );
    });

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      (food.x + 0.5) * cellSize,
      (food.y + 0.5) * cellSize,
      2,
      (food.x + 0.5) * cellSize,
      (food.y + 0.5) * cellSize,
      10
    );
    foodGradient.addColorStop(0, "#ef4444");
    foodGradient.addColorStop(1, "#dc2626");

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      (food.x + 0.5) * cellSize,
      (food.y + 0.5) * cellSize,
      cellSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food, cellSize]);

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
    } catch (error) {
      console.error(
        "Error submitting score:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen px-6 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center animate-fadeIn">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 ">
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
            Snake Game
          </motion.span>
        </h1>

        {/* Enhanced Score Display */}
        <div className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
          <span className="px-4 sm:px-6 py-1 sm:py-2 rounded-xl bg-slate-800/70 text-yellow-200 font-bold text-sm sm:text-xl">
            Score: {score}
          </span>
          <span className="px-4 sm:px-6 py-1 sm:py-2 rounded-xl bg-slate-800/70 text-purple-400 font-bold text-sm sm:text-xl">
            Speed:{" "}
            {Math.floor(
              Math.log(speed / INITIAL_SPEED) / Math.log(SPEED_INCREASE)
            )}
          </span>
        </div>

        {/* Game Container with Touch Support */}
        <div
          className="relative touch-none select-none"
          onTouchStart={handleTouchStart}
        >
          <canvas
            ref={canvasRef}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 sm:border-4 border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
          />

          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm p-4">
              {gameOver ? (
                <>
                  <h2 className="text-2xl sm:text-4xl font-bold text-red-500 mb-2 sm:mb-4">
                    Game Over!
                  </h2>
                  <p className="text-xl sm:text-2xl text-cyan-400 mb-4 sm:mb-6">
                    Final Score: {score}
                  </p>
                </>
              ) : (
                <div className="text-center space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-3xl font-bold text-cyan-400">
                    Controls:
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300">
                    Swipe to move
                  </p>
                  <p className="text-sm sm:text-base text-gray-300">
                    Tap to stop
                  </p>
                </div>
              )}
              <button
                onClick={startGame}
                className="px-6 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                  rounded-xl transition-all duration-300 transform hover:scale-105 text-lg sm:text-xl font-bold
                  shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                {gameOver ? "Play Again" : "Start Game"}
              </button>
            </div>
          )}
        </div>

        <div className="py-7">
          <LeaderboardButton gameLink="snake" />
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;
