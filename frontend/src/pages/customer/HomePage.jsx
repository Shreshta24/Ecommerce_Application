import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { useCart } from "../../cart/CartContext";
import "./HomePage.css";

export function CustomerHomePage() {
  const cart = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const fetchCategories = async () => {
    try {
      const data = await apiRequest("/api/categories");
      setCategories(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = (product) => {
    cart?.addItem(product, 1);
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
        {loading && <div className="loading-state">Loading premium products...</div>}
        {error && <p className="error glass-card" style={{ color: '#ef4444', padding: '1rem' }}>{error}</p>}

        <div className="glass-card" style={{ padding: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 140px 140px auto", gap: "0.75rem", alignItems: "end" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Min price</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Max price</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="9999" />
            </label>
            <button onClick={fetchProducts}>Apply</button>
          </div>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card glass-card">
              <div className="product-image-container">
                {p.images?.[0] && (
                  <img
                    src={
                      p.images[0].startsWith("http")
                        ? p.images[0]
                        : `${
                            import.meta.env.VITE_API_BASE_URL ||
                            "https://ecommerce-application-efzj.onrender.com"
                          }${p.images[0]}`
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
                <button className="buy-btn" onClick={() => handleAddToCart(p)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
