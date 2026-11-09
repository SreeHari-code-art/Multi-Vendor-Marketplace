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
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body-tertiary">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-flex flex-column gap-5 bg-white p-5 rounded-3 shadow-sm border border-secondary-subtle">
        
        {/* Form Header */}
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center   rounded-3 bg-primary-subtle text-primary mb-3">
            <Store className=" " />
          </div>
          <h2 className="fs-3 fw-bold text-dark ">
            Welcome back!
          </h2>
          <p className="mt-2 small text-secondary">
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
        <form className="mt-5 vstack gap-4" onSubmit={handleSubmit}>
          <div className="vstack gap-3">
            
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <span className="small text-primary text-decoration-underline ">
                  Forgot your password?
                </span>
              </div>
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

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 small"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <LogIn className=" " />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Registration Footer */}
        <div className="text-center pt-3 border-top border-secondary-subtle">
          <p className="small text-secondary">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="fw-semibold text-primary text-primary">
              Create one here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};