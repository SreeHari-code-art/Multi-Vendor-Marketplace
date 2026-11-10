import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { DashboardTabs, SELLER_TABS, Stat, Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatPrice, formatDate, errMsg } from '../../utils/format';

const LOW_STOCK = 5;

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [shopForm, setShopForm] = useState({ shopName: '', description: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/shops/me'), api.get('/products/mine'), api.get('/orders/seller')])
      .then(([shop, products, orders]) => {
        setData({ shop: shop.data, products: products.data, orders: orders.data });
        setShopForm({ shopName: shop.data.shopName, description: shop.data.description });
      })
      .catch((e) => setError(errMsg(e)));
  }, []);

  const saveShop = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data: shop } = await api.put('/shops/me', shopForm);
      setData((d) => ({ ...d, shop }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (!data) return <>{error ? <ErrorMsg>{error}</ErrorMsg> : <Loader />}</>;
  const { shop, products, orders } = data;
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK);
  const revenue = orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div>
      <DashboardTabs tabs={SELLER_TABS} />
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">{shop.shopName}</h1>
        <Badge>{shop.isVerified ? 'Verified' : 'Unverified'}</Badge>
      </div>
      {!shop.isVerified && <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Your shop is awaiting admin verification. You can still add products and manage orders.</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={products.length} />
        <Stat label="Low stock" value={lowStock.length} hint={`${LOW_STOCK} or fewer left`} />
        <Stat label="Pending orders" value={orders.filter((o) => o.status === 'Pending').length} hint={`${orders.length} total`} />
        <Stat label="Revenue" value={formatPrice(revenue)} hint="Delivered orders" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 font-semibold">Recent orders</h2>
          {orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : (
            <ul className="divide-y divide-slate-100 text-sm">
              {orders.slice(0, 5).map((o) => (
                <li key={o._id} className="flex items-center justify-between py-2">
                  <span>#{o._id.slice(-6).toUpperCase()} · {o.customerId?.name} · {formatDate(o.createdAt)}</span>
                  <span className="flex items-center gap-2">{formatPrice(o.totalPrice)} <Badge>{o.status}</Badge></span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/seller/orders" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">Manage orders →</Link>
        </section>

        <section className="card">
          <h2 className="mb-3 font-semibold">Shop profile</h2>
          <form onSubmit={saveShop} className="space-y-3">
            <ErrorMsg>{error}</ErrorMsg>
            <div><label className="label">Shop name</label><input className="input" required value={shopForm.shopName} onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })} /></div>
            <div><label className="label">Description</label><textarea className="input" rows={3} value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} /></div>
            <button className="btn btn-primary">{saved ? '✓ Saved' : 'Save changes'}</button>
          </form>
        </section>
      </div>

      {lowStock.length > 0 && (
        <section className="card mt-6">
          <h2 className="mb-3 font-semibold">Low-stock alerts</h2>
          <ul className="text-sm">
            {lowStock.map((p) => <li key={p._id} className="flex justify-between py-1"><span>{p.title}</span><span className={p.stock === 0 ? 'text-red-600' : 'text-amber-600'}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</span></li>)}
          </ul>
          <Link to="/seller/products" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">Restock →</Link>
        </section>
      )}
    </div>
  );
}
