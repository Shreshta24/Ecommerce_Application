import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function SellerProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(
        "/api/products",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            images: form.image ? [form.image] : [],
          }),
        },
        token
      );
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiRequest("/api/categories");
      setCategories(data);
    } catch {}
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/uploads`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Upload failed");
      }
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>My Products</h1>
      <form className="simple-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <button type="submit">Add product</button>
      </form>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            {p.images?.[0] && (
              <img
                src={
                  p.images[0].startsWith("http")
                    ? p.images[0]
                    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${p.images[0]}`
                }
                alt={p.name}
                className="product-image"
              />
            )}
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <p>{p.category}</p>
          </div>
        ))}
      </div>
      {products.length === 0 && !loading && <p>No products yet.</p>}
    </div>
  );
}
