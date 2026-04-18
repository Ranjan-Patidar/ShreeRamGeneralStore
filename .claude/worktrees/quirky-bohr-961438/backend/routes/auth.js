// ==============================
// routes/auth.js
// Handles user Registration and Login
// ==============================

const express = require("express");
const router = express.Router(); // Creates a mini "sub-app" for these routes
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

// ==============================
// HELPER: Generate a JWT token for a user
// The token expires in 30 days
// ==============================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },            // Payload: stores user's ID
    process.env.JWT_SECRET,    // Secret key from .env file
    { expiresIn: "30d" }       // Token expires in 30 days
  );
};

// ==============================
// POST /api/auth/register
// Creates a new user account
// Body: { name, email, password, phone }
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    // Validate: all required fields must be present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    // Create a new user document in MongoDB
    // Password will be automatically hashed by the pre-save middleware in User.js
    const user = await User.create({
      name,
      email,
      password, // will be hashed before saving
      phone: phone || "",
    });

    // Send back user info and a JWT token
    res.status(201).json({
      message: "Account created successfully! Welcome to ShreeRam Store 🎉",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ==============================
// POST /api/auth/login
// Logs in an existing user
// Body: { email, password }
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Password matched — send token and user details
    res.json({
      message: "Login successful! Welcome back 👋",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ==============================
// POST /api/auth/make-admin
// Development route to make a user an admin
// Body: { email }
// ==============================
router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    await user.save();
    res.json({ message: `${user.name} is now an admin` });
  } catch (error) {
    res.status(500).json({ message: "Error making admin" });
  }
});

// ==============================
// GET /api/auth/users
// Admin route to get all registered users
// ==============================
router.get("/users", protect, admin, async (req, res) => {
  try {
    // Get all users, converting to plain JS objects for easy manipulation
    const users = await User.find({}).select("-password").sort({ createdAt: -1 }).lean();

    // Aggregate orders to get total orders and total spent per user
    const orderStats = await Order.aggregate([
      {
        // Don't count cancelled orders towards spend if desired, but let's count all non-cancelled
        $match: { orderStatus: { $ne: "Cancelled" } }
      },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalPayment: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Map order stats back to users array
    const usersWithStats = users.map(user => {
      const stats = orderStats.find(s => s._id && s._id.toString() === user._id.toString());
      return {
        ...user,
        totalOrders: stats ? stats.totalOrders : 0,
        totalPayment: stats ? stats.totalPayment : 0,
      };
    });

    res.json(usersWithStats);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// ==============================
// DELETE /api/auth/users/:id
// Admin route to delete a user
// ==============================
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally: check if this is the last admin to prevent self-lockout
    // if (user.role === 'admin') ...

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

// ==============================
// PUT /api/auth/users/:id
// Admin route to update a user's details (name, email, role)
// ==============================
router.put("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, role } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ message: "Server error updating user" });
  }
});

module.exports = router;
