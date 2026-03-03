import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";
import "./Customer.css";

export function CustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/api/orders/mine", {}, token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h1 className="gradient-text">My Orders</h1>
      </div>

      {loading && <div className="loading-state">Syncing your order history...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.map((o) => (
          <div key={o._id} className="order-card glass-card">
            <div className="order-header">
              <div>
                <span className="stat-label">Order ID: </span>
                <span className="order-id">{o._id}</span>
              </div>
              <span className={`order-status status-${o.status}`}>
                {o.status}
              </span>
            </div>

            <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <p className="stat-label">Payment Status</p>
                <p style={{ fontWeight: '600', color: o.paymentStatus === 'paid' ? '#4ade80' : 'var(--secondary)' }}>
                  {o.paymentStatus.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="stat-label">Total Amount</p>
                <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>${o.totalAmount}</p>
              </div>
              <div>
                <p className="stat-label">Shipping Info</p>
                <p style={{ fontSize: '0.9rem' }}>
                  {o.shippingTrackingNumber
                    ? `${o.shippingCarrier} - ${o.shippingTrackingNumber}`
                    : "Processing..."}
                </p>
              </div>
            </div>

            <div className="order-items">
              <p className="stat-label" style={{ marginBottom: '0.5rem' }}>Items</p>
              {o.items.map((it, idx) => (
                <div key={idx} className="order-item">
                  <span>{it.product?.name || "Product"} <span style={{ color: 'var(--text-muted)' }}>x{it.quantity}</span></span>
                  <span>${it.priceAtPurchase}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No orders found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '1rem' }}>Browse the shop</a>
        </div>
      )}
    </div>
  );
}

