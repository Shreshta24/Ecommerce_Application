import { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useCart } from "../../cart/CartContext";
import { apiRequest } from "../../api";

export function CustomerCartPage() {
  const { token } = useAuth();
  const cart = useCart();
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");

  const items = cart?.items || [];
  const total = cart?.total || 0;

  const canCheckout = items.length > 0 && !!token;

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://ecommerce-application-efzj.onrender.com";
  const imageUrl = (img) =>
    !img
      ? ""
      : img.startsWith("http")
        ? img
        : `${apiBase}${img}`;

  const orderPayload = useMemo(() => {
    return {
      items: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
      deliveryAddress: address,
      paymentMethod: "card",
    };
  }, [items, address]);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!canCheckout) return;
    setMessage("");
    setPlacing(true);
    try {
      const order = await apiRequest(
        "/api/orders",
        { method: "POST", body: JSON.stringify(orderPayload) },
        token
      );
      cart.clear();
      setMessage(`Order placed successfully. Order ID: ${order._id}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h1 className="gradient-text">My Cart</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Review items, then complete payment to place your order.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h3>Your cart is empty</h3>
          <p style={{ color: "var(--text-muted)" }}>
            Browse products and add what you like.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            {items.map((it) => (
              <div
                key={it.productId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr auto auto",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  {it.image ? (
                    <img
                      src={imageUrl(it.image)}
                      alt={it.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{it.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {it.category} • ${it.price}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => cart.setQuantity(it.productId, e.target.value)}
                    style={{ width: 80 }}
                  />
                  <button onClick={() => cart.removeItem(it.productId)}>Remove</button>
                </div>
                <div style={{ fontWeight: 800 }}>${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
            <h2 className="gradient-text" style={{ marginTop: 0 }}>
              Checkout
            </h2>
            <form className="checkout-form" onSubmit={placeOrder}>
              <label className="full-width">
                Address Line 1
                <input
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  required
                />
              </label>
              <label className="full-width">
                Address Line 2 (optional)
                <input
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                />
              </label>
              <label>
                City
                <input
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
              </label>
              <label>
                State
                <input
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </label>
              <label>
                Postal Code
                <input
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  required
                />
              </label>
              <label>
                Country
                <input
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                />
              </label>
              <button type="submit" className="full-width" disabled={!canCheckout || placing}>
                {placing ? "Placing order..." : "Pay & Place Order"}
              </button>
            </form>
            {message ? (
              <div style={{ marginTop: 12, color: message.startsWith("Order placed") ? "#4ade80" : "#ef4444" }}>
                {message}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

