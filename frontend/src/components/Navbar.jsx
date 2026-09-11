import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "../style/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar${menuOpen ? " is-open" : ""}`}>
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>
          <span className="brand-mark">A</span>
          <span>AROMIQUE</span>
        </Link>
      </div>

      <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
        <span />
        <span />
      </button>

      <ul className="navbar-links">
        {[['Home', '/'], ['Shop', '/shop'], ['Men', '/shop?category=Men'], ['Women', '/shop?category=Women'], ['Unisex', '/shop?category=Unisex'], ['About', '/about']].map(([label, path]) => <li key={label}><Link to={path} onClick={closeMenu}>{label}</Link></li>)}
        <li><Link to="/cart" onClick={closeMenu}>Bag <span className="cart-count">{(cartItems || []).length}</span></Link></li>

        {user ? (
          <>
            <li>
              <Link to="/profile" onClick={closeMenu}>Account</Link>
            </li>

            {user.role === "admin" && (
              <li>
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" onClick={closeMenu}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;