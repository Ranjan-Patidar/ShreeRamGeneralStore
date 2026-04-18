// ==============================
// src/pages/OrderHistory.jsx
// Shows all previous orders placed by the logged-in user
// ==============================

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Status → color mapping for order badges
const STATUS_COLORS = {
  Processing: "#f59e0b",
  Confirmed: "#3b82f6",
  Shipped: "#8b5cf6",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

const PAYMENT_STATUS_COLORS = {
  Pending: "#f59e0b",
  Paid: "#10b981",
  Failed: "#ef4444",
};

const OrderHistory = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded order ID (clicking an order shows its details)
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Check if user just placed an order (comes from Checkout redirect)
  const justOrdered = location.state?.success;
  const newOrder = location.state?.newOrder;

  // Fetch orders from backend
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/my");
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  // Format date nicely (e.g. "17 Apr 2024, 10:30 PM")
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">🔑</span>
        <h2>Login to view your orders</h2>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* ---- Success Banner (shown right after placing an order) ---- */}
      {justOrdered && (
        <div className="order-success-banner">
          <span>🎉</span>
          <div>
            <h3>Order Placed Successfully!</h3>
            <p>We'll process your order shortly. Thank you for shopping with Shree Ram General Store! 🙏</p>
          </div>
        </div>
      )}

      <div className="orders-header">
        <h1>📦 My Orders</h1>
        <p className="orders-count">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      {/* ---- Empty State ---- */}
      {orders.length === 0 ? (
        <div className="empty-page">
          <span className="empty-emoji">📦</span>
          <h2>No orders yet!</h2>
          <p>You haven't placed any orders. Start shopping to see them here.</p>
          <Link to="/products" className="btn-primary">Start Shopping →</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">

              {/* ---- Order Card Header ---- */}
              <div
                className="order-card-header"
                onClick={() => setExpandedOrder(
                  expandedOrder === order._id ? null : order._id
                )}
              >
                <div className="order-id-section">
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>

                <div className="order-badges">
                  {/* Order status badge */}
                  <span
                    className="status-badge"
                    style={{ background: STATUS_COLORS[order.orderStatus] + "22", color: STATUS_COLORS[order.orderStatus] }}
                  >
                    {order.orderStatus}
                  </span>

                  {/* Payment status badge */}
                  <span
                    className="status-badge"
                    style={{ background: PAYMENT_STATUS_COLORS[order.paymentStatus] + "22", color: PAYMENT_STATUS_COLORS[order.paymentStatus] }}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="order-total-section">
                  <span className="order-total">₹{order.totalAmount.toLocaleString()}</span>
                  <span className="order-items-count">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                </div>

                <span className="expand-arrow">{expandedOrder === order._id ? "▲" : "▼"}</span>
              </div>

              {/* ---- Expanded Order Details ---- */}
              {expandedOrder === order._id && (
                <div className="order-card-body">

                  {/* Items list */}
                  <div className="order-items-section">
                    <h4>Ordered Items</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span className="order-item-emoji">
                          {item.product?.emoji || "📦"}
                        </span>
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <small>Qty: {item.quantity} × ₹{item.price}</small>
                        </div>
                        <span className="order-item-subtotal">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  <div className="order-address-section">
                    <h4>📍 Delivery Address</h4>
                    <p>
                      {order.shippingAddress?.name} | {order.shippingAddress?.phone}<br />
                      {order.shippingAddress?.street}, {order.shippingAddress?.city},
                      {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  {/* Payment method */}
                  <div className="order-payment-section">
                    <h4>💳 Payment</h4>
                    <p>{order.paymentMethod} — {order.paymentStatus}</p>
                  </div>

                  {/* Progress tracker */}
                  <div className="order-progress">
                    <h4>Order Progress</h4>
                    <div className="progress-steps">
                      {["Processing", "Confirmed", "Shipped", "Delivered"].map((s, i) => {
                        const statuses = ["Processing", "Confirmed", "Shipped", "Delivered"];
                        const currentIndex = statuses.indexOf(order.orderStatus);
                        const isDone = i <= currentIndex && order.orderStatus !== "Cancelled";
                        return (
                          <div key={s} className={`progress-step ${isDone ? "progress-done" : ""}`}>
                            <div className="progress-dot"></div>
                            <span>{s}</span>
                            {i < 3 && <div className={`progress-line ${isDone && i < currentIndex ? "progress-line-done" : ""}`}></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
