// ==============================
// src/pages/Products.jsx
// Product listing page with filters and search
// Shows all products in a responsive grid
// ==============================

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

// Category filter options
const CATEGORIES = [
  "All",
  "Footwear",
  "Stationery",
  "Cosmetics",
  "Beauty Products",
  "Plastic Products",
  "Home Products",
  "Animal Food",
  "Cleaning Supplies",
  "Patanjali Items",
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  // State for products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User's wishlist IDs (so ProductCard knows what's already wishlisted)
  const [wishlistIds, setWishlistIds] = useState([]);

  // Filter/sort states — initialize from URL query params
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isNewArrivalFilter, setIsNewArrivalFilter] = useState(
    searchParams.get("isNewArrival") === "true"
  );
  const [sortBy, setSortBy] = useState("newest");

  // ==============================
  // Fetch products whenever filters change
  // ==============================
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        // Build query string
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.append("category", activeCategory);
        if (searchQuery) params.append("search", searchQuery);
        if (isNewArrivalFilter) params.append("isNewArrival", "true");

        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Is the backend running?");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Also update the URL so user can share filtered links
    const newParams = {};
    if (activeCategory !== "All") newParams.category = activeCategory;
    if (searchQuery) newParams.search = searchQuery;
    if (isNewArrivalFilter) newParams.isNewArrival = "true";
    setSearchParams(newParams);
  }, [activeCategory, searchQuery, isNewArrivalFilter]);

  // Fetch user's wishlist to show heart state on cards
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchWishlist = async () => {
      try {
        const { data } = await API.get("/wishlist");
        setWishlistIds(data.map((p) => p._id));
      } catch (err) {
        console.error("Wishlist fetch error:", err.message);
      }
    };
    fetchWishlist();
  }, [isLoggedIn]);

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0; // newest (default from backend)
  });

  // Handle category tab click
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Called when wishlist is toggled on a card
  const handleWishlistToggle = (productId, isWishlisted) => {
    setWishlistIds((prev) =>
      isWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  return (
    <div className="products-page">

      {/* ---- Page Header ---- */}
      <div className="products-header">
        <h1 className="products-title">
          {activeCategory === "All" ? "🛍️ All Products" : `${activeCategory}`}
        </h1>
        <p className="products-count">
          {loading ? "Loading..." : `${sortedProducts.length} products found`}
        </p>
      </div>

      {/* ---- Search + Sort Bar ---- */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>
        
        {isNewArrivalFilter && (
          <button 
            style={{ padding: "8px 12px", background: "#f59e0b", color: "#000", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginLeft: "10px" }}
            onClick={() => setIsNewArrivalFilter(false)}
          >
            Clear New Arrivals Filter ✕
          </button>
        )}

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* ---- Category Filter Tabs ---- */}
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? "category-tab-active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---- Product Grid ---- */}
      {error ? (
        <div className="error-state">
          <span>❌</span>
          <p>{error}</p>
          <small>Make sure the backend is running on port 5000.</small>
        </div>
      ) : loading ? (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="skeleton-emoji"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">🔍</span>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
          <button
            className="btn-outline"
            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              wishlistIds={wishlistIds}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
