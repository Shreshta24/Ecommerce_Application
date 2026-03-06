import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { token, logout, user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo gradient-text">
          SB Shop
        </Link>

        <div className="navbar-links">
          {token ? (
            <>
              {user?.role === "customer" && (
                <>
                  <Link to="/customer" className="nav-item">Products</Link>
                  <Link to="/customer/cart" className="nav-item">
                    My Cart{cart?.count ? ` (${cart.count})` : ""}
                  </Link>
                  <Link to="/customer/orders" className="nav-item">Orders</Link>
                  <Link to="/customer/profile" className="nav-item">Profile</Link>
                </>
              )}
              {user?.role === "seller" && (
                <>
                  <Link to="/seller" className="nav-item">My Products</Link>
                  <Link to="/seller/add-product" className="nav-item">Add Product</Link>
                  <Link to="/seller/orders" className="nav-item">Orders</Link>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin" className="nav-item">Orders</Link>
                  <Link to="/admin/categories" className="nav-item">Categories</Link>
                  <Link to="/admin/transport-agents" className="nav-item">Transport Agents</Link>
                </>
              )}
              <div className="nav-user">
                <span className="user-name">{user?.name || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
