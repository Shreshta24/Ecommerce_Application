import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function SellerAddProductPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [msg, setMsg] = useState("");

  const loadCategories = async () => {
    try {
      const data = await apiRequest("/api/categories");
      setCategories(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL ||
          "https://ecommerce-application-efzj.onrender.com"
        }/api/uploads`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
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
      setMsg(err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await apiRequest(
        "/api/products",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            price: Number(form.price),
            description: form.description || undefined,
            images: form.image ? [form.image] : [],
          }),
        },
        token
      );
      setForm({ name: "", category: "", price: "", image: "", description: "" });
      setMsg("Product added");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form className="simple-form" onSubmit={submit}>
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
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add product</button>
      </form>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
}

