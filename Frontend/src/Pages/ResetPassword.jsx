import React, { useState, useEffect } from "react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // Initialize token state

  // Extract token from URL using useEffect to avoid infinite loop
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []); // Empty dependency array ensures this runs only once

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch(
      "http://localhost:5002/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token, newPassword: newPassword }),
      }
    );

    if (response.ok) {
      alert("Password successfully reset!");
      // Redirect or perform another action after reset
    } else {
      alert("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="py-24">
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
