// ==============================
// src/components/ProductCard.jsx
// Reusable card component displayed in product grid
// Shows: image/emoji, name, price, rating, add to cart, wishlist
// ==============================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

const ProductCard = ({ product, wishlistIds = [], onWishlistToggle }) => {
  const { isLoggedIn } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  // Is this product in the user's wishlist?
  const [isWishlisted, setIsWishlisted] = useState(
    wishlistIds.includes(product._id)
  );

  // Loading states for button actions
  const [addingToCart, setAddingToCart] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Show a quick toast notification
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // ---- Handle: Add to Cart ----
  const handleAddToCart = async (e) => {
    e.preventDefault(); // prevent Link navigation

    if (!isLoggedIn) {
      navigate("/login"); // redirect to login if not logged in
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    setAddingToCart(false);

    if (result.success) {
      showToast("✅ Added to cart!");
    } else {
      showToast(result.message || "Failed to add");
    }
  };

  // ---- Handle: Toggle Wishlist ----
  const handleWishlist = async (e) => {
    e.preventDefault(); // prevent Link navigation

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await API.post("/wishlist/toggle", {
        productId: product._id,
      });
      setIsWishlisted(data.wishlisted); // update UI immediately
      showToast(data.message);
      if (onWishlistToggle) onWishlistToggle(product._id, data.wishlisted);
    } catch (error) {
      showToast("Error updating wishlist");
    }
  };

  // Calculate discount percentage
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Generate star rating display
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <div className="product-card" style={{ "--card-color": product.cardColor }}>

      {/* Toast notification */}
      {toastMsg && <div className="card-toast">{toastMsg}</div>}

      {/* Discount badge */}
      {discount > 0 && (
        <div className="discount-badge">-{discount}%</div>
      )}

      {/* Wishlist Heart button */}
      <button
        className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Product Image / Emoji — clicking goes to product detail page */}
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-emoji-container">
          {(product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))) ? (
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }} />
          ) : (
            <span className="product-emoji">{product.emoji}</span>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          {/* Category tag */}
          <span className="product-category-tag">{product.category}</span>

          {/* Product name */}
          <h3 className="product-name">{product.name}</h3>

          {/* Brand */}
          <p className="product-brand">by {product.brand}</p>

          {/* Rating */}
          <div className="product-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="rating-count">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="product-price-row">
            <span className="product-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="product-original-price">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Stock status */}
          <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0 ? `✅ In Stock (${product.stock})` : "❌ Out of Stock"}
          </span>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        className={`add-to-cart-btn ${isInCart(product._id) ? "in-cart" : ""}`}
        onClick={handleAddToCart}
        disabled={addingToCart || product.stock === 0}
      >
        {addingToCart ? (
          <span className="btn-loading">Adding...</span>
        ) : isInCart(product._id) ? (
          "✅ In Cart"
        ) : (
          "🛒 Add to Cart"
        )}
      </button>
    </div>
  );
};

export default ProductCard;
