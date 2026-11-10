import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setQuantity, removeFromCart, selectCartTotal } from '../../features/cart/cartSlice';
import { ProductImage } from '../../components/product/ProductCard';
import { formatPrice } from '../../utils/format';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-500">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary mt-4">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Shopping cart</h1>
        {items.map((i) => (
          <div key={i.productId} className="card flex items-center gap-4">
            <ProductImage product={i} className="h-20 w-20 rounded-lg" />
            <div className="flex-1">
              <Link to={`/products/${i.productId}`} className="font-medium hover:text-indigo-600">{i.title}</Link>
              {i.shopName && <p className="text-xs text-slate-500">by {i.shopName}</p>}
              <p className="text-sm text-slate-600">{formatPrice(i.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: i.quantity - 1 }))}>−</button>
              <span className="w-6 text-center text-sm">{i.quantity}</span>
              <button className="btn btn-outline btn-sm" disabled={i.quantity >= i.stock} onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: i.quantity + 1 }))}>+</button>
            </div>
            <p className="w-24 text-right font-semibold">{formatPrice(i.price * i.quantity)}</p>
            <button className="text-slate-400 hover:text-red-600" aria-label="Remove" onClick={() => dispatch(removeFromCart(i.productId))}>✕</button>
          </div>
        ))}
      </div>

      <aside className="card h-fit space-y-3">
        <h2 className="font-semibold">Order summary</h2>
        <div className="flex justify-between text-sm"><span>Items</span><span>{items.reduce((n, i) => n + i.quantity, 0)}</span></div>
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
        <button className="btn btn-primary w-full" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
      </aside>
    </div>
  );
}
