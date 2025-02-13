const express = require("express");
const router = express.Router();
const {
  registerUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);

//login a user
router.post("/login", loginUser);

// Forgot and reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Get all users
router.get("/", getAllUsers);

// Get a single user by ID
router.get("/:id", getUserById);

// Update a user
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
