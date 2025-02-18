import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";

// Page imports
import Home from "./Pages/Home";
import TicTacToe from "./Pages/TicTacToe";
import RockPaperScissors from "./Pages/RockPaperScissors";
import MemoryCardGame from "./Pages/MemoryCardGame";
import Sudoku from "./Pages/Sudoku";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Chess from "./Pages/Chess";
import SnakeGame from "./Pages/SnakeGame";
import Game2048 from "./Pages/Game2048";
import Minesweeper from "./Pages/Minesweeper.jsx";
import Leaderboard from "./Components/Leaderboard.jsx";
import Pacman from "./Pages/Pacman.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <AuthProvider>
          <App />
        </AuthProvider>
      }
    >
      {/* Public Routes */}
      <Route path="" element={<Home />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="tictactoe" element={<TicTacToe />} />
      <Route path="rockpaperscissors" element={<RockPaperScissors />} />
      <Route path="memorycardgame" element={<MemoryCardGame />} />
      <Route path="sudoku" element={<Sudoku />} />
      <Route path="chess" element={<Chess />} />
      <Route path="snake" element={<SnakeGame />} />
      <Route path="2048" element={<Game2048 />} />
      <Route path="minesweeper" element={<Minesweeper />} />
      <Route path="/:gameName/leaderboard" element={<Leaderboard />} />
      <Route path="pacman" element={<Pacman />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
