import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { formatPrice } from '../../utils/format';

export function ProductImage({ product, className = '' }) {
  return product.image ? (
    <img src={product.image} alt={product.title} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-slate-200 text-4xl text-slate-400 ${className}`}>{product.title?.[0]}</div>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wished = useSelector((s) => s.wishlist.items.some((i) => i._id === product._id));
  const out = product.stock <= 0;

  return (
    <div className="card flex flex-col overflow-hidden !p-0">
      <Link to={`/products/${product._id}`} className="relative block">
        <ProductImage product={product} className="h-44 w-full" />
        {out && <span className="absolute left-2 top-2 rounded bg-slate-800 px-2 py-0.5 text-xs text-white">Out of stock</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-slate-400">{product.category}</p>
        <Link to={`/products/${product._id}`} className="line-clamp-2 font-medium hover:text-indigo-600">{product.title}</Link>
        {product.shopId?.shopName && <p className="text-xs text-slate-500">by {product.shopId.shopName}</p>}
        <p className="mt-auto pt-2 text-lg font-bold">{formatPrice(product.price)}</p>
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" disabled={out} onClick={() => dispatch(addToCart({ product }))}>Add to cart</button>
          <button className="btn btn-outline" aria-label="Toggle wishlist" onClick={() => dispatch(toggleWishlist(product))}>{wished ? '♥' : '♡'}</button>
        </div>
      </div>
    </div>
  );
}
