// ==============================
// middleware/authMiddleware.js
// Protects API routes — only logged-in users can access them
// How it works:
//   1. User logs in → gets a JWT token
//   2. User sends token in request header: Authorization: Bearer <token>
//   3. This middleware checks if the token is valid
//   4. If valid → req.user is set and request continues
//   5. If invalid → returns 401 Unauthorized error
// ==============================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This is a middleware function — it runs BEFORE the actual route handler
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  // Example header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token part (after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      // If token is invalid or expired, this will throw an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the ID stored in the token
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select("-password");

      // Pass control to the actual route handler
      next();
    } catch (error) {
      // Token verification failed (expired, tampered, etc.)
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token was provided in the request
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware - runs AFTER protect
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
