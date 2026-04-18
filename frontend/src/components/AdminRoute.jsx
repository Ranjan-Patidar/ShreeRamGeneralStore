// ==============================
// src/components/AdminRoute.jsx
// Protects routes that only admins should access
// ==============================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();

  // If auth state is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="empty-page" style={{ minHeight: "60vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // If not logged in or not an admin, redirect to home
  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the requested component
  return children;
};

export default AdminRoute;
