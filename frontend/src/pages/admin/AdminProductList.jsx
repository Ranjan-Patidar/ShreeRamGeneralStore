// ==============================
// src/pages/admin/AdminProductList.jsx
// Displays all products for Admin
// ==============================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message || "Failed to delete");
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: "40px" }}><h2>Loading products...</h2></div>;
  if (error) return <div className="container" style={{ padding: "40px" }}><h2 style={{ color: "red" }}>{error}</h2></div>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary" style={{ background: "#10b981", border: "none" }}>
          + Create Product
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#1f2937", borderBottom: "1px solid #374151" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>NAME</th>
              <th style={{ padding: "12px" }}>PRICE</th>
              <th style={{ padding: "12px" }}>CATEGORY</th>
              <th style={{ padding: "12px" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "12px", color: "#9ca3af", fontSize: "14px" }}>{product._id.substring(0, 8)}...</td>
                <td style={{ padding: "12px" }}>{product.emoji} {product.name}</td>
                <td style={{ padding: "12px" }}>₹{product.price}</td>
                <td style={{ padding: "12px" }}>{product.category}</td>
                <td style={{ padding: "12px" }}>
                  <Link to={`/admin/products/edit/${product._id}`} style={{ marginRight: "10px", color: "#60a5fa", textDecoration: "none" }}>Edit</Link>
                  <button 
                    onClick={() => deleteHandler(product._id)}
                    style={{ background: "transparent", color: "#f87171", border: "none", cursor: "pointer", fontSize: "16px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
