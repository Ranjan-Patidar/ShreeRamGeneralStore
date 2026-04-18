// ==============================
// models/User.js
// Defines the User model for MongoDB
// Stores user info, hashed password, cart, and wishlist
// ==============================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ---- Cart Item Sub-Schema ----
// Each cart item stores a reference to a Product and a quantity
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

// ---- Main User Schema ----
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Email (must be unique — used to login)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password stored here (never plain text!)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // Optional phone number
    phone: {
      type: String,
      default: "",
    },

    // Delivery address fields
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    // User role: 'user' or 'admin'
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Shopping cart: array of { product, quantity }
    cart: [cartItemSchema],

    // Wishlist: array of Product IDs the user has liked
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ==============================
// MIDDLEWARE: Hash password before saving
// Runs automatically before every save()
// ==============================
userSchema.pre("save", async function () {
  // Only hash if password has been changed
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==============================
// METHOD: Compare entered password with stored hash
// ==============================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
