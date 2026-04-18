// ==============================
// src/context/AuthContext.jsx
// Global Authentication State
// Provides user data to any component in the app using React Context
// How it works:
//   - Wrap the app with <AuthProvider>
//   - Any component can call useAuth() to get user/login/logout
// ==============================

import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

// Create the Auth Context (like a global store for auth data)
const AuthContext = createContext();

// ==============================
// AuthProvider Component
// Wraps the entire app so all children can access auth state
// ==============================
export const AuthProvider = ({ children }) => {
  // user: currently logged-in user object, or null if not logged in
  const [user, setUser] = useState(null);

  // loading: true while checking if user is already logged in
  const [loading, setLoading] = useState(true);

  // ==============================
  // On first load: Check if user was already logged in
  // We check localStorage for saved user data
  // ==============================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      // Restore user session from localStorage
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // done checking
  }, []);

  // ==============================
  // login(email, password)
  // Calls the backend login API
  // On success: saves token + user to localStorage and state
  // ==============================
  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });

    const { token, user } = response.data;

    // Save to localStorage so user stays logged in after page refresh
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Update state
    setUser(user);

    return response.data;
  };

  // ==============================
  // register(name, email, password, phone)
  // Calls the backend register API
  // On success: auto-logs in the user
  // ==============================
  const register = async (name, email, password, phone) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });

    const { token, user } = response.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return response.data;
  };

  // ==============================
  // logout()
  // Clears all saved data and redirects user
  // ==============================
  const logout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setUser(null);
  };

  // These values will be available to ALL components
  const value = {
    user,        // current user or null
    loading,     // is auth being initialized?
    login,       // function to log in
    register,    // function to register
    logout,      // function to log out
    isLoggedIn: !!user, // boolean: is user logged in?
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we know if user is logged in */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ==============================
// useAuth() Hook
// Custom hook to access auth context from any component
// Usage: const { user, login, logout } = useAuth();
// ==============================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
