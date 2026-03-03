import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/admin/orders", {}, token);
      setOrders(data);
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
          <button
            onClick={() =>
              updateShipping(o._id, {
                status: "shipped",
                shippingTrackingNumber: "TRACK-" + o._id.slice(-6),
                shippingCarrier: "DemoCarrier",
              })
            }
          >
            Mark as shipped (demo)
          </button>
        </div>
      ))}
      {orders.length === 0 && !loading && <p>No orders yet.</p>}
    </div>
  );
}

