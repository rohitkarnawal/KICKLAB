import { useState } from "react";
import "./Navbar.css";
import AuthModal from "./AuthModal";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Navbar() {
  const [authModal, setAuthModal] = useState(null);
  const [search, setSearch] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    return cart.reduce((total, item) => total + item.quantity, 0);
  });

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const count = cart.reduce((total, item) => total + item.quantity, 0);

      setCartCount(count);
    };

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <>
      {/* Top links */}
      <div className="top-navbar">
        <div className="top-links">
          <a href="#">Help</a>
          <span>|</span>

          {user ? (
            <>
              <Link to="/orders" className="orders-link">
                My Orders
              </Link>

              {user.role === "admin" && (
                <>
                  <span>|</span>
                  <Link to="/admin" className="admin-link">
                    Admin
                  </Link>
                </>
              )}

              <span>Hi, {user.name}</span>
              <span>|</span>

              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button onClick={() => setAuthModal("signup")}>Sign Up</button>

              <span>|</span>

              <button onClick={() => setAuthModal("login")}>Log In</button>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        {/* Brand */}
        <div className="brand">
          <a href="/">KICKLAB</a>
        </div>

        {/* Navigation */}
        <div className="nav-links">
          <a href="/">New & Featured</a>
          <a href="/products">Men</a>
          <a href="/products">Women</a>
          <a href="/products">Kids</a>
          <a href="/products">Jordan</a>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <div className="search-box">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(
                    search.trim(),
                  )}`;
                }
              }}
            />
          </div>

          <Link to="/wishlist" className="wishlist-icon">
            ♡
          </Link>

          <Link to="/cart" className="cart-icon">
            <i
              className="fa-solid fa-bag-shopping"
              style={{ fontSize: "18px" }}
            ></i>

            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </nav>

      {/* Auth Popup */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onAuthSuccess={(loggedInUser) => {
            setUser(loggedInUser);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
