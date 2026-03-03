import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";
import "./HomePage.css";

export function CustomerHomePage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cartItem, setCartItem] = useState(null);
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      const data = await apiRequest(`/api/products?${params.toString()}`);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuyNow = (product) => {
    setCartItem({ productId: product._id, quantity: 1, product });
    setCheckoutMessage("");
    // Scroll to checkout
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartItem) return;
    setCheckoutMessage("");
    try {
      const order = await apiRequest(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            items: [
              {
                productId: cartItem.productId,
                quantity: cartItem.quantity,
              },
            ],
            deliveryAddress: address,
            paymentMethod: "card",
          }),
        },
        token
      );
      setCheckoutMessage(
        `Order placed successfully. Order ID: ${order._id}`
      );
      setCartItem(null);
    } catch (err) {
      setCheckoutMessage(err.message);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="gradient-text">Premium Products for Your Lifestyle</h1>
        <p>Discover our curated collection of high-quality items designed to elevate your everyday experience.</p>
        <div className="hero-btns">
          <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>Shop Now</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </section>

      <div id="products" className="products-section">
        <div className="filters-bar glass-card">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button className="search-action-btn" onClick={fetchProducts}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Search
          </button>
        </div>

        {loading && <div className="loading-state">Loading premium products...</div>}
        {error && <p className="error glass-card" style={{ color: '#ef4444', padding: '1rem' }}>{error}</p>}

        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card glass-card">
              <div className="product-image-container">
                {p.images?.[0] && (
                  <img
                    src={
                      p.images[0].startsWith("http")
                        ? p.images[0]
                        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${p.images[0]}`
                    }
                    alt={p.name}
                    className="product-image"
                  />
                )}
              </div>
              <div className="product-info">
                <span className="product-category">{p.category}</span>
                <h3>{p.name}</h3>
              </div>
              <div className="product-footer">
                <span className="price-tag">${p.price}</span>
                <button className="buy-btn" onClick={() => handleBuyNow(p)}>Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="checkout" className="checkout-section">
        {cartItem ? (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 className="gradient-text">Complete Your Purchase</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
              You are purchasing <strong>{cartItem.product.name}</strong> for ${cartItem.product.price}.
            </p>
            <form className="checkout-form" onSubmit={handleCheckout}>
              <label className="full-width">
                Address Line 1
                <input
                  placeholder="Street name and house number"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                City
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                State
                <input
                  placeholder="State/Province"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Postal Code
                <input
                  placeholder="ZIP/Postal Code"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Country
                <input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit" className="full-width">Secure Payment & Place Order</button>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>Ready to transform your life?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select a product from our collection to begin your checkout journey.</p>
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>Browse Products</button>
          </div>
        )}
        {checkoutMessage && (
          <div className="glass-card success-banner" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgb(34, 197, 94)' }}>
            <p style={{ color: '#4ade80', fontWeight: '600', textAlign: 'center', margin: 0 }}>{checkoutMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
}
