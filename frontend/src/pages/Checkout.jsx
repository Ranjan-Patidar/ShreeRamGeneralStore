// ==============================
// src/pages/Checkout.jsx
// Checkout page — user fills shipping address and selects payment
// On submit → places order via API (Razorpay for online payments)
// ==============================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

// Helper to load Razorpay SDK dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pre-fill form from user's saved address
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const deliveryCharge = cartTotal >= 500 ? 0 : 49;
  const grandTotal = cartTotal + deliveryCharge;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!form.name || !form.phone || !form.street || !form.city || !form.pincode) {
      setError("Please fill in all required address fields.");
      return false;
    }
    if (form.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    // If COD, just place order directly
    if (paymentMethod === "COD") {
      await finalizeOrder("COD", "Pending");
      return;
    }

    // Otherwise, initiate Razorpay flow
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const orderRes = await API.post("/payment/create-order", { amount: grandTotal });
      const razorpayOrder = orderRes.data.order;

      // 2. Open Razorpay checkout modal
      const options = {
        key: "rzp_test_placeholder", // Replace with your key in production
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shree Ram General Store",
        description: "Test Transaction",
        image: "https://example.com/logo.png", // Optional logo
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify payment signature on our backend
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              // 4. Place order after successful payment verification
              await finalizeOrder(paymentMethod, "Paid");
            } else {
              setError("Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            setError("Error verifying payment.");
            setLoading(false);
          }
        },
        prefill: {
          name: form.name,
          email: user?.email || "",
          contact: form.phone
        },
        theme: {
          color: "#f59e0b"
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        setError(response.error.description || "Payment Failed");
        setLoading(false);
      });

      paymentObject.open();

    } catch (err) {
      setError("Unable to initiate online payment.");
      setLoading(false);
    }
  };

  // The actual function that hits the /api/orders/place endpoint
  const finalizeOrder = async (method, status) => {
    try {
      const items = cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { data } = await API.post("/orders/place", {
        items,
        shippingAddress: form,
        paymentMethod: method,
        paymentStatus: status,
        totalAmount: grandTotal,
      });

      await clearCart();
      navigate("/orders", { state: { newOrder: data.order, success: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">🛒</span>
        <h2>Your cart is empty!</h2>
        <p>Add items to cart before checking out.</p>
        <Link to="/products" className="btn-primary">Shop Now →</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        {["📍 Address", "💳 Payment", "✅ Review"].map((label, idx) => (
          <div key={idx} className={`step-item ${step >= idx + 1 ? "step-active" : ""} ${step > idx + 1 ? "step-done" : ""}`}>
            <div className="step-circle">{step > idx + 1 ? "✓" : idx + 1}</div>
            <span className="step-label">{label}</span>
            {idx < 2 && <div className={`step-line ${step > idx + 1 ? "line-done" : ""}`}></div>}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-side">
          {step === 1 && (
            <div className="checkout-step-panel">
              <h2>📍 Shipping Address</h2>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Ramesh Kumar" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📱</span>
                    <input name="phone" className="form-input" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} required />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏠</span>
                  <input name="street" className="form-input" value={form.street} onChange={handleChange} placeholder="123, Main Road, Near Temple" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🌆</span>
                    <input name="city" className="form-input" value={form.city} onChange={handleChange} placeholder="Mathura" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🗺️</span>
                    <input name="state" className="form-input" value={form.state} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <div className="input-wrapper">
                  <span className="input-icon">📮</span>
                  <input name="pincode" className="form-input" value={form.pincode} onChange={handleChange} maxLength={6} required />
                </div>
              </div>
              <button className="checkout-next-btn" onClick={handleNextStep}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step-panel">
              <h2>💳 Choose Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: "COD", label: "💵 Cash on Delivery" },
                  { value: "NetBanking", label: "🏦 Online Payment (Razorpay)" },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? "payment-selected" : ""}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} />
                    <div className="payment-option-content">
                      <span className="payment-option-label">{opt.label}</span>
                    </div>
                    {paymentMethod === opt.value && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
              <div className="checkout-step-btns">
                <button className="checkout-back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="checkout-next-btn" onClick={handleNextStep}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-step-panel">
              <h2>✅ Review Your Order</h2>
              <div className="review-section">
                <div className="review-header">
                  <h3>📍 Delivering to</h3>
                  <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                </div>
                <div className="review-address">
                  <strong>{form.name}</strong> | {form.phone}<br />
                  {form.street}, {form.city}, {form.state} — {form.pincode}
                </div>
              </div>
              <div className="review-section">
                <div className="review-header">
                  <h3>💳 Payment</h3>
                  <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                </div>
                <p className="review-payment">{paymentMethod}</p>
              </div>
              {error && <div className="auth-error">⚠️ {error}</div>}
              <div className="checkout-step-btns">
                <button className="checkout-back-btn" onClick={() => setStep(2)}>← Back</button>
                <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? "🕐 Processing..." : `🎉 Place Order — ₹${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="checkout-items-list">
            {cart.map((item) => (
              <div key={item.product._id} className="checkout-item-row">
                <span className="checkout-item-emoji">{item.product.emoji}</span>
                <div className="checkout-item-detail">
                  <span className="checkout-item-name">{item.product.name}</span>
                  <small>x{item.quantity}</small>
                </div>
                <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className={deliveryCharge === 0 ? "free-delivery" : ""}>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total-row">
            <strong>Grand Total</strong>
            <strong>₹{grandTotal.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
