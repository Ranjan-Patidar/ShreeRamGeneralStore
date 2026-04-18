// ==============================
// routes/wishlist.js
// Manages the user's wishlist (liked/interested products)
// ==============================

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ==============================
// GET /api/wishlist
// Returns all products in the user's wishlist
// ==============================
router.get("/", protect, async (req, res) => {
  try {
    // Populate product details from the wishlist IDs
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json(user.wishlist || []);
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

// ==============================
// POST /api/wishlist/toggle
// Toggles a product in/out of the wishlist
// If product is already wishlisted → remove it
// If product is not wishlisted → add it
// Body: { productId }
// Returns: { wishlisted: true/false }
// ==============================
router.post("/toggle", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    // Check if the product is already in the wishlist
    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
      await user.save();
      res.json({ message: "Removed from wishlist", wishlisted: false });
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Added to wishlist ❤️", wishlisted: true });
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error.message);
    res.status(500).json({ message: "Error updating wishlist" });
  }
});

module.exports = router;
