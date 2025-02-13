import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 2;

function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPlaying, setIsPlaying] = useState(false);

  // Updated controls with proper direction handling
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          // Space bar to pause/resume
          setIsPlaying(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  // Add touch controls for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;

    const handleTouchMove = (e) => {
      if (!isPlaying || gameOver) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && direction !== 'LEFT') {
            setDirection('RIGHT');
          } else if (deltaX < 0 && direction !== 'RIGHT') {
            setDirection('LEFT');
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && direction !== 'UP') {
            setDirection('DOWN');
          } else if (deltaY < 0 && direction !== 'DOWN') {
            setDirection('UP');
          }
        }
        e.target.removeEventListener('touchmove', handleTouchMove);
      }
    };

    e.target.addEventListener('touchmove', handleTouchMove);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        const newHead = { ...currentSnake[0] };

        switch(direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
          default:
            break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setSpeed(prev => Math.max(prev - SPEED_INCREASE, 50));
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
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    generateFood([{ x: 10, y: 10 }]);
    setIsPlaying(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#1a2234';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#2a3244';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw snake with yellow gradient
    snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        (segment.x + 1) * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      );
      gradient.addColorStop(0, index === 0 ? '#ffd700' : '#ffdb4d'); // Brighter yellow for head
      gradient.addColorStop(1, index === 0 ? '#ffdb4d' : '#ffc800'); // Darker yellow for body
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );

      // Add shine effect
      const shine = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        segment.x * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      );
      shine.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      shine.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shine;
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      (food.x + 0.5) * CELL_SIZE,
      (food.y + 0.5) * CELL_SIZE,
      2,
      (food.x + 0.5) * CELL_SIZE,
      (food.y + 0.5) * CELL_SIZE,
      10
    );
    foodGradient.addColorStop(0, '#ef4444');
    foodGradient.addColorStop(1, '#dc2626');
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      (food.x + 0.5) * CELL_SIZE,
      (food.y + 0.5) * CELL_SIZE,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food]);

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Snake Master
        </h1>

        {/* Enhanced Score Display */}
        <div className="mb-6 flex gap-4">
          <span className="px-6 py-2 rounded-full bg-slate-800/70 text-yellow-200 font-bold text-xl">
            Score: {score}
          </span>
          <span className="px-6 py-2 rounded-full bg-slate-800/70 text-purple-400 font-bold text-xl">
            Speed: {Math.floor((INITIAL_SPEED - speed) / SPEED_INCREASE)}
          </span>
        </div>

        {/* Game Container with Touch Support */}
        <div className="relative touch-none" onTouchStart={handleTouchStart}>
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border-4 border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
          />
          
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl backdrop-blur-sm">
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
                  <p className="text-2xl text-cyan-400 mb-6">Final Score: {score}</p>
                </>
              ) : (
                <div className="text-center space-y-4 mb-6">
                  <h2 className="text-3xl font-bold text-cyan-400">Controls:</h2>
                  <p className="text-gray-300">Arrow Keys or WASD to move</p>
                  <p className="text-gray-300">Space to pause/resume</p>
                  <p className="text-gray-300">Swipe on mobile devices</p>
                </div>
              )}
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                  rounded-xl transition-all duration-300 transform hover:scale-105 text-xl font-bold
                  shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                {gameOver ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          )}
        </div>

        {/* Controls Display */}
        <div className="mt-8 grid grid-cols-3 gap-2 md:hidden">
          <div></div>
          <button onClick={() => direction !== 'DOWN' && setDirection('UP')}
            className="p-4 bg-slate-800/50 rounded-lg text-cyan-400">↑</button>
          <div></div>
          <button onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
            className="p-4 bg-slate-800/50 rounded-lg text-cyan-400">←</button>
          <button onClick={() => setIsPlaying(prev => !prev)}
            className="p-4 bg-slate-800/50 rounded-lg text-cyan-400">⏯️</button>
          <button onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
            className="p-4 bg-slate-800/50 rounded-lg text-cyan-400">→</button>
          <div></div>
          <button onClick={() => direction !== 'UP' && setDirection('DOWN')}
            className="p-4 bg-slate-800/50 rounded-lg text-cyan-400">↓</button>
          <div></div>
        </div>

        <div className="flex gap-4 mt-8">
          <NavLink
            to="/leaderboard"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
              rounded-xl transition-all duration-300 transform hover:scale-105 
              hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] font-medium flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;
