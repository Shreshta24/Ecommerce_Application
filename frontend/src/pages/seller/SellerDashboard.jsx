import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { SellerProductsPage } from "./SellerProductsPage";

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
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<SellerProductsPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}

