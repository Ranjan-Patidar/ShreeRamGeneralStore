// ==============================
// src/pages/admin/AdminUsersList.jsx
// Displays a list of all registered users for the Admin
// ==============================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName, role) => {
    if (role === 'admin') {
      alert("Cannot delete an admin user from here.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to delete user");
        }

        // Remove from local state
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update user");
      }

      const updatedUserRes = await res.json();

      // Update in local state
      setUsers(users.map(u => {
        if (u._id === userId) {
          return {
            ...u,
            name: updatedUserRes.name,
            email: updatedUserRes.email,
            role: updatedUserRes.role
          };
        }
        return u;
      }));

      setEditingUser(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="container" style={{ padding: "40px" }}>Loading users...</div>;
  if (error) return <div className="container" style={{ padding: "40px", color: "red" }}>Error: {error}</div>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <button onClick={() => navigate("/admin/dashboard")} className="btn-primary" style={{ background: "#4b5563", marginBottom: "20px" }}>
        ← Back to Dashboard
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>👥 Registered Users ({users.length})</h2>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#1f2937", borderBottom: "1px solid #374151" }}>
              <th style={{ padding: "12px", border: "1px solid #374151" }}>Name</th>
              <th style={{ padding: "12px", border: "1px solid #374151" }}>Email</th>
              <th style={{ padding: "12px", border: "1px solid #374151" }}>Role</th>
              <th style={{ padding: "12px", border: "1px solid #374151", textAlign: "center" }}>Orders</th>
              <th style={{ padding: "12px", border: "1px solid #374151", textAlign: "right" }}>Spent</th>
              <th style={{ padding: "12px", border: "1px solid #374151" }}>Joined At</th>
              <th style={{ padding: "12px", border: "1px solid #374151", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "12px", textAlign: "center", border: "1px solid #374151" }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{ borderBottom: "1px solid #374151" }}>
                  <td style={{ padding: "12px", border: "1px solid #374151", fontWeight: "bold" }}>
                    {editingUser === user._id ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={editFormData.name} 
                        onChange={handleEditChange} 
                        style={{ width: "100%", padding: "5px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "3px" }}
                      />
                    ) : user.name}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151" }}>
                    {editingUser === user._id ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={editFormData.email} 
                        onChange={handleEditChange} 
                        style={{ width: "100%", padding: "5px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "3px" }}
                      />
                    ) : user.email}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151" }}>
                    {editingUser === user._id ? (
                      <select 
                        name="role" 
                        value={editFormData.role} 
                        onChange={handleEditChange}
                        style={{ width: "100%", padding: "5px", background: "#111827", color: "white", border: "1px solid #374151", borderRadius: "3px" }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        fontSize: "0.85rem",
                        background: user.role === 'admin' ? '#f59e0b' : '#3b82f6',
                        color: user.role === 'admin' ? '#000' : '#fff'
                      }}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151", textAlign: "center", fontWeight: "bold" }}>
                    {user.totalOrders}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151", textAlign: "right", color: "#10b981", fontWeight: "bold" }}>
                    ₹{user.totalPayment}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151" }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #374151", textAlign: "center" }}>
                    {editingUser === user._id ? (
                      <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                        <button 
                          onClick={() => handleSaveEdit(user._id)}
                          style={{ background: "#10b981", color: "white", border: "none", padding: "6px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                          title="Save"
                        >
                          ✅
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          style={{ background: "#6b7280", color: "white", border: "none", padding: "6px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                          title="Cancel"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button 
                          onClick={() => handleEditClick(user)}
                          style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name, user.role)}
                          style={{
                            background: user.role === 'admin' ? "#4b5563" : "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "5px",
                            cursor: user.role === 'admin' ? "not-allowed" : "pointer",
                            fontWeight: "bold"
                          }}
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? "Cannot delete admins" : "Delete User"}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersList;
