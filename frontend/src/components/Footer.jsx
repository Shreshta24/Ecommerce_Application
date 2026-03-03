import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer glass-card">
            <div className="footer-container">
                <div className="footer-brand">
                    <h2 className="gradient-text">EcoShop</h2>
                    <p>Elevate your lifestyle with our curated collection of premium products.</p>
                </div>

                <div className="footer-links">
                    <div className="footer-group">
                        <h3>Shop</h3>
                        <ul>
                            <li><a href="/">All Products</a></li>
                            <li><a href="/">Categories</a></li>
                            <li><a href="/">Featured</a></li>
                        </ul>
                    </div>

                    <div className="footer-group">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="/">Contact Us</a></li>
                            <li><a href="/">Returns</a></li>
                            <li><a href="/">Shipping</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-newsletter">
                    <h3>Stay Updated</h3>
                    <p>Subscribe to get special offers and new arrivals.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Email address" />
                        <button>Join</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EcoShop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
