import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/auth/authSlice';
import { ErrorMsg } from '../../components/common/ui';
import { homeFor } from '../../utils/format';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || homeFor(user.role), { replace: true });
  }, [user, navigate, location]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Welcome back</h1>
      <form onSubmit={onSubmit} className="card space-y-4">
        <ErrorMsg>{error}</ErrorMsg>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        New here? <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
