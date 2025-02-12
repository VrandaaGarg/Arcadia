import React, { useState } from "react";

const choices = ["Rock", "Paper", "Scissors"];

const RockPaperScissors = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Rock Paper Scissors</h1>

      {/* Scoreboard */}
      <div className="flex gap-8 text-xl font-semibold mb-6">
        <p className="bg-gray-700 px-4 py-2 rounded-lg">You: {playerScore}</p>
        <p className="bg-gray-700 px-4 py-2 rounded-lg">
          Computer: {computerScore}
        </p>
      </div>

      {/* Choices */}
      <div className="flex gap-4 mb-6">
        {choices.map((choice) => (
          <button
            key={choice}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold text-lg rounded-lg"
            onClick={() => playGame(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* Results */}
      {result && <div className="mt-6 text-2xl font-bold">{result}</div>}

      {/* Display Choices */}
      {playerChoice && computerChoice && (
        <div className="mt-4 text-xl">
          You chose: <span className="font-bold">{playerChoice}</span> <br />
          Computer chose: <span className="font-bold">{computerChoice}</span>
        </div>
      )}

      {/* Reset Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg rounded-lg"
          onClick={resetGame}
        >
          Play Again
        </button>
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-lg"
          onClick={resetScores}
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default RockPaperScissors;
