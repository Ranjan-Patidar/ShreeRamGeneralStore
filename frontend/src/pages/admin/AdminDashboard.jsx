// ==============================
// src/pages/admin/AdminDashboard.jsx
// Admin Dashboard to link to other admin pages
// ==============================

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "10px" }}>Admin Dashboard</h1>
      <p style={{ color: "#a0a4d9", marginBottom: "40px" }}>Welcome back, {user?.name}!</p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* Products Card */}
        <div style={{
          backgroundColor: "#111827",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #374151",
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "40px", marginBottom: "15px" }}>🛍️</span>
          <h2 style={{ marginBottom: "15px" }}>Product Management</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            Add, update, or remove products from the store.
          </p>
          <Link to="/admin/products" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>
            Manage Products
          </Link>
        </div>

        {/* Orders Card */}
        <div style={{
          backgroundColor: "#111827",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #374151",
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "40px", marginBottom: "15px" }}>📦</span>
          <h2 style={{ marginBottom: "15px" }}>Order Management</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            View customer orders and update delivery status.
          </p>
          <Link to="/admin/orders" className="btn-primary" style={{ width: "100%", textAlign: "center", background: "#f59e0b" }}>
            Manage Orders
          </Link>
        </div>

        {/* Users Card */}
        <div style={{
          backgroundColor: "#111827",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #374151",
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "40px", marginBottom: "15px" }}>👥</span>
          <h2 style={{ marginBottom: "15px" }}>User Management</h2>
          <p style={{ color: "#9ca3af", marginBottom: "25px" }}>
            View all registered users and their details.
          </p>
          <Link to="/admin/users" className="btn-primary" style={{ width: "100%", textAlign: "center", background: "#3b82f6" }}>
            View Users
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
