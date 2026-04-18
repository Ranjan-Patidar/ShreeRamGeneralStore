// ==============================
// src/pages/Login.jsx
// Login page — user enters email & password
// On success → redirects to home page
// ==============================

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyShopBg from "../assets/MyShop3.jpeg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form field values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Where to redirect after login (default: home)
  const from = location.state?.from || "/";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError(""); // clear any previous error
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true }); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
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

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🛕</div>
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Login to your Shree Ram General Store account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Toggle password visibility */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner">Logging in...</span>
            ) : (
              "🔑 Login to Store"
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
