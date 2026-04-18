// ==============================
// src/pages/admin/AdminProductForm.jsx
// Form to Create or Edit a Product
// ==============================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AdminProductForm = () => {
  const { id } = useParams(); // If id exists, we are editing. Otherwise creating.
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "Footwear",
    stock: 100,
    description: "",
    emoji: "🛍️",
    image: "", // new image upload fields
    brand: "Shree Ram General Store",
    cardColor: "#1a1a2e",
    featured: false,
    isNewArrival: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Footwear", "Stationery", "Cosmetics", "Beauty Products",
    "Plastic Products", "Home Products", "Animal Food", "Cleaning Supplies", "Patanjali Items"
  ];

  useEffect(() => {
    // If we have an ID, fetch existing product data
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!res.ok) throw new Error("Product not found");
          const data = await res.json();
          setFormData({
            name: data.name,
            price: data.price,
            originalPrice: data.originalPrice || 0,
            category: data.category,
            stock: data.stock,
            description: data.description,
            emoji: data.emoji,
            image: data.image || "",
            brand: data.brand,
            cardColor: data.cardColor,
            featured: data.featured || false,
            isNewArrival: data.isNewArrival || false,
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = id
        ? `http://localhost:5000/api/products/${id}`
        : `http://localhost:5000/api/products`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Go back to product list
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <button onClick={() => navigate("/admin/products")} className="btn-primary" style={{ background: "#4b5563", marginBottom: "20px" }}>
        Go Back
      </button>

      <h2>{id ? "Edit Product" : "Create Product"}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", marginTop: "20px" }}>
        {error && <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Original Price (₹)</label>
            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
            {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: "10px", maxHeight: "100px", borderRadius: "5px" }} />}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Emoji Icon (Fallback)</label>
            <input type="text" name="emoji" value={formData.emoji} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Card Color (Hex)</label>
            <input type="text" name="cardColor" value={formData.cardColor} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "15px", background: "#1f2937", padding: "15px", borderRadius: "5px", border: "1px solid #374151" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} id="featured" style={{ width: "auto", height: "auto", margin: 0, cursor: "pointer", transform: "scale(1.3)" }} />
            <label htmlFor="featured" style={{ margin: 0, cursor: "pointer", userSelect: "none" }}>Featured Product</label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} id="isNewArrival" style={{ width: "auto", height: "auto", margin: 0, cursor: "pointer", transform: "scale(1.3)" }} />
            <label htmlFor="isNewArrival" style={{ margin: 0, cursor: "pointer", userSelect: "none" }}>New Arrival</label>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #374151", background: "#1f2937", color: "white" }}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : (id ? "Update Product" : "Create Product")}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
