import { useEffect, useState } from 'react';
import api from '../../services/api';
import { DashboardTabs, ADMIN_TABS, Loader, ErrorMsg, Badge } from '../../components/common/ui';
import { formatDate, errMsg } from '../../utils/format';

export default function ManageShops() {
  const [shops, setShops] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/shops').then((r) => setShops(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const toggle = async (shop) => {
    setError('');
    try {
      const { data } = await api.put(`/admin/shops/${shop._id}/verify`, { isVerified: !shop.isVerified });
      setShops((list) => list.map((s) => (s._id === shop._id ? data : s)));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <DashboardTabs tabs={ADMIN_TABS} />
      <h1 className="mb-4 text-2xl font-bold">Shops</h1>
      <ErrorMsg>{error}</ErrorMsg>
      {!shops ? !error && <Loader /> : shops.length === 0 ? <p className="py-10 text-center text-slate-500">No shops registered yet.</p> : (
        <div className="card mt-2 overflow-x-auto !p-0">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Shop</th><th className="th">Owner</th><th className="th">Created</th><th className="th">Status</th><th className="th" /></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {shops.map((s) => (
                <tr key={s._id}>
                  <td className="td"><p className="font-medium">{s.shopName}</p><p className="max-w-xs truncate text-xs text-slate-500">{s.description}</p></td>
                  <td className="td">{s.ownerId?.name}<p className="text-xs text-slate-500">{s.ownerId?.email}</p></td>
                  <td className="td text-slate-500">{formatDate(s.createdAt)}</td>
                  <td className="td"><Badge>{s.isVerified ? 'Verified' : 'Unverified'}</Badge></td>
                  <td className="td text-right"><button className={`btn btn-sm ${s.isVerified ? 'btn-outline' : 'btn-primary'}`} onClick={() => toggle(s)}>{s.isVerified ? 'Revoke' : 'Verify'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
