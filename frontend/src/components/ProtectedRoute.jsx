// ==============================
// src/components/ProtectedRoute.jsx
// Guards pages that require login
// If user is not logged in → redirect to /login
// ==============================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // If not logged in, send user to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the requested page
  return children;
};

export default ProtectedRoute;
