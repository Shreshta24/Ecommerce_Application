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
        <p style={{ color: 'var(--text-muted)' }}>View order history, shipping status, and tracking updates.</p>
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
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="stat-label">Status:</span>
                <span className={`order-status status-${o.status}`} style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {o.status}
                </span>
              </div>
            </div>

            <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
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
                <p className="stat-label">Shipping Tracking</p>
                <div style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                  {o.shippingTrackingNumber ? (
                    <>
                      <p><strong>Carrier:</strong> {o.shippingCarrier}</p>
                      <p><strong>Tracking:</strong> {o.shippingTrackingNumber}</p>
                    </>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Awaiting shipping details from admin...</p>
                  )}
                </div>
              </div>
              <div>
                <p className="stat-label">Current Location</p>
                <p style={{ fontWeight: 600 }}>
                  {o.currentLocation || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not updated yet</span>}
                </p>
              </div>
            </div>

            {Array.isArray(o.trackingUpdates) && o.trackingUpdates.length > 0 && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <p className="stat-label" style={{ marginBottom: '0.5rem' }}>Tracking Updates</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {[...o.trackingUpdates].slice().reverse().slice(0, 6).map((u, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.95rem' }}>
                      <div>
                        <strong style={{ textTransform: 'uppercase' }}>{u.status || o.status}</strong>{" "}
                        {u.location ? <span style={{ color: 'var(--text-muted)' }}>• {u.location}</span> : null}
                        {u.note ? <div style={{ color: 'var(--text-muted)' }}>{u.note}</div> : null}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        {u.at ? new Date(u.at).toLocaleString() : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="order-items" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <p className="stat-label" style={{ marginBottom: '0.5rem' }}>Items Purchased</p>
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

