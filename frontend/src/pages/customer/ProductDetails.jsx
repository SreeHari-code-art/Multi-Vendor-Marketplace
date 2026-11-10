import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { ProductImage } from '../../components/product/ProductCard';
import { Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatPrice, errMsg } from '../../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = useSelector((s) => s.wishlist.items.some((i) => i._id === id));

  useEffect(() => {
    setProduct(null);
    setError('');
    setQty(1);
    api.get(`/products/${id}`).then((r) => setProduct(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  if (error) return <ErrorMsg>{error}</ErrorMsg>;
  if (!product) return <Loader />;

  const out = product.stock <= 0;
  const onAdd = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ProductImage product={product} className="h-80 w-full rounded-xl md:h-[26rem]" />
      <div className="space-y-4">
        <p className="text-sm text-slate-400">{product.category}</p>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-2xl font-semibold text-indigo-600">{formatPrice(product.price)}</p>
        <p className="text-slate-600">{product.description || 'No description provided.'}</p>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          Sold by <span className="font-medium text-slate-700">{product.shopId?.shopName}</span>
          <Badge>{product.shopId?.isVerified ? 'Verified' : 'Unverified'}</Badge>
        </div>

        <p className={`text-sm font-medium ${out ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
          {out ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input className="input !w-20" type="number" min="1" max={product.stock} value={qty} disabled={out}
            onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, product.stock)))} />
          <button className="btn btn-primary" disabled={out} onClick={onAdd}>{added ? '✓ Added' : 'Add to cart'}</button>
          <button className="btn btn-outline" onClick={() => dispatch(toggleWishlist(product))}>{wished ? '♥ In wishlist' : '♡ Add to wishlist'}</button>
        </div>
        <Link to="/products" className="inline-block text-sm text-indigo-600 hover:underline">← Back to products</Link>
      </div>
    </div>
  );
}
