import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/admin/categories", {}, token);
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(
        "/api/admin/categories",
        { method: "POST", body: JSON.stringify({ name }) },
        token
      );
      setName("");
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await apiRequest(
        `/api/admin/categories/${id}`,
        { method: "PUT", body: JSON.stringify({ isActive: !isActive }) },
        token
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const editCategory = async (c) => {
    const nextName = prompt("New category name", c.name);
    if (!nextName) return;
    try {
      await apiRequest(
        `/api/admin/categories/${c._id}`,
        { method: "PUT", body: JSON.stringify({ name: nextName }) },
        token
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const removeCategory = async (id) => {
    try {
      await apiRequest(`/api/admin/categories/${id}`, { method: "DELETE" }, token);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <form className="simple-form" onSubmit={addCategory}>
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add category</button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            {c.name} {c.isActive ? "(active)" : "(inactive)"}{" "}
            <button onClick={() => editCategory(c)}>Edit</button>{" "}
            <button onClick={() => toggleActive(c._id, c.isActive)}>
              {c.isActive ? "Deactivate" : "Activate"}
            </button>{" "}
            <button onClick={() => removeCategory(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {categories.length === 0 && !loading && <p>No categories yet.</p>}
    </div>
  );
}
