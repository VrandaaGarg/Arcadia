import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        emailOrUsername: loginData.emailOrUsername,
        password: loginData.password,
      });

      if (response.data && response.data.user) {
        // Update global auth state
        login(response.data.user);
        setMessage({ text: "Login successful!", type: "success" });

        // Redirect to the attempted page or home
        const destination = location.state?.from?.pathname || "/";
        navigate(destination);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Login failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24 flex flex-col items-center bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,#1F2937,#0B1120)] text-white relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20" />

      <div className="relative z-10 w-full max-w-md mx-auto animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-cyan-400 transition-all duration-500">
            Welcome Back
          </span>
        </h1>

        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20"
        >
          {/* Email/Username Input */}
          <div>
            <label className="block text-cyan-400 mb-2 text-sm">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              value={loginData.emailOrUsername}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-gray-100 
                focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-cyan-400 mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-cyan-500/20 text-gray-100 
                focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                transition-all duration-300"
            />
            <NavLink
              to="/forgot-password"
              className="text-cyan-400 text-right hover:text-cyan-300 block text-sm mt-2"
            >
              Forgot Password?
            </NavLink>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
              rounded-lg transition-all duration-300 transform hover:scale-105 
              hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-medium"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
