// ==============================
// src/components/Footer.jsx
// Bottom footer shown on all pages
// ==============================

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span>🛕</span>
            <span>Shree Ram General Store</span>
          </div>
          <p className="footer-tagline">
            Your trusted general store for everyday needs — from footwear to animal food,
            we have it all! 🙏
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=Footwear">👟 Footwear</Link></li>
            <li><Link to="/products?category=Stationery">✏️ Stationery</Link></li>
            <li><Link to="/products?category=Cosmetics">💄 Cosmetics</Link></li>
            <li><Link to="/products?category=Home Products">🏠 Home Products</Link></li>
            <li><Link to="/products?category=Animal Food">🐄 Animal Food</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-links no-link">
            <li>📍 Main Road, Nandra, Tehsil-Maheshwar</li>
            <li> District-Khargone, Madhya Pradesh</li>
            <li>📞 +91 98264-54042 (Mahendra Patidar)</li>
            <li>📞 +91 96690-69333 (Ganesh Patidar)</li>
            <li>📧 info@shreeramstore.com</li>
            <li>⏰ 7:30AM – 9:30PM</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© 2024 Shree Ram Genearl Store. Made with ❤️ in India 🇮🇳</p>
        <p>All prices are inclusive of taxes.</p>
      </div>
    </footer>
  );
};

export default Footer;
