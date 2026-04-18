// ==============================
// server.js — Main Backend Server File
// This is the entry point for the backend
// It connects to MongoDB and registers all routes
// ==============================

// Fix DNS resolution issues on some systems (resolves IPv4 before IPv6)
require('dns').setDefaultResultOrder('ipv4first');

// Load environment variables from .env file
// Variables like MONGO_URI and JWT_SECRET are stored there
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ---- Import Route Files ----
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");

// Create the Express app
const app = express();

// ==============================
// MIDDLEWARE SETUP
// These run on EVERY request before reaching a route
// ==============================

// Enable CORS — allows frontend (localhost:5173) to call this backend
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "https://shree-ram-general-store-vuts.vercel.app"
//   ],
//   credentials: true,
// }));
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parse incoming JSON request bodies (req.body)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==============================
// DATABASE CONNECTION
// Connects to MongoDB Atlas using the URI from .env
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ==============================
// API ROUTES
// Each route file handles a specific feature
// ==============================

// 🔐 Auth: /api/auth/register and /api/auth/login
app.use("/api/auth", authRoutes);

// 🛍️ Products: /api/products (GET all, GET by ID, POST seed)
app.use("/api/products", productRoutes);

// 🛒 Cart: /api/cart (add, remove, update, clear)
app.use("/api/cart", cartRoutes);

// ❤️ Wishlist: /api/wishlist (get, toggle)
app.use("/api/wishlist", wishlistRoutes);

// 📦 Orders: /api/orders/place, /api/orders/my
app.use("/api/orders", orderRoutes);

// 💳 Payment: /api/payment
app.use("/api/payment", paymentRoutes);

// ==============================
// ROOT ROUTE — Health check
// Visit http://localhost:5000 to confirm server is running
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "🚀 ShreeRam Store Backend is running!",
    status: "active",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/products",
      "POST /api/products/seed",
      "GET  /api/cart",
      "POST /api/cart/add",
      "GET  /api/wishlist",
      "POST /api/wishlist/toggle",
      "POST /api/orders/place",
      "GET  /api/orders/my",
    ],
  });
});

// ==============================
// START SERVER
// Listens on PORT 5000 (or from .env)
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Seed products: POST http://localhost:${PORT}/api/products/seed`);
});