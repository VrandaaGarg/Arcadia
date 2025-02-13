const express = require("express");
const router = express.Router();
const {
  addGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
  addGameScore,
  getLeaderboard,
} = require("../controllers/gameController");

// Add a new game
router.post("/", addGame);

// Get all games
router.get("/", getAllGames);

// Get a single game by ID
router.get("/:id", getGameById);

// Update a game
router.put("/:id", updateGame);

// Delete a game
router.delete("/:id", deleteGame);

// Add a player's score to a game
router.post("/:id/scores", addGameScore);

// Get leaderboard (top 10 scores) for a game
router.get("/:id/leaderboard", getLeaderboard);

module.exports = router;
