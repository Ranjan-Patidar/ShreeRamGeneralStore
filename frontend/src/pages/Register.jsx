// ==============================
// src/pages/Register.jsx
// Registration page — new user creates an account
// On success → auto-logs in and redirects to home
// ==============================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyShopBg from "../assets/MyShop3.jpeg";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation: passwords must match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validation: minimum password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password, phone);
      setSuccess(result.message || "Account created! Redirecting...");
      setTimeout(() => navigate("/"), 1500); // redirect after 1.5s
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.55), rgba(17, 24, 39, 0.9)), url(${MyShopBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}
    >

      <div className="auth-card auth-card-wide">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🎉</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Shree Ram General Store — your local general store, online!</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="auth-success">
            <span>✅</span> {success}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {/* Two-column row: Name + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address *</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">Confirm Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "✨ Create My Account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
