import { useEffect, useState } from 'react';
import api from '../../services/api';
import { DashboardTabs, SELLER_TABS, Loader, ErrorMsg } from '../../components/common/ui';
import { ProductImage } from '../../components/product/ProductCard';
import { formatPrice, errMsg } from '../../utils/format';

const EMPTY = { title: '', description: '', price: '', stock: '', category: '', image: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(null); // null = closed; object = add/edit form
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/products/mine').then((r) => setProducts(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditingId(null); setForm(EMPTY); setError(''); };
  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({ title: p.title, description: p.description, price: p.price, stock: p.stock, category: p.category, image: p.image });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, body);
      else await api.post('/products', body);
      setForm(null);
      await load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      setProducts((list) => list.filter((x) => x._id !== p._id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  // Inventory: edit stock inline, saved on blur.
  const onStockBlur = async (p, value) => {
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0 || stock === p.stock) return;
    try {
      const { data } = await api.put(`/products/${p._id}`, { stock });
      setProducts((list) => list.map((x) => (x._id === p._id ? data : x)));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div>
      <DashboardTabs tabs={SELLER_TABS} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products & inventory</h1>
        {!form && <button className="btn btn-primary" onClick={openNew}>+ Add product</button>}
      </div>

      {form && (
        <form onSubmit={onSubmit} className="card mb-6 space-y-4">
          <h2 className="font-semibold">{editingId ? 'Edit product' : 'New product'}</h2>
          <ErrorMsg>{error}</ErrorMsg>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Title</label><input className="input" required value={form.title} onChange={set('title')} /></div>
            <div><label className="label">Category</label><input className="input" placeholder="e.g. Electronics" value={form.category} onChange={set('category')} /></div>
            <div><label className="label">Price</label><input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} /></div>
            <div><label className="label">Stock</label><input className="input" type="number" min="0" step="1" required value={form.stock} onChange={set('stock')} /></div>
          </div>
          <div><label className="label">Image URL</label><input className="input" type="url" placeholder="https://…" value={form.image} onChange={set('image')} /></div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={set('description')} /></div>
          <div className="flex gap-2">
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update product' : 'Create product'}</button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {!form && <ErrorMsg>{error}</ErrorMsg>}
      {!products ? <Loader /> : products.length === 0 ? (
        <p className="py-10 text-center text-slate-500">You haven't added any products yet.</p>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Product</th><th className="th">Category</th><th className="th">Price</th><th className="th">Stock</th><th className="th" /></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="td"><div className="flex items-center gap-3"><ProductImage product={p} className="h-10 w-10 rounded" /><span className="font-medium">{p.title}</span></div></td>
                  <td className="td text-slate-500">{p.category}</td>
                  <td className="td">{formatPrice(p.price)}</td>
                  <td className="td">
                    <input key={p.stock} type="number" min="0" defaultValue={p.stock} onBlur={(e) => onStockBlur(p, e.target.value)}
                      className={`input !w-20 !py-1 ${p.stock <= 5 ? '!border-amber-400' : ''}`} />
                  </td>
                  <td className="td text-right"><button className="btn btn-outline btn-sm mr-2" onClick={() => openEdit(p)}>Edit</button><button className="btn btn-danger btn-sm" onClick={() => onDelete(p)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
