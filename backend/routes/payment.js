// ==============================
// routes/payment.js
// Handles Razorpay payment gateway integration
// ==============================

const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");

// Initialize Razorpay Instance (using placeholders if env variables are missing)
// In a real app, you MUST provide these in .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

// ==============================
// POST /api/payment/create-order
// Creates a Razorpay order before frontend opens checkout
// Body: { amount }  (Amount in INR)
// ==============================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise (multiply INR by 100)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create payment order error:", error.message);
    res.status(500).json({ message: "Error creating payment order", error: error.message });
  }
});

// ==============================
// POST /api/payment/verify
// Verifies the Razorpay payment signature
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// ==============================
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "secret_placeholder";

    // Create the expected signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const expectedSignature = hmac.digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature, payment verification failed" });
    }
  } catch (error) {
    console.error("Verify payment error:", error.message);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router;
