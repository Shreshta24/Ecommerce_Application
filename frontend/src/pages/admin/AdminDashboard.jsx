import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { AdminOrdersPage } from "./AdminOrdersPage";
import { AdminTransportAgentsPage } from "./AdminTransportAgentsPage";
import { AdminCategoriesPage } from "./AdminCategoriesPage";

export function AdminDashboard() {
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
          <h2>Admin</h2>
          <p className="sidebar-user">{user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="">Orders</Link>
          <Link to="transport-agents">Transport agents</Link>
          <Link to="categories">Categories</Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="" element={<AdminOrdersPage />} />
          <Route
            path="transport-agents"
            element={<AdminTransportAgentsPage />}
          />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}
