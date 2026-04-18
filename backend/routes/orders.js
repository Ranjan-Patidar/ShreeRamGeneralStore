// ==============================
// routes/orders.js
// Handles placing orders and fetching order history
// ==============================

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ==============================
// POST /api/orders/place
// Places a new order from the user's cart
// Body: { items, shippingAddress, paymentMethod, totalAmount }
// ==============================
router.post("/place", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Validate that items exist
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Create the order in MongoDB
    const order = await Order.create({
      user: req.user._id,       // link order to the logged-in user
      items,                    // list of products with qty and price
      shippingAddress,          // delivery address
      paymentMethod,            // COD, UPI, Card, etc.
      totalAmount,              // total order value
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Processing",
    });

    // Clear the user's cart after placing the order
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "🎉 Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).json({ message: "Error placing order" });
  }
});

// ==============================
// GET /api/orders/my
// Returns all orders placed by the logged-in user
// Most recent orders appear first
// ==============================
router.get("/my", protect, async (req, res) => {
  try {
    // Find all orders for this user, sorted by newest first
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // -1 = descending (newest first)
      .populate("items.product", "name image emoji"); // get product details

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ==============================
// GET /api/orders/:id
// Returns details of a single order
// ==============================
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name image emoji category"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure the order belongs to the requesting user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    res.status(500).json({ message: "Error fetching order" });
  }
});

// ==============================
// Admin Routes
// ==============================
const { admin } = require("../middleware/authMiddleware");

// GET /api/orders
// Returns all orders in the store
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name image emoji");
    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

// PUT /api/orders/:id/status
// Updates the status of an order
// Body: { orderStatus }
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error.message);
    res.status(500).json({ message: "Error updating order status" });
  }
});

module.exports = router;
