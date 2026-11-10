import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../features/auth/authSlice';
import { ErrorMsg } from '../../components/common/ui';
import { homeFor } from '../../utils/format';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', shopName: '', description: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (user) navigate(homeFor(user.role), { replace: true }); }, [user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Create your account</h1>
      <form onSubmit={onSubmit} className="card space-y-4">
        <ErrorMsg>{error}</ErrorMsg>

        <div className="grid grid-cols-2 gap-2">
          {[['customer', 'I want to shop'], ['seller', 'I want to sell']].map(([value, text]) => (
            <label key={value} className={`cursor-pointer rounded-lg border p-2 text-center text-sm ${form.role === value ? 'border-indigo-600 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-300'}`}>
              <input type="radio" className="sr-only" name="role" value={value} checked={form.role === value} onChange={set('role')} />
              {text}
            </label>
          ))}
        </div>

        <div>
          <label className="label">Name</label>
          <input className="input" required value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required minLength={6} value={form.password} onChange={set('password')} />
        </div>

        {form.role === 'seller' && (
          <>
            <div>
              <label className="label">Shop name</label>
              <input className="input" required value={form.shopName} onChange={set('shopName')} />
            </div>
            <div>
              <label className="label">Shop description</label>
              <textarea className="input" rows={2} value={form.description} onChange={set('description')} />
            </div>
          </>
        )}

        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
