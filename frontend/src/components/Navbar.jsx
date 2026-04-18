// ==============================
// src/components/Navbar.jsx
// Top navigation bar shown on all pages
// Shows: Logo | Nav Links | Cart icon | User menu
// ==============================

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // current page path

  // Controls the mobile hamburger menu open/close
  const [menuOpen, setMenuOpen] = useState(false);
  // Controls the user dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Tracks if user has scrolled (to add shadow to navbar)
  const [scrolled, setScrolled] = useState(false);

  // Add shadow to navbar when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Handle logout click
  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to home after logout
  };

  // Check if a nav link is the current active page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">

        {/* ---- LOGO ---- */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛕</span>
          <span className="logo-text">
            <span className="logo-shree">Shree Ram General Store</span>
            {/* <span className="logo-store"> Store</span> */}
          </span>
        </Link>

        {/* ---- DESKTOP NAV LINKS ---- */}
        <ul className="navbar-links">
          <li>
            <Link to="/" className={isActive("/") ? "nav-link active" : "nav-link"}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive("/products") ? "nav-link active" : "nav-link"}>
              Products
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to="/wishlist" className={isActive("/wishlist") ? "nav-link active" : "nav-link"}>
                  ❤️ Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className={isActive("/orders") ? "nav-link active" : "nav-link"}>
                  📦 Orders
                </Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "nav-link active" : "nav-link"} style={{ color: "#f59e0b" }}>
                    ⚙️ Admin
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>

        {/* ---- RIGHT SIDE: Cart + User ---- */}
        <div className="navbar-actions">

          {/* Cart Icon with item badge */}
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* User section: show dropdown if logged in, else Login/Register */}
          {isLoggedIn ? (
            <div className="user-menu">
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {/* Show first letter of user's name as avatar */}
                <span className="avatar-circle">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="user-name-short">{user?.name?.split(" ")[0]}</span>
                <span className="dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span>👋 Hello, {user?.name?.split(" ")[0]}!</span>
                    <small>{user?.email}</small>
                  </div>
                  {user?.role === "admin" && (
                    <Link to="/admin/dashboard" className="dropdown-item" style={{ color: "#f59e0b" }}>⚙️ Admin Dashboard</Link>
                  )}
                  <Link to="/orders" className="dropdown-item">📦 My Orders</Link>
                  <Link to="/wishlist" className="dropdown-item">❤️ Wishlist</Link>
                  <Link to="/cart" className="dropdown-item">🛒 My Cart</Link>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <Link to="/" className="mobile-link">🏠 Home</Link>
        <Link to="/products" className="mobile-link">🛍️ Products</Link>
        {isLoggedIn ? (
          <>
            <Link to="/wishlist" className="mobile-link">❤️ Wishlist</Link>
            <Link to="/orders" className="mobile-link">📦 My Orders</Link>
            <Link to="/cart" className="mobile-link">🛒 Cart ({cartCount})</Link>
            {user?.role === "admin" && (
              <Link to="/admin/dashboard" className="mobile-link" style={{ color: "#f59e0b" }}>⚙️ Admin</Link>
            )}
            <button onClick={handleLogout} className="mobile-link mobile-logout">🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link">🔑 Login</Link>
            <Link to="/register" className="mobile-link">✨ Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
