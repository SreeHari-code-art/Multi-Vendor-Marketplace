import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { homeFor } from '../../utils/format';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useSelector((s) => s.wishlist.items.length);
  const [q, setQ] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : '/products');
  };

  const link = 'text-sm font-medium text-slate-600 hover:text-indigo-600';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-600">🛍️ Marketplace</Link>

        <form onSubmit={onSearch} className="order-last flex w-full gap-2 md:order-none md:w-auto md:flex-1 md:max-w-md">
          <input className="input" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        <nav className="ml-auto flex items-center gap-4">
          <Link to="/products" className={link}>Shop</Link>
          <Link to="/wishlist" className={link}>Wishlist{wishCount > 0 && ` (${wishCount})`}</Link>
          <Link to="/cart" className={link}>Cart{cartCount > 0 && ` (${cartCount})`}</Link>
          {user ? (
            <>
              {user.role === 'customer' && <Link to="/orders" className={link}>My orders</Link>}
              {user.role !== 'customer' && <Link to={homeFor(user.role)} className={link}>Dashboard</Link>}
              <span className="hidden text-sm text-slate-400 sm:inline">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={() => { dispatch(logout()); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={link}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
