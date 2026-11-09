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
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body-tertiary">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-flex flex-column gap-5 bg-white p-5 rounded-3 shadow-sm border border-secondary-subtle">
        
        {/* Cabecera */}
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center   rounded-3 bg-primary-subtle text-primary mb-3">
            <Store className=" " />
          </div>
          <h2 className="fs-3 fw-bold text-dark ">
            Create your MultiMarket account
          </h2>
          <p className="mt-2 small text-secondary">
            Join our platform as a buyer or open your own store
          </p>
        </div>

        {/* Role Selection (Buyer vs Seller) */}
        <div className="row row-cols-2 g-3 p-2 bg-body-tertiary rounded-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'customer' }))}
            className={`d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 small fw-semibold  ${
              role === 'customer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-secondary text-dark'
            }`}
          >
            <ShoppingBag className=" " />
            <span>Buyer</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'seller' }))}
            className={`d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 small fw-semibold  ${
              role === 'seller'
                ? 'bg-white text-primary shadow-sm'
                : 'text-secondary text-dark'
            }`}
          >
            <Building className=" " />
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
        <form className="mt-4 vstack gap-3" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <div className="position-relative rounded-2 shadow-sm">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <User className=" " />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                placeholder="John Smith"
                className="form-control ps-5"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="position-relative rounded-2 shadow-sm">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Mail className=" " />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control ps-5"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Additional Fields for Sellers */}
          {role === 'seller' && (
            <div className="vstack gap-3 p-3 bg-primary-subtle rounded-3 border border-primary-subtle">
              <div className="mb-3 mb-0">
                <label htmlFor="shopName" className="form-label text-primary fw-semibold">
                  Your Store Name *
                </label>
                <div className="position-relative rounded-2 shadow-sm">
                  <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-primary">
                    <Building className=" " />
                  </div>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required={role === 'seller'}
                    value={shopName}
                    onChange={handleChange}
                    placeholder="My Official Store"
                    className="form-control ps-5 border-primary-subtle  "
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3 mb-0">
                <label htmlFor="shopDescription" className="form-label text-primary">
                  Short Description (Optional)
                </label>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  rows="2"
                  value={shopDescription}
                  onChange={handleChange}
                  placeholder="Experts in electronics and gadgets..."
                  className="form-control border-primary-subtle  "
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="position-relative rounded-2 shadow-sm">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Lock className=" " />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control ps-5"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="position-relative rounded-2 shadow-sm">
              <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                <Lock className=" " />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control ps-5"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-100 d-flex align-items-center justify-content-center gap-2 py-3 small fw-medium rounded-3 text-white shadow-sm  ${
              role === 'seller'
                ? 'bg-primary-subtle  '
                : 'btn btn-primary'
            }`}
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <UserCheck className=" " />
                <span>{role === 'seller' ? 'Create Seller Account' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-3 border-top border-secondary-subtle">
          <p className="small text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-primary text-primary">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};