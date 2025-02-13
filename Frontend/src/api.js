import axios from "axios";

// Determine the base URL based on environment
const API = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://arcadia-backend-765n.onrender.com"
    : "http://localhost:5002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;