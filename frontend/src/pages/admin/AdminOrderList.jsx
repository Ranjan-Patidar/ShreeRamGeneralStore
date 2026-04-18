// ==============================
// src/pages/admin/AdminOrderList.jsx
// Displays all store orders and allows status updates
// ==============================

import { useState, useEffect } from "react";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://shreeramgeneralstore.onrender.com/api/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://shreeramgeneralstore.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update UI
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="container" style={{ padding: "40px" }}><h2>Loading orders...</h2></div>;
  if (error) return <div className="container" style={{ padding: "40px" }}><h2 style={{ color: "red" }}>{error}</h2></div>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "30px" }}>All Store Orders ({orders.length})</h1>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#1f2937", borderBottom: "1px solid #374151" }}>
              <th style={{ padding: "12px" }}>ORDER ID</th>
              <th style={{ padding: "12px" }}>USER</th>
              <th style={{ padding: "12px" }}>DATE</th>
              <th style={{ padding: "12px" }}>TOTAL</th>
              <th style={{ padding: "12px" }}>PAYMENT</th>
              <th style={{ padding: "12px" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px", color: "#9ca3af", fontSize: "14px" }}>
                  {order._id.substring(0, 8)}...<br/>
                  <small>{order.items.length} items</small>
                </td>
                <td style={{ padding: "12px" }}>
                  {order.user?.name || "Unknown"}<br/>
                  <small style={{ color: "#9ca3af" }}>{order.user?.email || "N/A"}</small>
                </td>
                <td style={{ padding: "12px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px" }}>₹{order.totalAmount}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px",
                    background: order.paymentStatus === "Paid" ? "#065f46" : "#7f1d1d" 
                  }}>
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ 
                      padding: "5px", 
                      borderRadius: "5px", 
                      background: "#374151", 
                      color: "white", 
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;
