import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const choices = ["Rock", "Paper", "Scissors"];

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState("");

  const playGame = (choice) => {
    setPlayerChoice(choice);
    let computerMove = choices[Math.floor(Math.random() * 3)];
    setComputerChoice(computerMove);
    determineWinner(choice, computerMove);
  };

  const determineWinner = (player, computer) => {
    if (player === computer) {
      setResult("It's a Draw! 🤝");
    } else if (
      (player === "Rock" && computer === "Scissors") ||
      (player === "Paper" && computer === "Rock") ||
      (player === "Scissors" && computer === "Paper")
    ) {
      setResult("🎉 You Win! 🎉");
      setPlayerScore((prev) => prev + 1);
    } else {
      setResult("💀 Computer Wins! 💀");
      setComputerScore((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  const resetScores = () => {
    setPlayerScore(0);
    setComputerScore(0);
    resetGame();
  };

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B8AC]">
          Rock Paper Scissors
        </h1>

        {/* Score & Leaderboard */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex gap-4">
            <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
              You: {playerScore}
            </p>
            <p className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 px-6 py-3 rounded-xl">
              CPU: {computerScore}
            </p>
          </div>
          <NavLink
            to="/leaderboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            🏆 Leaderboard
          </NavLink>
        </div>

        {/* Game Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => playGame(choice)}
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl
                transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]
                transform hover:scale-105"
            >
              {choice}
            </button>
          ))}
        </div>

        {/* Results Display */}
        {result && (
          <div className="text-center mb-8 animate-fadeIn">
            <p className="text-2xl font-bold text-cyan-400 mb-4">{result}</p>
            {playerChoice && (
              <div className="space-y-2 text-gray-300">
                <p>You chose: <span className="text-cyan-400">{playerChoice}</span></p>
                <p>Computer chose: <span className="text-cyan-400">{computerChoice}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Play Again
          </button>
          <button
            onClick={resetScores}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}

export default RockPaperScissors;
