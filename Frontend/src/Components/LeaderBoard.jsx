import React from "react";

const Leaderboard = ({ game, scores }) => {
  // Sort scores in descending order
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const top3 = sortedScores.slice(0, 3);
  const others = sortedScores.slice(3, 10);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">{game} Leaderboard</h1>

      {/* Top 3 Players with Bars */}
      <div className="w-full max-w-lg space-y-4 mb-6">
        {top3.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center p-4 rounded-lg shadow-md text-lg font-semibold ${
              index === 0
                ? "bg-yellow-500"
                : index === 1
                ? "bg-gray-400"
                : "bg-orange-500"
            }`}
          >
            <span className="w-12">#{index + 1}</span>
            <span className="flex-1">{player.name}</span>
            <span className="font-bold">{player.score}</span>
          </div>
        ))}
      </div>

      {/* Next 7 Players in a Table */}
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Top 10 Players</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Rank</th>
              <th className="text-left">Name</th>
              <th className="text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {others.map((player, index) => (
              <tr key={player.id} className="border-t border-gray-700">
                <td className="py-2">#{index + 4}</td>
                <td>{player.name}</td>
                <td className="text-right font-bold">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
