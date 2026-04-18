// ==============================
// src/pages/Cart.jsx
// Shopping cart page
// Shows all cart items with qty controls, total, and checkout button
// ==============================

import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, cartLoading, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // If not logged in, show message
  if (!isLoggedIn) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">🔑</span>
        <h2>Please login to view your cart</h2>
        <p>You need an account to add items and checkout.</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  // Loading state
  if (cartLoading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">🛒</span>
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added anything yet. Let's change that!</p>
        <Link to="/products" className="btn-primary">Start Shopping →</Link>
      </div>
    );
  }

  // Delivery charge logic
  const deliveryCharge = cartTotal >= 500 ? 0 : 49;
  const grandTotal = cartTotal + deliveryCharge;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 My Cart <span className="cart-count-badge">{cartCount} items</span></h1>
      </div>

      <div className="cart-layout">

        {/* ---- Left: Cart Items ---- */}
        <div className="cart-items">
          {cart.map((item) => {
            // Each item = { product: {...}, quantity: N }
            const product = item.product;
            if (!product) return null;

            return (
              <div key={product._id} className="cart-item">
                {/* Product Emoji/Image */}
                <div
                  className="cart-item-visual"
                  style={{ background: product.cardColor || "#1a1a2e" }}
                >
                  <span className="cart-item-emoji">{product.emoji}</span>
                </div>

                {/* Product Info */}
                <div className="cart-item-info">
                  <span className="cart-item-category">{product.category}</span>
                  <h3 className="cart-item-name">{product.name}</h3>
                  <p className="cart-item-brand">by {product.brand}</p>

                  {/* Price */}
                  <div className="cart-item-price">
                    <span className="item-price">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="item-original">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button
                      className="qty-ctrl-btn"
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      className="qty-ctrl-btn"
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="item-subtotal">
                    ₹{(product.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove button */}
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(product._id)}
                    aria-label="Remove item"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Clear Cart Button */}
          <div className="cart-footer-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              🗑️ Clear Cart
            </button>
            <Link to="/products" className="continue-shopping-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* ---- Right: Order Summary ---- */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartCount} items)</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Charge</span>
            <span className={deliveryCharge === 0 ? "free-delivery" : ""}>
              {deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`}
            </span>
          </div>

          {deliveryCharge > 0 && (
            <p className="delivery-hint">
              Add ₹{500 - cartTotal} more for FREE delivery!
            </p>
          )}

          <div className="summary-divider"></div>

          <div className="summary-total-row">
            <span>Total Amount</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>

          <p className="summary-tax-note">✅ Inclusive of all taxes</p>

          {/* Checkout Button */}
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            ⚡ Proceed to Checkout
          </button>

          {/* Payment icons */}
          <div className="payment-icons">
            <span title="Cash on Delivery">💵 COD</span>
            <span title="UPI">📱 UPI</span>
            <span title="Card">💳 Card</span>
            <span title="Net Banking">🏦 Net Banking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
