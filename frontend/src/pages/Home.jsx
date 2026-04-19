// ==============================
// src/pages/Home.jsx
// Landing page of the ShreeRam Store
// Shows: Hero banner, Category cards, Featured products, Why choose us
// ==============================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import MyShopBg from "../assets/MyShop7.png";
import { useTheme } from "../context/ThemeContext";

// All 8 product categories with their icons and colors
const CATEGORIES = [
  { name: "Footwear", emoji: "👟", color: "#3d1a6e", desc: "Slippers, Sandals, Shoes" },
  { name: "Stationery", emoji: "✏️", color: "#0d3b6e", desc: "Pens, Notebooks, Pencils" },
  { name: "Cosmetics", emoji: "💄", color: "#6e0d2a", desc: "Lipstick, Foundation, Kajal" },
  { name: "Beauty Products", emoji: "🌸", color: "#0d5c2e", desc: "Face Wash, Shampoo, Lotion" },
  { name: "Plastic Products", emoji: "🪣", color: "#2a4a0d", desc: "Buckets, Mugs, Bottles" },
  { name: "Home Products", emoji: "🧹", color: "#5c3a00", desc: "Broom, Mop, Scrubbers" },
  { name: "Animal Food", emoji: "🐄", color: "#3a3a00", desc: "Cotton Seed Cake, Cattle Feed" },
  { name: "Cleaning Supplies", emoji: "🫧", color: "#003a5c", desc: "Detergent, Phenyl, Cleaner" },
  { name: "Patanjali Items", emoji: "🌿", color: "#2E8B57", desc: "Ayurvedic products, Stationary, Healthcare" },
];

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  // Fetch featured products from backend on page load
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get("/products/featured");
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Could not load featured products:", err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    const fetchNewArrivals = async () => {
      try {
        const { data } = await API.get("/products/new-arrivals");
        setNewArrivals(data);
      } catch (err) {
        console.error("Could not load new arrivals:", err.message);
      } finally {
        setLoadingNewArrivals(false);
      }
    };

    fetchFeatured();
    fetchNewArrivals();
  }, []);

  // Handle hero search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: theme === "dark"
          ? `linear-gradient(rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 0.85)), url(${MyShopBg})`
          : `linear-gradient(rgba(240, 240, 255, 0.35), rgba(240, 240, 255, 0.75)), url(${MyShopBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        // minHeight: "100vh"
      }}
    >

      {/* ==================== HERO SECTION ==================== */}
      <section className="hero-section" style={{ background: "transparent" }}>
        {/* Animated particles background */}
        <div className="hero-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span>🛕</span> India's Trusted General Store
          </div>

          {/* Main heading */}
          <h1 className="hero-title">
            Welcome to <br />
            <span className="hero-brand">Shree Ram General Store</span>
          </h1>

          <p className="hero-subtitle">
            Everything you need — from <strong>footwear</strong> to <strong>animal food</strong>,
            <strong> cosmetics</strong> to <strong>cleaning supplies</strong>. Shop smart, shop local! 🙏
          </p>

          {/* Search bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon-left">🔍</span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search products... (e.g. broom, pen, lipstick)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <Link to="/products" className="btn-primary btn-glow">
              🛍️ Shop Now
            </Link>
            <Link to="/register" className="btn-outline">
              ✨ Join Free
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">60+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">9+</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Genuine</span>
            </div>
          </div>
        </div>

        {/* Hero floating product emojis */}
        <div className="hero-visual">
          <div className="floating-card fc-1">👟<br /><small>Footwear</small></div>
          <div className="floating-card fc-2">💄<br /><small>Cosmetics</small></div>
          <div className="floating-card fc-3">🧹<br /><small>Home</small></div>
          <div className="floating-card fc-4">🐄<br /><small>Animal Food</small></div>
          <div className="floating-card fc-5">✏️<br /><small>Stationery</small></div>
          <div className="floating-card fc-6">🫧<br /><small>Cleaning</small></div>
        </div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of products across 8 categories</p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{
                  "--cat-color": cat.color,
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Products</h2>
            <p className="section-subtitle">Our most popular picks — best quality at the best price</p>
          </div>

          {loadingProducts ? (
            // Skeleton loading placeholders
            <div className="products-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton-emoji"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistIds={wishlistIds}
                />
              ))}
            </div>
          ) : (
            // No products — show seed button
            <div className="empty-state">
              <span className="empty-emoji">📦</span>
              <h3>No products yet!</h3>
              <p>Click the button below to seed sample products into your store.</p>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    const { data } = await API.post("/products/seed");
                    alert(data.message);
                    window.location.reload();
                  } catch (e) {
                    alert("Seed failed: " + e.message);
                  }
                }}
              >
                🌱 Seed Sample Products
              </button>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="view-all-wrapper">
              <Link to="/products" className="btn-outline btn-large">
                View All Products →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== NEW ARRIVALS ==================== */}
      <section className="featured-section" style={{ backgroundColor: "transparent" }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">✨ New Arrivals</h2>
            <p className="section-subtitle">Fresh stock just added to our store!</p>
          </div>

          {loadingNewArrivals ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={`new-skeleton-${i}`} className="product-card-skeleton">
                  <div className="skeleton-emoji"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistIds={wishlistIds}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: "auto", padding: "40px" }}>
              <p>No new arrivals at the moment.</p>
            </div>
          )}

          {newArrivals.length > 0 && (
            <div className="view-all-wrapper">
              <Link to="/products?isNewArrival=true" className="btn-outline btn-large">
                Shop New Arrivals →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="why-section">
        <div className="section-container">
          <h2 className="section-title">Why Shree Ram General Store? 🙏</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">✅</span>
              <h3>100% Genuine Products</h3>
              <p>All products are sourced directly from trusted manufacturers and brands.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">⚡</span>
              <h3>Fast Delivery</h3>
              <p>Quick delivery to your doorstep. Same-day delivery available in select areas.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">💰</span>
              <h3>Best Prices</h3>
              <p>We keep our prices low so you can shop more for less. Big discounts daily!</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🔒</span>
              <h3>Secure Payments</h3>
              <p>Multiple payment options including COD, UPI, Card, and Net Banking.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🔄</span>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return within 7 days. No questions asked policy.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📞</span>
              <h3>24/7 Support</h3>
              <p>Our friendly support team is always available to help you out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BANNER / CTA STRIP ==================== */}
      <section className="cta-strip">
        <div className="cta-strip-content">
          <h2>🎉 Special Offer This Week!</h2>
          <p>Get 10% off on orders above ₹500. Use code: <strong>SHRIRAM10</strong></p>
          <Link to="/products" className="btn-primary">Shop Now →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
