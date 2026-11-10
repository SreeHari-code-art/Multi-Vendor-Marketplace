import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/product/ProductCard';

export default function Wishlist() {
  const items = useSelector((s) => s.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-500">Your wishlist is empty.</p>
        <Link to="/products" className="btn btn-primary mt-4">Find something you like</Link>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Wishlist</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
    </div>
  );
}
