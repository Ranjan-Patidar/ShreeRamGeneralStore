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

// Fail fast if required environment variables are missing
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "ADMIN_SECRET"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnv.join(", "));
  console.error("   Set them in your .env file (local) or Render dashboard (production).");
  process.exit(1);
}

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
app.use(cors({
  origin: true,   // allow all origins (Vercel + localhost)
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
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("   Check: 1) MONGO_URI env var on Render  2) Atlas IP Whitelist (add 0.0.0.0/0)  3) Cluster is not paused");
  });

mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("✅ MongoDB reconnected"));

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
// HEALTH CHECK — shows DB connection state
// ==============================
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    server: "running",
    database: states[dbState] || "unknown",
    dbStateCode: dbState,
  });
});

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