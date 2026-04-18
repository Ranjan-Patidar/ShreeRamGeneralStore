// ==============================
// models/Order.js
// Defines the Order model for MongoDB
// Stores each order placed by a user
// ==============================

const mongoose = require("mongoose");

// Sub-schema for each product inside an order
// An order can have multiple items (like a cart)
const orderItemSchema = new mongoose.Schema({
  // Reference to the product that was ordered
  product: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ID of the product
    ref: "Product", // Links to the Product model
    required: true,
  },

  // Name of product at time of order (in case product is deleted later)
  name: { type: String, required: true },

  // Image URL at time of order
  image: { type: String },

  // Price per unit at time of order
  price: { type: Number, required: true },

  // How many units were ordered
  quantity: { type: Number, required: true, min: 1 },
});

// Main Order schema
const orderSchema = new mongoose.Schema(
  {
    // Which user placed this order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // List of items in this order
    items: [orderItemSchema],

    // Delivery address (copied from user at time of order)
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Total cost of the order (in rupees)
    totalAmount: {
      type: Number,
      required: true,
    },

    // Payment method chosen by user
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking"], // allowed methods
      default: "COD",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // Order status (tracks delivery progress)
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);

// Export the Order model
module.exports = mongoose.model("Order", orderSchema);
