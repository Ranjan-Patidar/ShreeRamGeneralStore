// ==============================
// src/App.jsx
// Root application component
// Sets up React Router — defines all page routes
// ==============================

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

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

// Admin Pages
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrderList from "./pages/admin/AdminOrderList";
import AdminUsersList from "./pages/admin/AdminUsersList";

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
      <ThemeProvider>
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

                {/* ---- Admin Routes (protected + admin only) ---- */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute><AdminProductList /></AdminRoute>
                } />
                <Route path="/admin/products/new" element={
                  <AdminRoute><AdminProductForm /></AdminRoute>
                } />
                <Route path="/admin/products/edit/:id" element={
                  <AdminRoute><AdminProductForm /></AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute><AdminOrderList /></AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute><AdminUsersList /></AdminRoute>
                } />

                {/* ---- 404 Fallback ---- */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer is shown on ALL pages */}
            <Footer />

          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
