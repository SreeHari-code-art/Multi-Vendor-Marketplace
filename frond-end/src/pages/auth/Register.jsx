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

  // Detect role from URL query param (e.g., /register?role=seller)
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

  // Form State
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
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      {/* Changed bg-white to bg-body and text-dark to text-body for seamless theme compatibility */}
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-flex flex-column gap-4 bg-body p-4 p-sm-5 rounded-4 shadow-sm border border-secondary-subtle">
        
        {/* Header */}
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-3 bg-primary-subtle text-primary mb-3 shadow-sm">
            <Store size={28} />
          </div>
          <h2 className="fs-3 fw-bold text-body">
            Create your MultiMarket account
          </h2>
          <p className="mt-1 small text-secondary">
            Join our platform as a buyer or open your own store
          </p>
        </div>

        {/* Role Selection (Buyer vs Seller) */}
        <div className="row row-cols-2 g-2 p-2 bg-body-tertiary rounded-3 border border-secondary-subtle">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'customer' }))}
            className={`d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 small fw-semibold border-0 transition-all ${
              role === 'customer'
                ? 'bg-body text-primary shadow-sm border border-secondary-subtle'
                : 'bg-transparent text-secondary'
            }`}
          >
            <ShoppingBag size={18} />
            <span>Buyer</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'seller' }))}
            className={`d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 small fw-semibold border-0 transition-all ${
              role === 'seller'
                ? 'bg-body text-primary shadow-sm border border-secondary-subtle'
                : 'bg-transparent text-secondary'
            }`}
          >
            <Building size={18} />
            <span>Seller</span>
          </button>
        </div>

        {/* Error Alerts */}
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

        {/* Form */}
        <form className="vstack gap-3" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="form-label small fw-medium">
              Full Name
            </label>
            <div className="position-relative">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <User size={18} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                placeholder="John Smith"
                className="form-control ps-5 py-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="form-label small fw-medium">
              Email Address
            </label>
            <div className="position-relative">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control ps-5 py-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Additional Fields for Sellers */}
          {role === 'seller' && (
            <div className="vstack gap-3 p-3 bg-body-tertiary rounded-3 border border-primary-subtle">
              <div>
                <label htmlFor="shopName" className="form-label small fw-semibold text-primary">
                  Your Store Name *
                </label>
                <div className="position-relative">
                  <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-primary">
                    <Building size={18} />
                  </div>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required={role === 'seller'}
                    value={shopName}
                    onChange={handleChange}
                    placeholder="My Official Store"
                    className="form-control ps-5 py-2"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="shopDescription" className="form-label small fw-medium text-body">
                  Short Description (Optional)
                </label>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  rows="2"
                  value={shopDescription}
                  onChange={handleChange}
                  placeholder="Experts in electronics and gadgets..."
                  className="form-control py-2"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor="password" className="form-label small fw-medium">
              Password
            </label>
            <div className="position-relative">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control ps-5 py-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="form-label small fw-medium">
              Confirm Password
            </label>
            <div className="position-relative">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Lock size={18} />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control ps-5 py-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-100 d-flex align-items-center justify-content-center gap-2 py-3 small fw-medium rounded-3 btn btn-primary shadow-sm mt-2"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <UserCheck size={18} />
                <span>{role === 'seller' ? 'Create Seller Account' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-3 border-top border-secondary-subtle">
          <p className="small text-secondary mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-primary text-decoration-none">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;