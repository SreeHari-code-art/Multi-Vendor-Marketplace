import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatPrice, formatDate, errMsg } from '../../utils/format';

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  if (error) return <ErrorMsg>{error}</ErrorMsg>;
  if (!orders) return <Loader />;
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary mt-4">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      {orders.map((o) => (
        <div key={o._id} className="card space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-semibold">#{o._id.slice(-6).toUpperCase()}</span>
            <span className="text-slate-500">{formatDate(o.createdAt)} · {o.shopId?.shopName}</span>
            <Badge>{o.status}</Badge>
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            {o.items.map((i) => (
              <li key={i.productId} className="flex justify-between py-1.5"><span>{i.title} × {i.quantity}</span><span>{formatPrice(i.price * i.quantity)}</span></li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-2 text-sm"><span className="text-slate-500">{o.paymentMethod}</span><span className="font-bold">{formatPrice(o.totalPrice)}</span></div>
        </div>
      ))}
    </div>
  );
}
