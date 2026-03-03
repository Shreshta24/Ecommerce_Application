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

  return (
    <div>
      <h1>Transport Agents</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
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
            {a.name} ({a.company}) {a.phone && `- ${a.phone}`}
          </li>
        ))}
      </ul>
      {agents.length === 0 && !loading && <p>No agents yet.</p>}
    </div>
  );
}

