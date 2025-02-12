const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true }, // Index for faster lookup
  email: { type: String, unique: true, required: true, index: true }, // Index for faster lookup
  phone: { type: String, required: true },
  password: { type: String, required: true },
  gameScores: [
    {
      gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
      },
      highestScore: { type: Number, default: 0 },
    },
  ],
});

// Ensure each user has only one entry per game in gameScores
UserSchema.index({ "gameScores.gameId": 1, _id: 1 }, { unique: true });

// Middleware: Remove user's scores from game leaderboards when deleted
UserSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  try {
    await mongoose.model("Game").updateMany(
      {},
      { $pull: { topScores: { userId: userId } } } // Remove scores of deleted user
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
