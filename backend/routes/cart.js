// ==============================
// routes/cart.js
// Server-side cart management
// Each logged-in user has their own cart stored in the database
// ==============================

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// We'll store cart as a field on User, so let's add a Cart model instead
// for cleaner separation. Actually we'll embed cart in User for simplicity.

// ==============================
// GET /api/cart
// Returns the current user's cart
// Each item: { product, quantity }
// ==============================
router.get("/", protect, async (req, res) => {
  try {
    // Find user and populate product details inside cart items
    const user = await User.findById(req.user._id).populate({
      path: "cart.product",
      model: "Product",
    });

    // If user has no cart field yet, return empty array
    if (!user.cart) return res.json([]);

    res.json(user.cart);
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ==============================
// POST /api/cart/add
// Adds a product to the cart
// Body: { productId, quantity }
// If product already in cart → increase quantity
// ==============================
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists in DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the user from DB
    const user = await User.findById(req.user._id);

    // Check if product is already in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Product already in cart — increase quantity
      existingItem.quantity += quantity;
    } else {
      // New product — add to cart
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // Return updated cart with full product details
    const updatedUser = await User.findById(req.user._id).populate({
      path: "cart.product",
      model: "Product",
    });

    res.json({ message: "Added to cart!", cart: updatedUser.cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// ==============================
// PUT /api/cart/update
// Updates quantity of an item in cart
// Body: { productId, quantity }
// If quantity = 0, item is removed
// ==============================
router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);

    if (quantity <= 0) {
      // Remove item from cart if quantity is 0 or less
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      // Find the item and update its quantity
      const item = user.cart.find(
        (item) => item.product.toString() === productId
      );
      if (item) item.quantity = quantity;
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate({
      path: "cart.product",
      model: "Product",
    });

    res.json({ message: "Cart updated!", cart: updatedUser.cart });
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ message: "Error updating cart" });
  }
});

// ==============================
// DELETE /api/cart/remove/:productId
// Removes a specific product from the cart
// ==============================
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Filter out the item to be removed
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.json({ message: "Item removed from cart!", cart: user.cart });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    res.status(500).json({ message: "Error removing from cart" });
  }
});

// ==============================
// DELETE /api/cart/clear
// Clears entire cart (called after order is placed)
// ==============================
router.delete("/clear", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = []; // Empty the cart
    await user.save();
    res.json({ message: "Cart cleared!" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
