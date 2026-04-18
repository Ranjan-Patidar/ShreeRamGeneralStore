// ==============================
// src/context/CartContext.jsx
// Global Cart State Management
// Provides cart data and functions to any component in the app
// Uses server-side cart (stored in MongoDB for logged-in users)
// ==============================

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

// Create Cart Context
const CartContext = createContext();

// ==============================
// CartProvider Component
// Wrap the app with this to access cart state everywhere
// ==============================
export const CartProvider = ({ children }) => {
  // cart: array of { product: {...}, quantity: number }
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Get auth state (we need to know if user is logged in)
  const { isLoggedIn } = useAuth();

  // ==============================
  // fetchCart()
  // Gets the cart from the backend
  // Only runs if user is logged in
  // ==============================
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart([]);
      return;
    }

    try {
      setCartLoading(true);
      const { data } = await API.get("/cart");
      setCart(data);
    } catch (error) {
      console.error("Fetch cart error:", error.message);
    } finally {
      setCartLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch cart whenever login state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ==============================
  // addToCart(productId, quantity)
  // Adds a product to cart on the server
  // ==============================
  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post("/cart/add", { productId, quantity });
      setCart(data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error adding to cart" };
    }
  };

  // ==============================
  // updateQuantity(productId, quantity)
  // Updates quantity of an item in cart
  // quantity = 0 removes the item
  // ==============================
  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await API.put("/cart/update", { productId, quantity });
      setCart(data.cart);
    } catch (error) {
      console.error("Update cart error:", error.message);
    }
  };

  // ==============================
  // removeFromCart(productId)
  // Removes a specific item from cart
  // ==============================
  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`);
      // Update local state immediately for better UX
      setCart((prev) => prev.filter((item) => item.product?._id !== productId));
    } catch (error) {
      console.error("Remove from cart error:", error.message);
    }
  };

  // ==============================
  // clearCart()
  // Empties the cart (called after order placement)
  // ==============================
  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error.message);
    }
  };

  // ==============================
  // Computed Values
  // ==============================

  // Total number of items (sum of all quantities)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  // Total price of all items
  const cartTotal = cart.reduce(
    (total, item) => total + ((item.product?.price || 0) * (item.quantity || 0)),
    0
  );

  // Check if a specific product is in the cart
  const isInCart = (productId) =>
    cart.some((item) => item.product?._id === productId);

  // Values available to all components
  const value = {
    cart,
    cartLoading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ==============================
// useCart() Hook
// Access cart data from any component
// Usage: const { cart, addToCart, cartCount } = useCart();
// ==============================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
};
