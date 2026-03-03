import { Link, Routes, Route, Navigate } from "react-router-dom";
import { CustomerHomePage } from "./HomePage";
import { CustomerOrdersPage } from "./OrdersPage";
import { CustomerProfilePage } from "./ProfilePage";
import "./Customer.css";

export function CustomerDashboard() {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav glass-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link to="" className="nav-item">Shop Home</Link>
        <Link to="orders" className="nav-item">My Orders</Link>
        <Link to="profile" className="nav-item">My Profile</Link>
      </nav>
      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<CustomerHomePage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}

