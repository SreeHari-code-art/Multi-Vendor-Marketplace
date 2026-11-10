import { useEffect, useState } from 'react';
import api from '../../services/api';
import { DashboardTabs, SELLER_TABS, Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatPrice, formatDate, errMsg, ORDER_FLOW } from '../../utils/format';

export default function ManageOrders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    api.get('/orders/seller').then((r) => setOrders(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const advance = async (order) => {
    const next = ORDER_FLOW[ORDER_FLOW.indexOf(order.status) + 1];
    setBusy(order._id);
    setError('');
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { status: next });
      setOrders((list) => list.map((o) => (o._id === order._id ? { ...o, status: data.status } : o)));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const visible = orders?.filter((o) => filter === 'All' || o.status === filter) ?? [];

  return (
    <div>
      <DashboardTabs tabs={SELLER_TABS} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Incoming orders</h1>
        <select className="input !w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {['All', ...ORDER_FLOW].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <ErrorMsg>{error}</ErrorMsg>

      {!orders ? <Loader /> : visible.length === 0 ? <p className="py-10 text-center text-slate-500">No orders to show.</p> : (
        <div className="mt-2 space-y-4">
          {visible.map((o) => {
            const next = ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1];
            return (
              <div key={o._id} className="card space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">#{o._id.slice(-6).toUpperCase()} <span className="font-normal text-slate-500">· {formatDate(o.createdAt)}</span></p>
                    <p className="text-sm text-slate-500">{o.customerId?.name} ({o.customerId?.email})</p>
                  </div>
                  <Badge>{o.status}</Badge>
                </div>
                <ul className="divide-y divide-slate-100 text-sm">
                  {o.items.map((i) => <li key={i.productId} className="flex justify-between py-1.5"><span>{i.title} × {i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></li>)}
                </ul>
                <p className="text-sm text-slate-600">
                  📦 {o.shippingAddress.fullName}, {o.shippingAddress.address}, {o.shippingAddress.city} {o.shippingAddress.postalCode}, {o.shippingAddress.country} · ☎ {o.shippingAddress.phone}
                </p>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-slate-500">{o.paymentMethod} · <span className="font-bold text-slate-800">{formatPrice(o.totalPrice)}</span></span>
                  {next && <button className="btn btn-primary btn-sm" disabled={busy === o._id} onClick={() => advance(o)}>Mark as {next}</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
