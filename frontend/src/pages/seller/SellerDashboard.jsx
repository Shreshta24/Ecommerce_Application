import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { SellerProductsPage } from "./SellerProductsPage";
import { SellerAddProductPage } from "./SellerAddProductPage";
import { SellerOrdersPage } from "./SellerOrdersPage";

export function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Seller</h2>
          <p className="sidebar-user">{user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="">My products</Link>
          <Link to="add-product">Add product</Link>
          <Link to="orders">Orders</Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<SellerProductsPage />} />
          <Route path="add-product" element={<SellerAddProductPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}

