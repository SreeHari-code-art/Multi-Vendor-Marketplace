import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/format';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Store 
} from 'lucide-react';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (id, currentQty, stock, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1 && newQty <= stock) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      dispatch(clearCart());
    }
  };

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-3 py-5 text-center vstack gap-4 min-vh-75 justify-content-center">
        <div className="p-4 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
          <ShoppingBag size={36} />
        </div>
        <div className="vstack gap-2">
          <h2 className="fs-3 fw-bold text-body">Your cart is empty</h2>
          <p className="small text-secondary mw-100 mx-auto">
            It looks like you haven&apos;t added any products yet. Explore our catalog and discover great deals!
          </p>
        </div>
        <div>
          <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-3">
            <ArrowLeft size={18} />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-body">Shopping Cart</h1>
          <p className="small text-secondary mt-1 mb-0">
            You have <strong className="text-body">{totalQuantity}</strong> {totalQuantity === 1 ? 'item' : 'items'} in your order
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="btn btn-link text-danger text-decoration-none small fw-semibold d-flex align-items-center gap-2 p-0"
        >
          <Trash2 size={16} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="row row-cols-1 row-cols-lg-3 g-5 align-items-start">
        
        {/* ==========================================
            1. Cart Items List
            ========================================== */}
        <div className="col-lg-8 vstack gap-3">
          {cartItems.map((item) => {
            const itemImage = item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

            return (
              <div 
                key={item._id}
                className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between p-3 bg-body border border-secondary-subtle rounded-3 shadow-sm gap-3"
              >
                {/* Image and Info */}
                <div className="d-flex align-items-center gap-3 flex-fill">
                  <img 
                    src={itemImage} 
                    alt={item.name} 
                    className="object-fit-cover rounded-3 bg-body-tertiary flex-shrink-0"
                    style={{ width: '80px', height: '80px' }}
                  />
                  <div className="vstack gap-1">
                    <span className="small fw-semibold text-primary d-flex align-items-center gap-1">
                      <Store size={14} />
                      {item.shop?.name || 'Official Store'}
                    </span>
                    <h3 className="small fw-semibold mb-0">
                      <Link to={`/products/${item._id}`} className="text-body text-decoration-none">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="small text-secondary mb-0">
                      Unit Price: <strong className="text-body">{formatCurrency(item.price)}</strong>
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="d-flex align-items-center justify-content-between w-100 w-sm-auto gap-4 pt-3 pt-sm-0 border-top border-secondary-subtle border-top-sm-0">
                  {/* Quantity selector */}
                  <div className="d-flex align-items-center border border-secondary-subtle rounded-3 bg-body-secondary overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, -1)}
                      disabled={item.quantity <= 1}
                      className="btn btn-sm btn-link text-body text-decoration-none px-2 py-1 rounded-0 border-0"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 small fw-bold text-body text-center" style={{ minWidth: '30px' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, 1)}
                      disabled={item.quantity >= item.stock}
                      className="btn btn-sm btn-link text-body text-decoration-none px-2 py-1 rounded-0 border-0"
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-end">
                    <span className="small text-secondary d-block d-sm-none">Subtotal</span>
                    <span className="small fw-bold text-body">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-danger bg-danger-subtle border-0 rounded-3"
                    title="Remove product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link to="/products" className="d-inline-flex align-items-center gap-2 small fw-medium text-primary text-decoration-none">
              <ArrowLeft size={16} />
              <span>Continue shopping</span>
            </Link>
          </div>
        </div>

        {/* ==========================================
            2. Order Summary Sidebar
            ========================================== */}
        <div className="col-lg-4">
          <div className="bg-body p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-4 sticky-top" style={{ top: '90px' }}>
            <h3 className="fs-5 fw-bold text-body border-bottom border-secondary-subtle pb-3 mb-0">Order Summary</h3>

            <div className="vstack gap-3 small">
              <div className="d-flex align-items-center justify-content-between text-secondary">
                <span>Subtotal ({totalQuantity} items)</span>
                <span className="fw-semibold text-body">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between text-secondary">
                <span>Estimated Shipping</span>
                <span className="text-success fw-semibold">FREE</span>
              </div>
              <div className="d-flex align-items-center justify-content-between text-secondary">
                <span>Calculated Taxes</span>
                <span className="text-body fw-semibold">Included</span>
              </div>

              <div className="border-top border-secondary-subtle pt-3 d-flex align-items-center justify-content-between">
                <span className="fw-bold text-body">Total Amount</span>
                <span className="fs-4 fw-bolder text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-100 btn btn-primary py-3 d-flex align-items-center justify-content-center gap-2 small shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="d-flex align-items-center justify-content-center gap-2 small text-secondary pt-2 border-top border-secondary-subtle">
              <ShieldCheck size={16} className="text-success" />
              <span>Secure SSL Payment Guarantee</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;