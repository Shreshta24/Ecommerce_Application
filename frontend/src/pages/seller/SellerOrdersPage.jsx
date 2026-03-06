import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function SellerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/orders/seller", {}, token);
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

  return (
    <div>
      <h1>Orders for My Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <p>
            <strong>Order ID:</strong> {o._id}
          </p>
          <p>
            <strong>Customer:</strong> {o.customer?.email || "Customer"}
          </p>
          <p>
            <strong>Status:</strong> {o.status}
          </p>
          <div style={{ marginTop: 10 }}>
            <strong>Items:</strong>
            <ul>
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.product?.name || "Product"} x{it.quantity} (${it.priceAtPurchase})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      {orders.length === 0 && !loading && <p>No orders yet.</p>}
    </div>
  );
}

