import React, { useState, useEffect } from "react";
import { FaDotCircle, FaGhost, FaCircle } from "react-icons/fa"; // Pac-Man, Ghost & Food Icons
import LeaderboardButton from "../Components/LeaderboardButton";
import API from "../api";

const Pacman = () => {
  const gridSize = 10;
  const initialPacMan = { x: 0, y: 0 };
  const initialGhosts = [
    { x: 5, y: 5 },
    { x: 7, y: 7 },
    { x: 2, y: 8 },
    { x: 8, y: 3 },
    { x: 4, y: 6 },
  ];
  const [pacMan, setPacMan] = useState(initialPacMan);
  const [ghosts, setGhosts] = useState(initialGhosts);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
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
      console.log(gameId);
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

  const [food, setFood] = useState(
    Array.from({ length: gridSize * gridSize }, (_, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      return { x, y };
    })
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isGameOver) return;
      event.preventDefault(); // Prevents arrow keys from scrolling the screen
      let newPacMan = { ...pacMan };
      if (event.key === "ArrowUp") newPacMan.y = Math.max(0, pacMan.y - 1);
      if (event.key === "ArrowDown")
        newPacMan.y = Math.min(gridSize - 1, pacMan.y + 1);
      if (event.key === "ArrowLeft") newPacMan.x = Math.max(0, pacMan.x - 1);
      if (event.key === "ArrowRight")
        newPacMan.x = Math.min(gridSize - 1, pacMan.x + 1);
      setPacMan(newPacMan);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pacMan, isGameOver]);

  useEffect(() => {
    if (ghosts.some((ghost) => ghost.x === pacMan.x && ghost.y === pacMan.y)) {
      setIsGameOver(true);
    }
  }, [pacMan, ghosts]);

  useEffect(() => {
    setFood((prevFood) =>
      prevFood.filter((dot) => !(dot.x === pacMan.x && dot.y === pacMan.y))
    );
    setScore((prevScore) => prevScore + 1);
  }, [pacMan]);

  useEffect(() => {
    if (isGameOver) {
      setScoreToSubmit(score);
    }
    const moveGhosts = setInterval(() => {
      if (isGameOver) return;
      const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const randomDirection =
            directions[Math.floor(Math.random() * directions.length)];
          return {
            x: Math.max(0, Math.min(gridSize - 1, ghost.x + randomDirection.x)),
            y: Math.max(0, Math.min(gridSize - 1, ghost.y + randomDirection.y)),
          };
        })
      );
    }, 250);
    return () => clearInterval(moveGhosts);
  }, [isGameOver]);

  const restartGame = () => {
    setPacMan(initialPacMan);
    setGhosts(initialGhosts);
    setScore(0);
    setIsGameOver(false);
    setFood(
      Array.from({ length: gridSize * gridSize }, (_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        return { x, y };
      })
    );
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
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Pac-Man Clone</h1>
      <div className="grid grid-cols-10 gap-1 bg-gray-800 p-2">
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          return (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center border border-gray-600"
            >
              {pacMan.x === x && pacMan.y === y ? (
                <FaDotCircle className="text-yellow-400 text-2xl" />
              ) : ghosts.some((ghost) => ghost.x === x && ghost.y === y) ? (
                <FaGhost className="text-red-500 text-2xl" />
              ) : food.some((dot) => dot.x === x && dot.y === y) ? (
                <FaCircle className="text-white text-sm" />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-lg">Score: {score}</div>
      {isGameOver && (
        <div className="mt-4 text-xl font-bold text-red-500">
          Game Over!
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={restartGame}
          >
            Start Again
          </button>
        </div>
      )}

      <LeaderboardButton gameLink="pacman" />
    </div>
  );
};

export default Pacman;
