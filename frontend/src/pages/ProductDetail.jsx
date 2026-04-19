// ==============================
// src/pages/ProductDetail.jsx
// Full product detail page
// Shows large image, description, reviews rating, add to cart / wishlist
// ==============================

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams(); // product ID from URL  /product/:id
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart, isInCart } = useCart();

  // Product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI states
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState("");

  // Show brief toast message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Product not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check wishlist status for this product
  useEffect(() => {
    if (!isLoggedIn || !product) return;
    const checkWishlist = async () => {
      try {
        const { data } = await API.get("/wishlist");
        setIsWishlisted(data.some((p) => p._id === product._id));
      } catch (e) { }
    };
    checkWishlist();
  }, [isLoggedIn, product]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    setAddingToCart(false);
    showToast(result.success ? "✅ Added to cart!" : result.message);
  };

  // Handle Wishlist toggle
  const handleWishlist = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const { data } = await API.post("/wishlist/toggle", { productId: product._id });
      setIsWishlisted(data.wishlisted);
      showToast(data.message);
    } catch (e) {
      showToast("Error updating wishlist");
    }
  };

  // Buy now — add to cart then go to cart
  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    await addToCart(product._id, quantity);
    navigate("/cart");
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < Math.round(rating) ? "#FFD700" : "#444", fontSize: "1.3rem" }}>
        ★
      </span>
    ));
  };

  // Discount %
  const discount =
    product?.originalPrice > product?.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner"></div>
      <p>Loading product...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <span>❌</span> <p>{error}</p>
      <Link to="/products" className="btn-primary">← Back to Products</Link>
    </div>
  );

  return (
    <div className="detail-page">
      {/* Toast */}
      {toast && <div className="page-toast">{toast}</div>}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> {" > "}
        <Link to="/products">Products</Link> {" > "}
        <Link to={`/products?category=${product.category}`}>{product.category}</Link> {" > "}
        <span>{product.name}</span>
      </div>

      <div className="detail-container">
        {/* ---- Left: Product Visual ---- */}
        <div className="detail-visual">
          {product.image && (product.image.startsWith("http") || product.image.startsWith("data:image")) ? (
            <img
              src={product.image}
              alt={product.name}
              className="detail-product-image"
            />
          ) : (
            <span className="detail-emoji">{product.emoji}</span>
          )}
          {discount > 0 && (
            <div className="detail-discount-badge">-{discount}% OFF</div>
          )}
        </div>

        {/* ---- Right: Product Info ---- */}
        <div className="detail-info">
          {/* Category tag */}
          <span className="detail-category">{product.category}</span>

          {/* Product Name */}
          <h1 className="detail-name">{product.name}</h1>

          {/* Brand */}
          <p className="detail-brand">Brand: <strong>{product.brand}</strong></p>

          {/* Rating */}
          <div className="detail-rating">
            <div className="stars-row">{renderStars(product.rating)}</div>
            <span className="rating-text">{product.rating} / 5</span>
            <span className="review-count">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="detail-price-section">
            <span className="detail-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="detail-original-price">₹{product.originalPrice}</span>
                <span className="detail-savings">
                  You save ₹{product.originalPrice - product.price}!
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="detail-description">
            <h3>About this product</h3>
            <p>{product.description}</p>
          </div>

          {/* Stock */}
          <div className={`detail-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0
              ? `✅ In Stock (${product.stock} units available)`
              : "❌ Out of Stock"}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="quantity-selector">
              <span className="qty-label">Quantity:</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >−</button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >+</button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-actions">
            <button
              className={`btn-wishlist-detail ${isWishlisted ? "wishlisted" : ""}`}
              onClick={handleWishlist}
            >
              {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
            </button>

            <button
              className="btn-add-cart-detail"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              {addingToCart ? "Adding..." : isInCart(product._id) ? "✅ In Cart" : "🛒 Add to Cart"}
            </button>

            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Feature pills */}
          <div className="detail-features">
            <span className="feature-pill">🚚 Fast Delivery</span>
            <span className="feature-pill">🔄 7-Day Return</span>
            <span className="feature-pill">✅ Genuine Product</span>
            <span className="feature-pill">🔒 Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
