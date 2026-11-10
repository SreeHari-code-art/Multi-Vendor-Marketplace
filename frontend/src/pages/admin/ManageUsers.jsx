import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { DashboardTabs, ADMIN_TABS, Loader, ErrorMsg } from '../../components/common/ui';
import { formatDate, errMsg } from '../../utils/format';

export default function ManageUsers() {
  const me = useSelector((s) => s.auth.user);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const changeRole = async (u, role) => {
    setError('');
    try {
      const { data } = await api.put(`/admin/users/${u._id}/role`, { role });
      setUsers((list) => list.map((x) => (x._id === u._id ? data : x)));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const remove = async (u) => {
    const extra = u.role === 'seller' ? ' This also deletes their shop and products.' : '';
    if (!window.confirm(`Delete ${u.name}?${extra}`)) return;
    setError('');
    try {
      await api.delete(`/admin/users/${u._id}`);
      setUsers((list) => list.filter((x) => x._id !== u._id));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <DashboardTabs tabs={ADMIN_TABS} />
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <ErrorMsg>{error}</ErrorMsg>
      {!users ? !error && <Loader /> : (
        <div className="card mt-2 overflow-x-auto !p-0">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Name</th><th className="th">Email</th><th className="th">Role</th><th className="th">Joined</th><th className="th" /></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isMe = u._id === me._id;
                return (
                  <tr key={u._id}>
                    <td className="td font-medium">{u.name}{isMe && <span className="ml-1 text-xs text-slate-400">(you)</span>}</td>
                    <td className="td text-slate-500">{u.email}</td>
                    <td className="td">
                      {u.role === 'seller' || isMe ? <span className="capitalize">{u.role}</span> : (
                        <select className="input !w-32 !py-1" value={u.role} onChange={(e) => changeRole(u, e.target.value)}>
                          <option value="customer">customer</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td>
                    <td className="td text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="td text-right">{!isMe && <button className="btn btn-danger btn-sm" onClick={() => remove(u)}>Delete</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
