import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { clearCart, selectCartTotal } from '../../features/cart/cartSlice';
import { ErrorMsg } from '../../components/common/ui';
import { formatPrice, errMsg } from '../../utils/format';

const STEPS = ['Shipping', 'Review & pay', 'Done'];

export default function Checkout() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', address: '', city: '', postalCode: '', country: 'India' });
  const [payment, setPayment] = useState('Cash on Delivery');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const set = (k) => (e) => setAddress({ ...address, [k]: e.target.value });

  const placeOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: payment,
      });
      setOrders(data);
      dispatch(clearCart());
      setStep(2);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && step !== 2) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary mt-4">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-6 flex items-center gap-2 text-sm">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex-1 rounded-lg px-3 py-2 text-center ${i === step ? 'bg-indigo-600 text-white' : i < step ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form className="card space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Full name</label><input className="input" required value={address.fullName} onChange={set('fullName')} /></div>
            <div><label className="label">Phone</label><input className="input" required value={address.phone} onChange={set('phone')} /></div>
          </div>
          <div><label className="label">Address</label><input className="input" required value={address.address} onChange={set('address')} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="label">City</label><input className="input" required value={address.city} onChange={set('city')} /></div>
            <div><label className="label">Postal code</label><input className="input" required value={address.postalCode} onChange={set('postalCode')} /></div>
            <div><label className="label">Country</label><input className="input" required value={address.country} onChange={set('country')} /></div>
          </div>
          <button className="btn btn-primary w-full">Continue to review</button>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Order review</h2>
            <ul className="divide-y divide-slate-100 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between py-2">
                  <span>{i.title} × {i.quantity}</span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <div className="card text-sm">
            <div className="mb-1 flex justify-between"><h3 className="font-semibold">Ship to</h3><button className="text-indigo-600 hover:underline" onClick={() => setStep(0)}>Edit</button></div>
            <p>{address.fullName} · {address.phone}</p>
            <p>{address.address}, {address.city} {address.postalCode}, {address.country}</p>
          </div>

          <div className="card space-y-2">
            <h3 className="font-semibold">Payment</h3>
            {['Cash on Delivery', 'Simulated'].map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="payment" checked={payment === m} onChange={() => setPayment(m)} />
                {m === 'Simulated' ? 'Simulated payment (no real charge)' : m}
              </label>
            ))}
          </div>

          <ErrorMsg>{error}</ErrorMsg>
          <div className="flex gap-3">
            <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
            <button className="btn btn-primary flex-1" disabled={placing} onClick={placeOrder}>{placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-3 text-center">
          <p className="text-4xl">🎉</p>
          <h2 className="text-xl font-bold">Order placed!</h2>
          <p className="text-sm text-slate-500">
            {orders.length > 1 ? `Your items ship from ${orders.length} different shops, so they were split into ${orders.length} orders.` : 'Thanks for shopping with us.'}
          </p>
          <ul className="text-sm text-slate-600">
            {orders.map((o) => <li key={o._id}>#{o._id.slice(-6).toUpperCase()} · {formatPrice(o.totalPrice)}</li>)}
          </ul>
          <Link to="/orders" className="btn btn-primary">View my orders</Link>
        </div>
      )}
    </div>
  );
}
