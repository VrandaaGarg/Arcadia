import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {user ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-6">Profile</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <h3 className="mt-4 font-bold">Game Scores</h3>
          <ul className="list-disc pl-5">
            {user.gameScores.length > 0 ? (
              user.gameScores.map((game, index) => (
                <li key={index}>
                  {game.game}: {game.highScore}
                </li>
              ))
            ) : (
              <li>No games played yet.</li>
            )}
          </ul>
          <button
            className="mt-4 bg-red-600 px-4 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
