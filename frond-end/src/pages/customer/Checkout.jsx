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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">No products to process</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Your cart is empty. Add items before proceeding to payment.
          </p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your shipping details and confirm your payment method
        </p>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ==========================================
            1. Formulario de Envío y Pago
            ========================================== */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
              <Truck className="h-5 w-5 text-indigo-600" />
              <span>Shipping Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="form-input pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Contact Phone</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="form-input pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group sm:col-span-2">
                <label htmlFor="address" className="form-label">Address (Street, house no., apt)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={address}
                    onChange={handleChange}
                    placeholder="Tech Park Street, Block A"
                    className="form-input pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={postalCode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

            </div>
          </div>

          {/* Section: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <span>Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'CARD' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-900">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500">Secure online payment</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-900">Cash on Delivery</span>
                  <span className="text-xs text-gray-500">Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* ==========================================
            2. Order Summary and Final Action
            ========================================== */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Order Summary</h3>

          {/* Compact item list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-gray-500">{item.quantity}x</span>
                  <span className="text-gray-700 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900 shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total to Pay</span>
              <span className="text-xl font-extrabold text-indigo-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-sm shadow-md"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>Place Order</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure encrypted transaction</span>
          </div>

        </div>

      </form>

    </div>
  );
};