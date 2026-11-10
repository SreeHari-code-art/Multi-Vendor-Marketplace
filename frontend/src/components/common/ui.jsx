import { NavLink } from 'react-router-dom';

export const Loader = ({ text = 'Loading…' }) => <p className="py-10 text-center text-slate-500">{text}</p>;

export const ErrorMsg = ({ children }) =>
  children ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p> : null;

const BADGE = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Verified: 'bg-green-100 text-green-800',
  Unverified: 'bg-slate-200 text-slate-700',
};
export const Badge = ({ children }) => (
  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BADGE[children] || 'bg-slate-100 text-slate-700'}`}>{children}</span>
);

export const Stat = ({ label, value, hint }) => (
  <div className="card">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

export const DashboardTabs = ({ tabs }) => (
  <nav className="mb-6 flex gap-2 border-b border-slate-200">
    {tabs.map((t) => (
      <NavLink
        key={t.to}
        to={t.to}
        end
        className={({ isActive }) =>
          `-mb-px border-b-2 px-3 py-2 text-sm font-medium ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`
        }
      >
        {t.label}
      </NavLink>
    ))}
  </nav>
);

export const SELLER_TABS = [
  { to: '/seller', label: 'Overview' },
  { to: '/seller/products', label: 'Products & Inventory' },
  { to: '/seller/orders', label: 'Orders' },
];
export const ADMIN_TABS = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/shops', label: 'Shops' },
];
