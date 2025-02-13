// const mongoose = require("mongoose");

// const gameSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   type: {
//     type: String,
//     required: true,
//     enum: ["Singleplayer", "Multiplayer"], // Ensure valid values
//   },
//   topScores: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       score: { type: Number, required: true },
//     },
//   ],
// });

// const Game = mongoose.model("Game", gameSchema);
// module.exports = Game;

const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ["Singleplayer", "Multiplayer"] },
  topScores: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: { type: String, required: true }, // Store username for easy lookup
      score: { type: Number, required: true },
    },
  ],
});

// Ensure topScores always stores only the top 10 scores
gameSchema.pre("save", function (next) {
  this.topScores.sort((a, b) => b.score - a.score); // Sort descending
  this.topScores = this.topScores.slice(0, 10); // Keep only top 10
  next();
});

module.exports = mongoose.model("Game", gameSchema);
