import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaGhost, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BsFillCircleFill } from "react-icons/bs";
import LeaderboardButton from "../Components/LeaderboardButton";
import API from "../api";

const MAZE_LAYOUTS = [
  {
    name: "Classic",
    pattern: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },
  {
    name: "Maze Runner",
    pattern: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
      [1,0,0,0,1,0,1,1,1,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,1,1,1,1,1,1,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  }
];

const DIFFICULTY_SETTINGS = {
  easy: { 
    ghostSpeed: 800, 
    powerUpDuration: 15000, 
    ghostCount: 2,
    ghostBehavior: 'simple'  // Ghosts move more predictably
  },
  medium: { 
    ghostSpeed: 500, 
    powerUpDuration: 10000, 
    ghostCount: 3,
    ghostBehavior: 'normal'  // Standard ghost behavior
  },
  hard: { 
    ghostSpeed: 300, 
    powerUpDuration: 7000, 
    ghostCount: 4,
    ghostBehavior: 'aggressive'  // Ghosts move more strategically
  }
};

// Add this new constant for ghost state management
const GHOST_STATES = {
  CHASE: 'chase',
  SCATTER: 'scatter',
  FRIGHTENED: 'frightened'
};

const PacManGame = () => {
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [scoreToSubmit, setScoreToSubmit] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [currentLayout, setCurrentLayout] = useState(0);
  const [powerUpType, setPowerUpType] = useState('normal');

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

  // Add new state for ghost management
  const [ghostState, setGhostState] = useState(GHOST_STATES.CHASE);
  const [lastGhostUpdate, setLastGhostUpdate] = useState(Date.now());

  // Add new function to handle layout change
  const handleLayoutChange = (newLayout) => {
    setCurrentLayout(newLayout);
    // Reset game state with new layout
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
    setMaze(createMaze(newLayout));
  };

  // Add new function to handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    // Reset game state
    setPacman({ x: 1, y: 1, direction: 'right' });
    setGhosts([
      { x: 13, y: 1, color: 'red' },
      { x: 13, y: 13, color: 'pink' },
      { x: 1, y: 13, color: 'cyan' },
    ].slice(0, DIFFICULTY_SETTINGS[newDifficulty].ghostCount));
    setScore(0);
    setIsGameOver(false);
    setIsPoweredUp(false);
    if (powerTimer) clearTimeout(powerTimer);
    setMaze(createMaze(currentLayout));
  };

  // Modify createMaze to accept layout parameter
  const createMaze = useCallback((layoutIndex = currentLayout) => {
    const mazeTemplate = MAZE_LAYOUTS[layoutIndex].pattern;
    const maze = mazeTemplate.map(row => 
      row.map(cell => ({
        isWall: cell === 1,
        hasDot: cell === 0,
        hasPowerUp: false
      }))
    );

    // Add power-ups strategically
    const powerUpPositions = [
      {x: 1, y: 1}, {x: 1, y: GRID_SIZE-2},
      {x: GRID_SIZE-2, y: 1}, {x: GRID_SIZE-2, y: GRID_SIZE-2}
    ];

    powerUpPositions.forEach(pos => {
      if (!maze[pos.x]?.[pos.y] && !maze[pos.x][pos.y].isWall) {
        maze[pos.x][pos.y].hasPowerUp = true;
        maze[pos.x][pos.y].hasDot = false;
      }
    });

    return maze;
  }, [currentLayout]);

  const [maze, setMaze] = useState(createMaze);

  // Optimize moveGhosts to be independent of pacman movement
  const moveGhosts = useCallback(() => {
    if (isGameOver) return;
    
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - lastGhostUpdate;
    
    if (timeSinceLastUpdate < DIFFICULTY_SETTINGS[difficulty].ghostSpeed) return;
    
    setLastGhostUpdate(currentTime);
    
    setGhosts(prevGhosts => prevGhosts.map(ghost => {
      const possibleMoves = [
        { x: ghost.x + 1, y: ghost.y },
        { x: ghost.x - 1, y: ghost.y },
        { x: ghost.x, y: ghost.y + 1 },
        { x: ghost.x, y: ghost.y - 1 }
      ].filter(move => {
        if (!maze[move.x] || !maze[move.y]) return false;
        return !maze[move.x][move.y].isWall;
      });

      if (possibleMoves.length === 0) return ghost;

      let nextMove;
      
      switch (ghostState) {
        case GHOST_STATES.FRIGHTENED:
          // Run away from Pacman
          nextMove = possibleMoves.reduce((farthest, current) => {
            const currentDist = Math.abs(current.x - pacman.x) + Math.abs(current.y - pacman.y);
            const farthestDist = Math.abs(farthest.x - pacman.x) + Math.abs(farthest.y - pacman.y);
            return currentDist > farthestDist ? current : farthest;
          }, possibleMoves[0]);
          break;

        case GHOST_STATES.SCATTER:
          // Move randomly
          nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          break;

        default: // CHASE
          // Use difficulty-based behavior
          const behavior = DIFFICULTY_SETTINGS[difficulty].ghostBehavior;
          
          if (behavior === 'aggressive') {
            // Predict Pacman's next position
            const predictedPos = {
              x: pacman.x + (pacman.direction === 'up' ? -1 : pacman.direction === 'down' ? 1 : 0),
              y: pacman.y + (pacman.direction === 'left' ? -1 : pacman.direction === 'right' ? 1 : 0)
            };
            nextMove = possibleMoves.reduce((nearest, current) => {
              const currentDist = Math.abs(current.x - predictedPos.x) + Math.abs(current.y - predictedPos.y);
              const nearestDist = Math.abs(nearest.x - predictedPos.x) + Math.abs(nearest.y - predictedPos.y);
              return currentDist < nearestDist ? current : nearest;
            }, possibleMoves[0]);
          } else {
            // Simple or normal behavior
            nextMove = possibleMoves.reduce((nearest, current) => {
              const currentDist = Math.abs(current.x - pacman.x) + Math.abs(current.y - pacman.y);
              const nearestDist = Math.abs(nearest.x - pacman.x) + Math.abs(nearest.y - pacman.y);
              return currentDist < nearestDist ? current : nearest;
            }, possibleMoves[0]);
          }
      }

      return {
        ...ghost,
        x: nextMove.x,
        y: nextMove.y
      };
    }));
  }, [maze, isGameOver, difficulty, ghostState, lastGhostUpdate]);

  // Use requestAnimationFrame for smooth ghost movement
  useEffect(() => {
    if (isGameOver) return;

    let animationFrameId;
    const updateGhosts = () => {
      moveGhosts();
      animationFrameId = requestAnimationFrame(updateGhosts);
    };
    
    animationFrameId = requestAnimationFrame(updateGhosts);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [moveGhosts, isGameOver]);

  // Update ghostState when power-up is collected
  useEffect(() => {
    setGhostState(isPoweredUp ? GHOST_STATES.FRIGHTENED : GHOST_STATES.CHASE);
  }, [isPoweredUp]);

  // Modify movePacman to remove ghost movement dependency
  const movePacman = useCallback((direction) => {
    if (isGameOver) return;
    
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
  }, [isGameOver, maze, powerTimer]);

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
      const interval = setInterval(moveGhosts, DIFFICULTY_SETTINGS[difficulty].ghostSpeed);
      return () => clearInterval(interval);
    }
  }, [moveGhosts, isGameOver, difficulty]);

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
    setPacman({ x: 1, y: 1, direction: 'right' });
    setGhosts([
      { x: 13, y: 1, color: 'red' },
      { x: 13, y: 13, color: 'pink' },
      { x: 1, y: 13, color: 'cyan' },
    ].slice(0, DIFFICULTY_SETTINGS[difficulty].ghostCount));
    setScore(0);
    setIsGameOver(false);
    setIsPoweredUp(false);
    if (powerTimer) clearTimeout(powerTimer);
    setMaze(createMaze());
  }, [difficulty, powerTimer, createMaze]);

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
      return (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-3 h-3 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"
        />
      );
    }

    if (cell.hasDot) {
      return <BsFillCircleFill className="text-white" size={4} />;
    }

    return null;
  };

  const renderGameSettings = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <select
        value={difficulty}
        onChange={(e) => handleDifficultyChange(e.target.value)}
        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-4 py-2 rounded-xl text-gray-200"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        value={currentLayout}
        onChange={(e) => handleLayoutChange(Number(e.target.value))}
        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-4 py-2 rounded-xl text-gray-200"
      >
        {MAZE_LAYOUTS.map((layout, index) => (
          <option key={index} value={index}>
            {layout.name}
          </option>
        ))}
      </select>
    </div>
  );

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

        {renderGameSettings()}

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
