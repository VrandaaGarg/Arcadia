const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry =
      Date.now() + process.env.RESET_TOKEN_EXPIRY * 60 * 1000; // Expiry from .env
    await user.save();

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Helper function to send email
async function sendResetEmail(email, resetLink) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const expiryMinutes = process.env.RESET_TOKEN_EXPIRY / (1000 * 60); // Convert ms to minutes
  const expiryText =
    expiryMinutes >= 60
      ? `${expiryMinutes / 60} hour(s)`
      : `${expiryMinutes} minute(s)`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
    <p>Hi,</p>
    <p>You recently requested to reset your password. Click the button below to proceed:</p>
    <p>
      <a href="${resetLink}" 
         style="display: inline-block; padding: 10px 20px; font-size: 16px; 
                color: #fff; background-color: #007bff; text-decoration: none; 
                border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p>This link will expire in <strong>${expiryText}</strong> for security reasons.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Stay safe,</p>
    <p><strong>Arcadia</strong></p>
  `,
  };

  await transporter.sendMail(mailOptions);
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or new password" });
    }

    // Find the user by the reset token
    const user = await User.findOne({ resetToken: token });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set the new password (plain text, will be hashed by the schema's pre-save hook)
    user.password = newPassword;

    // Clear resetToken and resetTokenExpiry
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the user (password will be hashed automatically before saving)
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
