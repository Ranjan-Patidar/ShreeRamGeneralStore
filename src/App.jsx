// ==============================
// src/App.jsx
// Root application component
// Sets up React Router — defines all page routes
// ==============================

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout components (shown on every page)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Route guard for logged-in-only pages
import ProtectedRoute from "./components/ProtectedRoute";

// All pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";

// Global CSS
import "./index.css";

// ---- 404 Page (simple inline component) ----
const NotFound = () => (
  <div className="empty-page" style={{ minHeight: "60vh" }}>
    <span className="empty-emoji">🔍</span>
    <h2>404 — Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" className="btn-primary">Go Home →</a>
  </div>
);

function App() {
  return (
    // BrowserRouter enables URL-based navigation
    <BrowserRouter>
      {/* AuthProvider: makes user/login/logout available to all components */}
      <AuthProvider>
        {/* CartProvider: makes cart available to all components */}
        <CartProvider>

          {/* Navbar is shown on ALL pages */}
          <Navbar />

          {/* Main content area — changes based on current URL */}
          <main className="main-content">
            <Routes>
              {/* ---- Public Routes (anyone can visit) ---- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* ---- Protected Routes (login required) ---- */}
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><Wishlist /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrderHistory /></ProtectedRoute>
              } />

              {/* ---- 404 Fallback ---- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer is shown on ALL pages */}
          <Footer />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
