import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5002/api/users/login",
        {
          emailOrUsername,
          password,
        }
      );

      if (response.status === 200) {
        const userData = response.data.user; // Get user details

        // ✅ Store user details in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Update state (if using React state)
        setUser(userData);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
    }
  };

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

        <form
          onSubmit={handleLogin}
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
