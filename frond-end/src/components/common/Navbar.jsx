import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { ThemeToggle } from './ThemeToggle'; // Import the toggle component
import { 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Store, 
  ShieldCheck, 
  Package, 
  LayoutDashboard 
} from 'lucide-react';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.wishlistItems.length);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    // Changed bg-white to bg-body-tertiary so it automatically switches colors in dark mode
    <header className="sticky-top top-0 bg-body-tertiary border-bottom border-secondary-subtle shadow-sm">
      <div className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between py-2">
          
          {/* Logo */}
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div className="rounded-3 bg-primary p-2 d-flex align-items-center justify-content-center text-white shadow">
                <Store />
              </div>
              <span className="fs-4 fw-bold text-primary">
                MultiMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/" className="small fw-medium text-body text-decoration-none">
              Home
            </Link>
            <Link to="/products" className="small fw-medium text-body text-decoration-none">
              Catalog
            </Link>
            <Link to="/shops" className="small fw-medium text-body text-decoration-none">
              Stores
            </Link>
          </nav>

          {/* Desktop User Actions & Theme Toggle */}
          <div className="d-none d-md-flex align-items-center gap-3">
            
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="position-relative p-2 text-body bg-body-secondary rounded-pill text-decoration-none"
              title="Wishlist"
            >
              <Heart />
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 end-0 badge text-bg-danger rounded-pill">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link 
              to="/cart" 
              className="position-relative p-2 text-body bg-body-secondary rounded-pill text-decoration-none"
              title="Shopping cart"
            >
              <ShoppingBag />
              {cartQuantity > 0 && (
                <span className="position-absolute top-0 end-0 badge text-bg-primary rounded-pill">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Auth & Role Links */}
            {isAuthenticated && user ? (
              <div className="d-flex align-items-center gap-3">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-primary bg-primary-subtle border border-primary-subtle rounded-3 text-decoration-none"
                  >
                    <ShieldCheck />
                    Admin
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-primary bg-primary-subtle border border-primary-subtle rounded-3 text-decoration-none"
                  >
                    <LayoutDashboard />
                    My Store
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-body bg-body-secondary border border-secondary-subtle rounded-3 text-decoration-none"
                  >
                    <Package />
                    My Orders
                  </Link>
                )}

                <div className="d-flex align-items-center gap-2 ps-2">
                  <div className="text-end d-none d-lg-block">
                    <p className="small fw-semibold text-body mb-0">{user.name}</p>
                    <p className="small text-secondary text-capitalize mb-0">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-danger bg-danger-subtle border-0 rounded-3"
                    title="Log out"
                  >
                    <LogOut />
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="px-3 py-2 small fw-medium text-body text-decoration-none">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary small py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Triggers */}
          <div className="d-flex d-md-none align-items-center gap-2">
            <ThemeToggle />

            <Link to="/cart" className="position-relative p-2 text-body text-decoration-none">
              <ShoppingBag />
              {cartQuantity > 0 && (
                <span className="position-absolute top-0 end-0 badge text-bg-primary rounded-pill">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-body rounded-3 bg-body-secondary border-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="d-md-none bg-body border-bottom border-secondary-subtle px-3 pt-2 pb-4 vstack gap-3">
          <nav className="vstack gap-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3 fw-medium text-body bg-body-secondary text-decoration-none"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3 fw-medium text-body bg-body-secondary text-decoration-none"
            >
              Catalog
            </Link>
            <Link 
              to="/shops" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3 fw-medium text-body bg-body-secondary text-decoration-none"
            >
              Stores
            </Link>
            <Link 
              to="/wishlist" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3 fw-medium text-body bg-body-secondary text-decoration-none"
            >
              <span>Wishlist</span>
              <span className="bg-danger-subtle text-danger px-2 py-1 rounded-pill small fw-bold">
                {wishlistCount}
              </span>
            </Link>
          </nav>

          <div className="border-top border-secondary-subtle pt-3 vstack gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2">
                  <p className="small fw-bold text-body mb-0">{user.name}</p>
                  <p className="small text-secondary text-capitalize mb-0">{user.role}</p>
                </div>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-primary bg-primary-subtle text-decoration-none"
                  >
                    Admin Panel
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-primary bg-primary-subtle text-decoration-none"
                  >
                    My Store Panel
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-body bg-body-secondary text-decoration-none"
                  >
                    My Orders
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-100 text-start px-3 py-2 rounded-3 small fw-medium text-danger bg-danger-subtle border-0"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="row row-cols-2 g-2 pt-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-outline-secondary text-center small py-2 text-decoration-none"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-primary text-center small py-2 text-decoration-none"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};