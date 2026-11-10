import { useEffect, useState } from 'react';
import api from '../../services/api';
import { DashboardTabs, ADMIN_TABS, Stat, Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatPrice, formatDate, errMsg } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/orders')])
      .then(([s, o]) => { setStats(s.data); setOrders(o.data); })
      .catch((e) => setError(errMsg(e)));
  }, []);

  return (
    <div>
      <DashboardTabs tabs={ADMIN_TABS} />
      <h1 className="mb-4 text-2xl font-bold">Platform overview</h1>
      <ErrorMsg>{error}</ErrorMsg>
      {!stats ? !error && <Loader /> : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Users" value={stats.users} />
            <Stat label="Shops" value={stats.shops} hint={`${stats.pendingShops} awaiting verification`} />
            <Stat label="Products" value={stats.products} />
            <Stat label="Orders" value={stats.orders} />
            <Stat label="Gross sales" value={formatPrice(stats.revenue)} />
          </div>

          <h2 className="mb-2 font-semibold">Recent orders (all shops)</h2>
          <div className="card overflow-x-auto !p-0">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Order</th><th className="th">Date</th><th className="th">Customer</th><th className="th">Shop</th><th className="th">Total</th><th className="th">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 && <tr><td className="td text-slate-500" colSpan={6}>No orders yet.</td></tr>}
                {orders.slice(0, 20).map((o) => (
                  <tr key={o._id}>
                    <td className="td font-medium">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="td text-slate-500">{formatDate(o.createdAt)}</td>
                    <td className="td">{o.customerId?.name || '—'}</td>
                    <td className="td">{o.shopId?.shopName || '—'}</td>
                    <td className="td">{formatPrice(o.totalPrice)}</td>
                    <td className="td"><Badge>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
