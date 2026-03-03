import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { SellerDashboard } from "./pages/seller/SellerDashboard";
import { CustomerHomePage } from "./pages/customer/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard if role mismatch
    if (user.role === "customer") return <Navigate to="/customer" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "seller") return <Navigate to="/seller" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CustomerHomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/customer/*"
                element={
                  <ProtectedRoute roles={["customer"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/*"
                element={
                  <ProtectedRoute roles={["seller"]}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
