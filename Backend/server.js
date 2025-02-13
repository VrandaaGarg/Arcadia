const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config(); // Load environment variables

const app = express(); // Initialize express app

app.use(
  express.json(),
  cors({
    origin: "http://localhost:5173", // Allow requests from React frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// OR (If you want to allow all origins temporarily during development)
app.use(cors());

app.use(express.json()); // Ensure JSON request handling

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

// Middleware for handling 404 (Not Found)
app.use(notFound);

// Middleware for handling errors
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
