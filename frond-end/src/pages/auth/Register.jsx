import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../features/auth/authSlice';
import { Alert, Spinner } from '../../components/common/ui';
import { Store, Mail, Lock, User, Building, UserCheck, ShoppingBag } from 'lucide-react';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detectar si se especificó el rol en la URL (ej: /register?role=seller)
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'customer';

  const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' :
                         user.role === 'seller' ? '/seller/dashboard' : '/';
      navigate(redirectPath, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    shopName: '',
    shopDescription: '',
  });

  const [validationError, setValidationError] = useState('');

  const { name, email, password, confirmPassword, role, shopName, shopDescription } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (role === 'seller' && !shopName.trim()) {
      setValidationError('Store name is required for sellers.');
      return;
    }

    const payload = {
      name,
      email,
      password,
      role,
      ...(role === 'seller' && {
        shop: {
          name: shopName,
          description: shopDescription,
        },
      }),
    };

    dispatch(register(payload));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80">
        
        {/* Cabecera */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your MultiMarket account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform as a buyer or open your own store
          </p>
        </div>

        {/* Role Selection (Buyer vs Seller) */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'customer' }))}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              role === 'customer'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buyer</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'seller' }))}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              role === 'seller'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Seller</span>
          </button>
        </div>

        {/* Alertas de Error */}
        {(error || validationError) && (
          <Alert
            type="danger"
            message={validationError || error}
            onClose={() => {
              setValidationError('');
              dispatch(clearError());
            }}
          />
        )}

        {/* Formulario */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                placeholder="John Smith"
                className="form-input pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Additional Fields for Sellers */}
          {role === 'seller' && (
            <div className="space-y-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="form-group mb-0">
                <label htmlFor="shopName" className="form-label text-purple-900 font-semibold">
                  Your Store Name *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required={role === 'seller'}
                    value={shopName}
                    onChange={handleChange}
                    placeholder="My Official Store"
                    className="form-input pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label htmlFor="shopDescription" className="form-label text-purple-900">
                  Short Description (Optional)
                </label>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  rows="2"
                  value={shopDescription}
                  onChange={handleChange}
                  placeholder="Experts in electronics and gadgets..."
                  className="form-input border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg text-white shadow-sm transition-colors ${
              role === 'seller'
                ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>{role === 'seller' ? 'Create Seller Account' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};