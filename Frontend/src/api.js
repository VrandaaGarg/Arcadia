import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002", // Change this if your backend runs on a different port
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
