import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice';
import api from '../../services/api';
import { formatCurrency } from '../../utils/format';
import { Alert, Spinner } from '../../components/common/ui';
import { 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag 
} from 'lucide-react';

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Estados del formulario de envío y pago
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fullName, phone, address, city, postalCode, country } = shippingAddress;

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!phone || !address || !city || !postalCode) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Preparar el payload de la orden para el backend
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0] || '',
        })),
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice: totalAmount,
        shippingPrice: 0, // Envío gratis por defecto
        totalPrice: totalAmount,
      };

      const response = await api.post('/orders', orderData);

      // Limpiar el carrito de compras tras una orden exitosa
      dispatch(clearCart());

      // Redirigir al historial de pedidos del cliente o confirmación
      const orderId = response.data?._id || response._id;
      navigate(orderId ? `/customer/orders/${orderId}` : '/customer/orders', { 
        state: { orderSuccess: true } 
      });

    } catch (err) {
      setError(err.message || 'Error processing the order. Please try again.');
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mw-100 mx-auto px-3 py-5 text-center vstack gap-4">
        <div className="  bg-primary-subtle text-primary rounded-pill d-flex align-items-center justify-content-center mx-auto">
          <ShoppingBag className=" " />
        </div>
        <div className="vstack gap-2">
          <h2 className="fs-3 fw-bold text-dark">No products to process</h2>
          <p className="small text-secondary mw-100 mx-auto">
            Your cart is empty. Add items before proceeding to payment.
          </p>
        </div>
        <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-3">
          <ArrowLeft className=" " />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="d-inline-flex align-items-center gap-2 small fw-medium text-secondary text-primary  mb-3">
          <ArrowLeft className=" " />
          <span>Back to Cart</span>
        </Link>
        <h1 className="fs-2 fw-bold text-dark">Checkout</h1>
        <p className="small text-secondary mt-1">
          Enter your shipping details and confirm your payment method
        </p>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handlePlaceOrder} className="row row-cols-1 row-cols-lg-3 g-5 align-items-start">
        
        {/* ==========================================
            1. Formulario de Envío y Pago
            ========================================== */}
        <div className="col-lg-8 vstack gap-5">
          
          {/* Section: Shipping Address */}
          <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-4">
            <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-3">
              <Truck className="  text-primary" />
              <span>Shipping Address</span>
            </h3>

            <div className="row row-cols-1 row-cols-sm-2 g-3">
              
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="position-relative rounded-2 shadow-sm">
                  <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                    <User className=" " />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="form-control ps-5"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Contact Phone</label>
                <div className="position-relative rounded-2 shadow-sm">
                  <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                    <Phone className=" " />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="form-control ps-5"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3 col-sm-12">
                <label htmlFor="address" className="form-label">Address (Street, house no., apt)</label>
                <div className="position-relative rounded-2 shadow-sm">
                  <div className="position-absolute top-0 bottom-0 start-0 ps-3 d-flex align-items-center pe-none text-secondary">
                    <MapPin className=" " />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={address}
                    onChange={handleChange}
                    placeholder="Tech Park Street, Block A"
                    className="form-control ps-5"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="form-control"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={postalCode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="form-control"
                  disabled={isLoading}
                />
              </div>

            </div>
          </div>

          {/* Section: Payment Method */}
          <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-3">
            <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-3">
              <CreditCard className="  text-primary" />
              <span>Payment Method</span>
            </h3>

            <div className="row row-cols-1 row-cols-sm-2 g-3">
              <label className={`d-flex align-items-center gap-3 p-3 rounded-3 border   ${
                paymentMethod === 'CARD' ? 'border-primary-subtle bg-primary-subtle' : 'border-secondary-subtle bg-body-tertiary'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary "
                />
                <div>
                  <span className="d-block small fw-semibold text-dark">Credit / Debit Card</span>
                  <span className="small text-secondary">Secure online payment</span>
                </div>
              </label>

              <label className={`d-flex align-items-center gap-3 p-3 rounded-3 border   ${
                paymentMethod === 'COD' ? 'border-primary-subtle bg-primary-subtle' : 'border-secondary-subtle bg-body-tertiary'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary "
                />
                <div>
                  <span className="d-block small fw-semibold text-dark">Cash on Delivery</span>
                  <span className="small text-secondary">Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* ==========================================
            2. Order Summary and Final Action
            ========================================== */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-4 sticky-top ">
          <h3 className="fs-5 fw-bold text-dark border-bottom pb-3">Order Summary</h3>

          {/* Compact item list */}
          <div className="vstack gap-3 overflow-auto overflow-y-auto pe-1">
            {cartItems.map((item) => (
              <div key={item._id} className="d-flex align-items-center justify-content-between small gap-3">
                <div className="d-flex align-items-center gap-2 text-truncate">
                  <span className="fw-bold text-secondary">{item.quantity}x</span>
                  <span className="text-body text-truncate">{item.name}</span>
                </div>
                <span className="fw-semibold text-dark flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-top border-secondary-subtle pt-3 vstack gap-2 small">
            <div className="d-flex align-items-center justify-content-between text-secondary">
              <span>Subtotal</span>
              <span className="fw-semibold text-dark">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between text-secondary">
              <span>Shipping</span>
              <span className="text-success fw-semibold">FREE</span>
            </div>

            <div className="border-top border-secondary-subtle pt-3 d-flex align-items-center justify-content-between">
              <span className=" fw-bold text-dark">Total to Pay</span>
              <span className="fs-4 fw-bolder text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-100 btn btn-primary py-3 d-flex align-items-center justify-content-center gap-2 small shadow"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <CheckCircle2 className=" " />
                <span>Place Order</span>
              </>
            )}
          </button>

          <div className="d-flex align-items-center justify-content-center gap-2 small text-secondary pt-2 border-top border-secondary-subtle">
            <ShieldCheck className="  text-success" />
            <span>Secure encrypted transaction</span>
          </div>

        </div>

      </form>

    </div>
  );
};