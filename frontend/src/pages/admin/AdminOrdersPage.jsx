import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [data, agentData] = await Promise.all([
        apiRequest("/api/admin/orders", {}, token),
        apiRequest("/api/admin/transport-agents", {}, token),
      ]);
      setOrders(data);
      setAgents(agentData);
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

  const updateShipping = async (orderId, fields) => {
    try {
      await apiRequest(
        `/api/admin/orders/${orderId}/shipping`,
        {
          method: "PUT",
          body: JSON.stringify(fields),
        },
        token
      );
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const statuses = ["ordered", "shipped", "out_for_delivery", "delivered", "cancelled"];

  return (
    <div>
      <h1>All Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <p>
            <strong>Order ID:</strong> {o._id}
          </p>
          <p>
            <strong>Customer:</strong> {o.customer?.email}
          </p>
          <p>
            <strong>Status:</strong> {o.status} |{" "}
            <strong>Payment:</strong> {o.paymentStatus}
          </p>
          <p>
            <strong>Shipping:</strong>{" "}
            {o.shippingTrackingNumber
              ? `${o.shippingCarrier} - ${o.shippingTrackingNumber}`
              : "Not assigned"}
          </p>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Status</strong></label>
              <select
                value={draft[o._id]?.status ?? o.status}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), status: e.target.value } }))
                }
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Transport agent</strong></label>
              <select
                value={draft[o._id]?.transportAgentId ?? (o.transportAgent?._id || "")}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), transportAgentId: e.target.value } }))
                }
              >
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}{a.phone ? ` (${a.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Carrier</strong></label>
              <input
                value={draft[o._id]?.shippingCarrier ?? (o.shippingCarrier || "")}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), shippingCarrier: e.target.value } }))
                }
                placeholder="e.g. BlueDart"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Tracking number</strong></label>
              <input
                value={draft[o._id]?.shippingTrackingNumber ?? (o.shippingTrackingNumber || "")}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), shippingTrackingNumber: e.target.value } }))
                }
                placeholder="e.g. SB123456"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Current location</strong></label>
              <input
                value={draft[o._id]?.currentLocation ?? (o.currentLocation || "")}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), currentLocation: e.target.value } }))
                }
                placeholder="Warehouse / Kochi Hub / Out for delivery..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, alignItems: "center" }}>
              <label><strong>Note</strong></label>
              <input
                value={draft[o._id]?.note ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [o._id]: { ...(d[o._id] || {}), note: e.target.value } }))
                }
                placeholder="Optional update note"
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => updateShipping(o._id, { ...(draft[o._id] || {}) })}
              >
                Save updates
              </button>
              <button onClick={() => setDraft((d) => ({ ...d, [o._id]: {} }))}>
                Reset
              </button>
            </div>
          </div>
        </div>
      ))}
      {orders.length === 0 && !loading && <p>No orders yet.</p>}
    </div>
  );
}

