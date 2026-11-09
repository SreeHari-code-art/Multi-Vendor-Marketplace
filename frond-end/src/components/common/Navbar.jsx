import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
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

  // Obtener estado de autenticación y usuario actual desde Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Obtener cantidades del carrito y lista de deseos para los contadores (badges)
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.wishlistItems.length);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky-top top-0  bg-white border-bottom border-secondary-subtle shadow-sm">
      <div className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between ">
          
          {/* Logo del Marketplace */}
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center gap-2 ">
              <div className="rounded-3 bg-primary p-2 d-flex align-items-center justify-content-center text-white shadow">
                <Store className=" " />
              </div>
              <span className="fs-4 fw-bold     text-primary">
                MultiMarket
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación principales (Escritorio) */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/" className="small fw-medium text-body text-primary ">
              Home
            </Link>
            <Link to="/products" className="small fw-medium text-body text-primary ">
              Catalog
            </Link>
            <Link to="/shops" className="small fw-medium text-body text-primary ">
              Stores
            </Link>
          </nav>

          {/* Acciones de usuario y accesos rápidos (Escritorio) */}
          <div className="d-none d-md-flex align-items-center gap-3">
            
            {/* Lista de Deseos (Wishlist) */}
            <Link 
              to="/wishlist" 
              className="position-relative p-2 text-secondary text-primary bg-secondary-subtle rounded-pill "
              title="Wishlist"
            >
              <Heart className=" " />
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 end-0 badge text-bg-danger rounded-pill">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Carrito de Compras */}
            <Link 
              to="/cart" 
              className="position-relative p-2 text-secondary text-primary bg-secondary-subtle rounded-pill "
              title="Shopping cart"
            >
              <ShoppingBag className=" " />
              {cartQuantity > 0 && (
                <span className="position-absolute top-0 end-0 badge text-bg-primary rounded-pill">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <div className="  bg-body-tertiary" />

            {/* Enlaces de Autenticación y Paneles según Rol */}
            {isAuthenticated && user ? (
              <div className="d-flex align-items-center gap-3">
                {/* Enlace condicional según el rol */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-primary bg-primary-subtle border border-primary-subtle rounded-3 bg-primary-subtle "
                  >
                    <ShieldCheck className=" " />
                    Admin
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-primary bg-primary-subtle border border-primary-subtle rounded-3 bg-primary-subtle "
                  >
                    <LayoutDashboard className=" " />
                    My Store
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    className="d-flex align-items-center gap-2 px-3 py-2 small fw-medium text-body bg-body-tertiary border border-secondary-subtle rounded-3 bg-secondary-subtle "
                  >
                    <Package className=" " />
                    My Orders
                  </Link>
                )}

                {/* Menú de Perfil y Salida */}
                <div className="d-flex align-items-center gap-2 ps-2">
                  <div className="text-end d-none d-lg-block">
                    <p className="small fw-semibold text-dark">{user.name}</p>
                    <p className="small text-secondary text-capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-secondary text-danger bg-danger-subtle rounded-3 "
                    title="Log out"
                  >
                    <LogOut className=" " />
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-3 py-2 small fw-medium text-body text-primary "
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary small py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Botón de Menú Móvil */}
          <div className="d-flex d-md-none align-items-center gap-3">
            <Link to="/cart" className="position-relative p-2 text-secondary text-primary">
              <ShoppingBag className=" " />
              {cartQuantity > 0 && (
                <span className="position-absolute top-0 end-0 d-inline-flex align-items-center justify-content-center px-2 py-1 small fw-bold text-white bg-primary-subtle rounded-pill">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-secondary text-dark rounded-3 bg-secondary-subtle "
            >
              {isMobileMenuOpen ? <X className=" " /> : <Menu className=" " />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="d-md-none bg-white border-bottom border-secondary-subtle px-3 pt-2 pb-4 vstack gap-3">
          <nav className="vstack gap-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3  fw-medium text-body bg-body-tertiary"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3  fw-medium text-body bg-body-tertiary"
            >
              Catalog
            </Link>
            <Link 
              to="/shops" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-block px-3 py-2 rounded-3  fw-medium text-body bg-body-tertiary"
            >
              Stores
            </Link>
            <Link 
              to="/wishlist" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3  fw-medium text-body bg-body-tertiary"
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
                  <p className="small fw-bold text-dark">{user.name}</p>
                  <p className="small text-secondary text-capitalize">{user.role}</p>
                </div>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-primary bg-primary-subtle"
                  >
                    Admin Panel
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-primary bg-primary-subtle"
                  >
                    My Store Panel
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="d-block px-3 py-2 rounded-3 small fw-medium text-body bg-body-tertiary"
                  >
                    My Orders
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-100 text-start px-3 py-2 rounded-3 small fw-medium text-danger bg-danger-subtle"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="row row-cols-2 g-2 pt-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-secondary text-center small py-2"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-primary text-center small py-2"
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