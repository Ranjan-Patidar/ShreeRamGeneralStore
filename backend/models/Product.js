// ==============================
// models/Product.js
// Defines the Product model for MongoDB
// Stores all product information including category, price, stock, etc.
// ==============================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Product name (e.g., "Blue Ballpoint Pen")
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // Category of the product — one of 8 predefined types
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Footwear",
        "Stationery",
        "Cosmetics",
        "Beauty Products",
        "Plastic Products",
        "Home Products",
        "Animal Food",
        "Cleaning Supplies",
        "Patanjali Items",
      ],
    },

    // Price in Indian Rupees (₹)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    // Original price before discount (used to show discount %)
    originalPrice: {
      type: Number,
      default: 0,
    },

    // Short description of the product
    description: {
      type: String,
      default: "",
    },

    // URL to the product image (emoji or external URL)
    image: {
      type: String,
      default: "",
    },

    // Emoji icon for the category/product (used in UI)
    emoji: {
      type: String,
      default: "🛍️",
    },

    // Brand or manufacturer name
    brand: {
      type: String,
      default: "ShreeRam Brand",
    },

    // How many units are in stock
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    // Average rating (1 to 5 stars)
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },

    // Number of reviews
    numReviews: {
      type: Number,
      default: 0,
    },

    // Is this product featured/highlighted on home page?
    featured: {
      type: Boolean,
      default: false,
    },

    // Is this product a New Arrival?
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // Background color for product card (CSS color string)
    cardColor: {
      type: String,
      default: "#1a1a2e",
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Export the Product model
module.exports = mongoose.model("Product", productSchema);