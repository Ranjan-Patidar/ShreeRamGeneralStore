// ==============================
// src/pages/Wishlist.jsx
// Shows all products the user has liked/wishlisted
// ==============================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const Wishlist = () => {
  const { isLoggedIn } = useAuth();

  // Wishlist products array
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // IDs of wishlisted products (for ProductCard to show heart state)
  const wishlistIds = wishlist.map((p) => p._id);

  // Fetch wishlist from backend on page load
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWishlist = async () => {
      try {
        const { data } = await API.get("/wishlist");
        setWishlist(data);
      } catch (err) {
        console.error("Wishlist fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isLoggedIn]);

  // Called when a product is toggled off the wishlist from ProductCard
  // We remove it from local state immediately (optimistic update)
  const handleWishlistToggle = (productId, isWishlisted) => {
    if (!isWishlisted) {
      // Product was removed — take it off the list
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">🔑</span>
        <h2>Login to see your Wishlist</h2>
        <p>Save products you love and come back to them anytime!</p>
        <Link to="/login" className="btn-primary">Login Now</Link>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  // Empty wishlist
  if (wishlist.length === 0) {
    return (
      <div className="empty-page">
        <span className="empty-emoji">💔</span>
        <h2>Your wishlist is empty!</h2>
        <p>Browse products and tap the ❤️ to save items you love.</p>
        <Link to="/products" className="btn-primary">Explore Products →</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>❤️ My Wishlist</h1>
        <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
      </div>

      {/* Product grid — reuses ProductCard component */}
      <div className="products-grid">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            wishlistIds={wishlistIds}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
