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
import TicTacToe from "./Pages/TicTacToe";
import Home from "./Pages/Home";
import RockPaperScissors from "./Pages/RockPaperScissors";
import MemoryCardGame from "./Pages/MemoryCardGame";
import Sudoku from "./Pages/Sudoku";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Chess from "./Pages/Chess";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="tictactoe" element={<TicTacToe />} />
      <Route path="rockpaperscissors" element={<RockPaperScissors />} />
      <Route path="memorycardgame" element={<MemoryCardGame />} />
      <Route path="sudoku" element={<Sudoku />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="chess" element={<Chess />} />
      <Route path="login" element={<Login />} />
      <Route path="profile" element={<Profile />} />

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
