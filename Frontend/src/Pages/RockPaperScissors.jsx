import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHandRock,
  FaHandPaper,
  FaHandScissors,
  FaRedo,
} from "react-icons/fa";

const choices = [
  { name: "Rock", icon: FaHandRock },
  { name: "Paper", icon: FaHandPaper },
  { name: "Scissors", icon: FaHandScissors },
];

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState("");

  const playGame = (choice) => {
    setPlayerChoice(choice);
    let computerMove = choices[Math.floor(Math.random() * 3)].name;
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
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-gradient-to-b from-[#1F2937] via-[#0B1120] to-[#0B1120] text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
        >
          Rock Paper Scissors
        </motion.h1>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-6 mb-12"
        >
          <div className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
            <p className="px-4 sm:px-6 py-1 sm:py-2 rounded-xl bg-slate-800/70 text-purple-400 font-bold text-sm sm:text-xl">
              You {playerScore}
            </p>
            <p className="px-4 sm:px-6 py-1 sm:py-2 rounded-xl bg-slate-800/70 text-yellow-200 font-bold text-sm sm:text-xl">
              CPU {computerScore}
            </p>
          </div>
        </motion.div>

        {/* Game Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <p
              className="text-3xl font-bold mb-4 
              ${result.includes('Win') ? 'text-cyan-400' : 
                result.includes('Draw') ? 'text-yellow-400' : 'text-red-400'}"
            >
              {result}
            </p>
            <div className="flex gap-8 items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-2">You chose</p>
                <p className="text-xl text-cyan-400">{playerChoice}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-2">CPU chose</p>
                <p className="text-xl text-purple-400">{computerChoice}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-2xl">
          {choices.map((choice) => {
            const Icon = choice.icon;
            return (
              <motion.button
                key={choice.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playGame(choice.name)}
                className="px-8 py-6 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl
                  transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20
                  flex flex-col items-center gap-3"
              >
                <Icon className="text-3xl md:text-4xl text-cyan-400" />
                <span className="font-medium">{choice.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            <FaRedo />
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetScores}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-red-500/20 
              hover:border-red-500/40 rounded-xl transition-all duration-300 text-red-400 hover:text-red-300"
          >
            Reset Scores
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default RockPaperScissors;
