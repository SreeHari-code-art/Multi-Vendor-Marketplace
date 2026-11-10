import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../../features/products/productSlice';
import ProductCard from '../../components/product/ProductCard';
import { Loader, ErrorMsg } from '../../components/common/ui';

export default function Home() {
  const dispatch = useDispatch();
  const { items, categories, status, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold md:text-4xl">One marketplace. Many independent shops.</h1>
        <p className="mt-2 max-w-xl text-indigo-100">Discover products from verified sellers, all in a single cart.</p>
        <Link to="/products" className="btn mt-5 bg-white text-indigo-700 hover:bg-indigo-50">Browse products</Link>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Shop by category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="btn btn-outline">{c}</Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest products</h2>
          <Link to="/products" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        {status === 'loading' ? <Loader /> : error ? <ErrorMsg>{error}</ErrorMsg> : items.length === 0 ? (
          <p className="text-slate-500">No products yet. Run <code>npm run seed</code> in the backend to add demo data.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>
    </div>
  );
}
