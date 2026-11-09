import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/auth/authSlice';
import { Alert, Spinner } from '../../components/common/ui';
import { Store, Mail, Lock, LogIn } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener estado de autenticación desde Redux
  const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);

  // Redirección si el usuario ya está autenticado
  const from = location.state?.from?.pathname || (
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'seller' ? '/seller/dashboard' : '/'
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, from, dispatch]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80">
        
        {/* Form Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="danger"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="form-input pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                  Forgot your password?
                </span>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Registration Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create one here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};