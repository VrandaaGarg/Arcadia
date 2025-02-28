import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaGhost, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BsFillCircleFill } from "react-icons/bs";
import LeaderboardButton from "../Components/LeaderboardButton";
import API from "../api";

const PacManGame = () => {
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

  const GRID_SIZE = 15; // Larger grid for better gameplay
  const GHOST_SPEED = 400; // Milliseconds between ghost moves
  const POWER_UP_DURATION = 10000; // 10 seconds power-up

  const [pacman, setPacman] = useState({ x: 1, y: 1, direction: 'right' });
  const [ghosts, setGhosts] = useState([
    { x: 13, y: 1, color: 'red' },
    { x: 13, y: 13, color: 'pink' },
    { x: 1, y: 13, color: 'cyan' },
  ]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [powerTimer, setPowerTimer] = useState(null);

  // Create maze with walls, dots, and power-ups
  const createMaze = useCallback(() => {
    const maze = Array(GRID_SIZE).fill().map(() => 
      Array(GRID_SIZE).fill().map(() => ({
        isWall: false,
        hasDot: true,
        hasPowerUp: false
      }))
    );

    // Add walls in a pac-man like pattern
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Border walls
        if (i === 0 || i === GRID_SIZE - 1 || j === 0 || j === GRID_SIZE - 1) {
          maze[i][j].isWall = true;
          maze[i][j].hasDot = false;
        }
        // Internal walls pattern
        if ((i % 2 === 0 && j % 2 === 0) && 
            (i !== 0 && i !== GRID_SIZE - 1 && j !== 0 && j !== GRID_SIZE - 1)) {
          maze[i][j].isWall = true;
          maze[i][j].hasDot = false;
        }
      }
    }

    // Add power-ups in corners
    maze[1][1].hasPowerUp = true;
    maze[1][GRID_SIZE-2].hasPowerUp = true;
    maze[GRID_SIZE-2][1].hasPowerUp = true;
    maze[GRID_SIZE-2][GRID_SIZE-2].hasPowerUp = true;
    maze[1][1].hasDot = false;

    return maze;
  }, []);

  const [maze, setMaze] = useState(createMaze);

  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => prevGhosts.map(ghost => {
      const possibleMoves = [
        { x: ghost.x + 1, y: ghost.y },
        { x: ghost.x - 1, y: ghost.y },
        { x: ghost.x, y: ghost.y + 1 },
        { x: ghost.x, y: ghost.y - 1 }
      ].filter(move => !maze[move.x]?.[move.y]?.isWall);

      if (isPoweredUp) {
        // Move away from Pacman when powered up
        possibleMoves.sort((a, b) => 
          (Math.abs(b.x - pacman.x) + Math.abs(b.y - pacman.y)) -
          (Math.abs(a.x - pacman.x) + Math.abs(a.y - pacman.y))
        );
      } else {
        // Move towards Pacman
        possibleMoves.sort((a, b) => 
          (Math.abs(a.x - pacman.x) + Math.abs(a.y - pacman.y)) -
          (Math.abs(b.x - pacman.x) + Math.abs(b.y - pacman.y))
        );
      }

      return {
        ...ghost,
        ...(possibleMoves[0] || ghost)
      };
    }));
  }, [maze, pacman.x, pacman.y, isPoweredUp]);

  // Movement and game logic
  const movePacman = useCallback((direction) => {
    setPacman(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up': newX--; break;
        case 'down': newX++; break;
        case 'left': newY--; break;
        case 'right': newY++; break;
        default: break;
      }

      // Check wall collision
      if (maze[newX]?.[newY]?.isWall) {
        return { ...prev, direction };
      }

      // Check dot collection
      if (maze[newX][newY].hasDot) {
        setScore(s => s + 10);
        setMaze(prev => {
          const newMaze = [...prev];
          newMaze[newX][newY].hasDot = false;
          return newMaze;
        });
      }

      // Check power-up collection
      if (maze[newX][newY].hasPowerUp) {
        setIsPoweredUp(true);
        setMaze(prev => {
          const newMaze = [...prev];
          newMaze[newX][newY].hasPowerUp = false;
          return newMaze;
        });
        
        if (powerTimer) clearTimeout(powerTimer);
        const timer = setTimeout(() => setIsPoweredUp(false), POWER_UP_DURATION);
        setPowerTimer(timer);
      }

      return { x: newX, y: newY, direction };
    });
  }, [maze, powerTimer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isGameOver) return;
      event.preventDefault(); // Prevents arrow keys from scrolling the screen

      switch (event.key) {
        case "ArrowUp":
          movePacman("up");
          break;
        case "ArrowDown":
          movePacman("down");
          break;
        case "ArrowLeft":
          movePacman("left");
          break;
        case "ArrowRight":
          movePacman("right");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePacman, isGameOver]);

  // Collision detection
  useEffect(() => {
    const checkCollision = () => {
      const collision = ghosts.some(ghost => 
        ghost.x === pacman.x && ghost.y === pacman.y
      );

      if (collision) {
        if (isPoweredUp) {
          setScore(prevScore => prevScore + 200);
        } else {
          setIsGameOver(true);
          // Submit score immediately when game is over
          submitScore(score);
        }
      }
    };

    checkCollision();
  }, [pacman, ghosts, isPoweredUp]);

  // Ghost movement interval
  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(moveGhosts, GHOST_SPEED);
      return () => clearInterval(interval);
    }
  }, [moveGhosts, isGameOver]);

  // Update score submission logic
  const submitScore = async (finalScore) => {
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
        score: finalScore,
        gameId: gameId
      });
      console.log("Score submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const handleMobileControl = (direction) => {
    if (isGameOver) return;
    movePacman(direction);
  };

  const restartGame = useCallback(() => {
    if (isGameOver) {
      setPacman({ x: 1, y: 1, direction: 'right' });
      setGhosts([
        { x: 13, y: 1, color: 'red' },
        { x: 13, y: 13, color: 'pink' },
        { x: 1, y: 13, color: 'cyan' },
      ]);
      setScore(0);
      setIsGameOver(false);
      setIsPoweredUp(false);
      if (powerTimer) clearTimeout(powerTimer);
      setMaze(createMaze());
    }
  }, [isGameOver, powerTimer, createMaze]);

  const renderCell = (x, y) => {
    const isPacman = pacman.x === x && pacman.y === y;
    const ghost = ghosts.find(g => g.x === x && g.y === y);
    const cell = maze[x][y];

    if (isPacman) {
      return (
        <motion.div
          animate={{ rotate: pacman.direction === 'left' ? 180 : 0 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full" />
        </motion.div>
      );
    }

    if (ghost) {
      return (
        <FaGhost 
          className={`text-${ghost.color}-500 ${isPoweredUp ? 'opacity-50' : ''}`} 
          size={20} 
        />
      );
    }

    if (cell.isWall) {
      return <div className="w-full h-full bg-blue-900/50 rounded-sm" />;
    }

    if (cell.hasPowerUp) {
      return <BsFillCircleFill className="text-yellow-300 animate-pulse" size={12} />;
    }

    if (cell.hasDot) {
      return <BsFillCircleFill className="text-white" size={4} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen px-4 py-16 flex flex-col items-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center mt-10"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Pac-Man
        </h1>

        {/* Score & Controls Info */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
            <p className="text-2xl font-bold">Score: {score}</p>
          </div>
          <LeaderboardButton gameLink="pacman" />
        </div>

        {/* Game Board */}
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20"
        >
          <div className="grid grid-cols-15 gap-1">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = Math.floor(index / GRID_SIZE);
              const y = index % GRID_SIZE;
              return (
                <motion.div
                  key={index}
                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-700/50 rounded-sm"
                >
                  {renderCell(x, y)}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile Controls */}
        <div className="md:hidden mt-8 flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMobileControl("up")}
            className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center border border-cyan-500/20"
          >
            <FaArrowUp className="text-cyan-400 text-xl" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMobileControl("left")}
              className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center border border-cyan-500/20"
            >
              <FaArrowLeft className="text-cyan-400 text-xl" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMobileControl("down")}
              className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center border border-cyan-500/20"
            >
              <FaArrowDown className="text-cyan-400 text-xl" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMobileControl("right")}
              className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center border border-cyan-500/20"
            >
              <FaArrowRight className="text-cyan-400 text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Game Over Modal */}
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-800/90 p-8 rounded-xl flex flex-col items-center gap-6 border border-red-500/20"
            >
              <h2 className="text-3xl font-bold text-red-500">Game Over!</h2>
              <p className="text-2xl">Final Score: {score}</p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold"
                >
                  Play Again
                </motion.button>
                <LeaderboardButton gameLink="pacman" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PacManGame;
