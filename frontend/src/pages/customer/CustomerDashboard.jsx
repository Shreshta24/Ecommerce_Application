import { Routes, Route, Navigate } from "react-router-dom";
import { CustomerHomePage } from "./HomePage";
import { CustomerOrdersPage } from "./OrdersPage";
import { CustomerProfilePage } from "./ProfilePage";
import { CustomerCartPage } from "./CartPage";
import "./Customer.css";

export function CustomerDashboard() {
  return (
    <div className="dashboard-container">
      <main className="dashboard-content">
        <Routes>
          <Route path="" element={<CustomerHomePage />} />
          <Route path="cart" element={<CustomerCartPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}

