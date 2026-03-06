import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function SellerProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/products/mine", {}, token);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiRequest("/api/categories");
      setCategories(data);
    } catch {}
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setEditForm({
      name: p.name || "",
      description: p.description || "",
      price: String(p.price ?? ""),
      category: p.category || "",
      image: p.images?.[0] || "",
      isActive: p.isActive !== false,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await apiRequest(
        `/api/products/${editing}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description || undefined,
            price: Number(editForm.price),
            category: editForm.category,
            images: editForm.image ? [editForm.image] : [],
            isActive: !!editForm.isActive,
          }),
        },
        token
      );
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE" }, token);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>My Products</h1>

      {editing && (
        <div className="simple-form" style={{ marginBottom: 20 }}>
          <h3>Edit product</h3>
          <input
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
          <select
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            value={editForm.image}
            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!editForm.isActive}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
            />
            Active
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            {p.images?.[0] && (
              <img
                src={
                  p.images[0].startsWith("http")
                    ? p.images[0]
                    : `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "https://ecommerce-application-efzj.onrender.com"
                      }${p.images[0]}`
                }
                alt={p.name}
                className="product-image"
              />
            )}
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <p>{p.category}</p>
            <p style={{ opacity: 0.8 }}>{p.isActive ? "Active" : "Inactive"}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => startEdit(p)}>Edit</button>
              <button onClick={() => removeProduct(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && !loading && <p>No products yet.</p>}
    </div>
  );
}
