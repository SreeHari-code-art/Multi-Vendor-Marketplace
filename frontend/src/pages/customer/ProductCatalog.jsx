import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../../features/products/productSlice';
import ProductCard from '../../components/product/ProductCard';
import { Loader, ErrorMsg } from '../../components/common/ui';

export default function ProductCatalog() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items, categories, status, error, page, pages, total } = useSelector((s) => s.products);

  const qs = params.toString();
  const [local, setLocal] = useState({ search: '', minPrice: '', maxPrice: '' });

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProducts(Object.fromEntries(new URLSearchParams(qs))));
    setLocal({ search: params.get('search') || '', minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs, dispatch]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  const onApply = (e) => {
    e.preventDefault();
    update(local);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside>
        <form onSubmit={onApply} className="card space-y-3">
          <div>
            <label className="label">Search</label>
            <input className="input" value={local.search} onChange={(e) => setLocal({ ...local, search: e.target.value })} placeholder="Keyword" />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={params.get('category') || ''} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Price range</label>
            <div className="flex gap-2">
              <input className="input" type="number" min="0" placeholder="Min" value={local.minPrice} onChange={(e) => setLocal({ ...local, minPrice: e.target.value })} />
              <input className="input" type="number" min="0" placeholder="Max" value={local.maxPrice} onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Sort by</label>
            <select className="input" value={params.get('sort') || 'newest'} onChange={(e) => update({ sort: e.target.value })}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1">Apply</button>
            <button type="button" className="btn btn-outline" onClick={() => setParams({})}>Clear</button>
          </div>
        </form>
      </aside>

      <section>
        <p className="mb-3 text-sm text-slate-500">{status === 'succeeded' ? `${total} product${total === 1 ? '' : 's'}` : ' '}</p>
        {status === 'loading' ? <Loader /> : error ? <ErrorMsg>{error}</ErrorMsg> : items.length === 0 ? (
          <p className="py-10 text-center text-slate-500">No products match your filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}

        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="btn btn-outline" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>← Prev</button>
            <span className="text-sm text-slate-500">Page {page} of {pages}</span>
            <button className="btn btn-outline" disabled={page >= pages} onClick={() => update({ page: String(page + 1) })}>Next →</button>
          </div>
        )}
      </section>
    </div>
  );
}
