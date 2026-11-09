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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo del Marketplace */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                MultiMarket
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación principales (Escritorio) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Catalog
            </Link>
            <Link to="/shops" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Stores
            </Link>
          </nav>

          {/* Acciones de usuario y accesos rápidos (Escritorio) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Lista de Deseos (Wishlist) */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-500 rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Carrito de Compras */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full shadow-sm">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200" />

            {/* Enlaces de Autenticación y Paneles según Rol */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Enlace condicional según el rol */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Store
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                )}

                {/* Menú de Perfil y Salida */}
                <div className="flex items-center gap-2 pl-2">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Log out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Botón de Menú Móvil */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
              <ShoppingBag className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="space-y-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Catalog
            </Link>
            <Link 
              to="/shops" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Stores
            </Link>
            <Link 
              to="/wishlist" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>Wishlist</span>
              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {wishlistCount}
              </span>
            </Link>
          </nav>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50"
                  >
                    Admin Panel
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-50"
                  >
                    My Store Panel
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link 
                    to="/customer/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50"
                  >
                    My Orders
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-secondary text-center text-sm py-2"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-center text-sm py-2"
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