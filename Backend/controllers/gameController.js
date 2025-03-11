const mongoose = require("mongoose");
const Game = require("../models/Game");
const User = require("../models/User");

// Helper function to check valid ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// Add a new game
//working

const addGame = async (req, res) => {
  try {
    const { name, type, link, ImgUrl } = req.body;

    // Check if all required fields are provided
    if (!name || !type || !link || !ImgUrl) {
      return res
        .status(400)
        .json({ message: "Game name, type,Img Url and link are required" });
    }

    // Check if the game already exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(400).json({ message: "Game already exists" });
    }

    // Format the 'type' field
    const formattedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    // Create a new game instance
    const newGame = new Game({
      name,
      type: formattedType,
      link,
      ImgUrl,
      topScores: [],
    });

    // Save the new game to the database
    await newGame.save();

    // Respond with the newly created game
    res.status(201).json(newGame);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all games
//working
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().lean();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single game by ID
//working
const getGameById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const game = await Game.findById(req.params.id).lean();
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update game details
//working
const updateGame = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a game
//working
const deleteGame = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a player's score to a game leaderboard
const addGameScore = async (req, res) => {
  try {
    const { userId, score } = req.body;

    if (!isValidObjectId(req.params.id) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid Game or User ID" });
    }

    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      game.topScores = game.topScores.filter(
        (entry) => entry.userId.toString() !== userId
      );
      await game.save();
      return res
        .status(404)
        .json({ message: "User not found, scores removed" });
    }

    let existingEntry = game.topScores.find(
      (entry) => entry.userId.toString() === userId
    );

    if (existingEntry) {
      if (game._id.toString() === "67cfe70abeafad4344f82820") {
        //For memory card game, store the lowest score
        if (score < existingEntry.score) {
          existingEntry.score = score;
        } else {
          return res
            .status(200)
            .json({ message: "New score is not lower, no update made" });
        }
      } else {
        //For other games, store the highest score
        if (score > existingEntry.score) {
          existingEntry.score = score;
        } else {
          return res
            .status(200)
            .json({ message: "New score is not higher, no update made" });
        }
      }
    } else {
      game.topScores.push({ userId, username: user.username, score });
    }

    if (game._id.toString() === "67cfe70abeafad4344f82820") {
      // Sort in ascending order for memory card game
      game.topScores.sort((a, b) => a.score - b.score);
    } else {
      // Sort in descending order for other games
      game.topScores.sort((a, b) => b.score - a.score);
    }

    game.topScores = game.topScores.slice(0, 10);
    await game.save();

    let userGameScore = user.gameScores.find(
      (g) => g.gameId.toString() === req.params.id
    );

    if (userGameScore) {
      if (game._id.toString() === "67cfe70abeafad4344f82820") {
        // For this game, store the lowest score
        if (score < userGameScore.highestScore) {
          userGameScore.highestScore = score;
        }
      } else {
        // For other games, store the highest score
        if (score > userGameScore.highestScore) {
          userGameScore.highestScore = score;
        }
      }
    } else {
      user.gameScores.push({ gameId: req.params.id, highestScore: score });
    }

    await user.save();

    res.status(200).json({ message: "Score updated successfully", game });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get leaderboard (only highest score per user)
const getLeaderboard = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const game = await Game.findById(req.params.id)
      .populate("topScores.userId", "username name")
      .lean();

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (!game.topScores || game.topScores.length === 0) {
      return res
        .status(200)
        .json({ message: "No scores available yet", leaderboard: [] });
    }

    // Store only the highest score per user
    const userHighestScores = new Map();
    game.topScores.forEach((entry) => {
      const userIdStr = entry.userId._id.toString();
      if (
        !userHighestScores.has(userIdStr) ||
        (game._id.toString() === "67cfe70abeafad4344f82820"
          ? entry.score < userHighestScores.get(userIdStr).score // Ascending for this game
          : entry.score > userHighestScores.get(userIdStr).score) // Descending for others
      ) {
        userHighestScores.set(userIdStr, {
          userId: entry.userId._id,
          username: entry.userId.username,
          name: entry.userId.name,
          score: entry.score,
        });
      }
    });

    // Convert to sorted leaderboard array
    const leaderboard = Array.from(userHighestScores.values()).sort((a, b) =>
      game._id.toString() === "67cfe70abeafad4344f82820"
        ? a.score - b.score
        : b.score - a.score
    );

    res.status(200).json({ gameName: game.name, leaderboard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
  addGameScore,
  getLeaderboard,
};
