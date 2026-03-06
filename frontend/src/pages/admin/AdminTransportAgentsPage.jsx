import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function AdminTransportAgentsPage() {
  const { token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
  });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    company: "",
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/admin/transport-agents", {}, token);
      setAgents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(
        "/api/admin/transport-agents",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        token
      );
      setForm({ name: "", phone: "", company: "" });
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (a) => {
    setEditing(a._id);
    setEditForm({
      name: a.name || "",
      phone: a.phone || "",
      company: a.company || "",
      isActive: a.isActive !== false,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await apiRequest(
        `/api/admin/transport-agents/${editing}`,
        { method: "PUT", body: JSON.stringify(editForm) },
        token
      );
      setEditing(null);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this transport agent?")) return;
    try {
      await apiRequest(`/api/admin/transport-agents/${id}`, { method: "DELETE" }, token);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Transport Agents</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {editing && (
        <div className="simple-form" style={{ marginBottom: 20 }}>
          <h3>Edit agent</h3>
          <input
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <input
            placeholder="Company"
            value={editForm.company}
            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
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

      <form className="simple-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <button type="submit">Add agent</button>
      </form>
      <ul>
        {agents.map((a) => (
          <li key={a._id}>
            {a.name} ({a.company}) {a.phone && `- ${a.phone}`}{" "}
            {a.isActive === false ? "(inactive)" : ""}
            <button onClick={() => startEdit(a)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button onClick={() => remove(a._id)} style={{ marginLeft: 8 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {agents.length === 0 && !loading && <p>No agents yet.</p>}
    </div>
  );
}

