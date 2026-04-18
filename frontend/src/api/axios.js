// ==============================
// src/api/axios.js
// Centralized Axios HTTP client
// All API calls go through this file so we don't repeat the base URL
// It also automatically attaches the JWT token to every request
// ==============================

import axios from "axios";

// Create a custom axios instance with our backend base URL
const API = axios.create({
  baseURL: "https://shreeramgeneralstore.onrender.com", // Backend server URL
  withCredentials: true,
});

// ==============================
// REQUEST INTERCEPTOR
// Runs before every API request is sent
// Automatically adds the JWT token to the Authorization header
// ==============================
API.interceptors.request.use((config) => {
  // Get token from localStorage (saved there during login)
  const token = localStorage.getItem("token");

  if (token) {
    // Add token to the request header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // continue with the request
});

export default API;
