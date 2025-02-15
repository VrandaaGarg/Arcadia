const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password", resetPassword);

module.exports = router;
