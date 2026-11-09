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
      <div className="mw-100 mx-auto px-3 py-5 text-center vstack gap-4">
        <div className="  bg-primary-subtle text-primary rounded-pill d-flex align-items-center justify-content-center mx-auto">
          <ShoppingBag className=" " />
        </div>
        <div className="vstack gap-2">
          <h2 className="fs-3 fw-bold text-dark">Your cart is empty</h2>
          <p className="small text-secondary mw-100 mx-auto">
            It looks like you haven&apos;t added any products yet. Explore our catalog and discover great deals!
          </p>
        </div>
        <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-3">
          <ArrowLeft className=" " />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-dark">Shopping Cart</h1>
          <p className="small text-secondary mt-1">
            You have <strong className="text-dark">{totalQuantity}</strong> {totalQuantity === 1 ? 'item' : 'items'} in your order
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="small fw-semibold text-danger text-danger-emphasis d-flex align-items-center gap-2 "
        >
          <Trash2 className=" " />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="row row-cols-1 row-cols-lg-3 g-5 align-items-start">
        
        {/* ==========================================
            1. Lista de Productos en el Carrito
            ========================================== */}
        <div className="col-lg-8 vstack gap-3">
          {cartItems.map((item) => {
            const itemImage = item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

            return (
              <div 
                key={item._id}
                className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between p-3 bg-white rounded-3 border border-secondary-subtle shadow-sm gap-3"
              >
                {/* Imagen e Información */}
                <div className="d-flex align-items-center gap-3 flex-fill">
                  <img 
                    src={itemImage} 
                    alt={item.name} 
                    className="  object-fit-cover rounded-3 bg-body-tertiary flex-shrink-0"
                  />
                  <div className="vstack gap-1">
                    <span className="small fw-semibold text-primary d-flex align-items-center gap-1">
                      <Store className=" " />
                      {item.shop?.name || 'Official Store'}
                    </span>
                    <h3 className="small fw-semibold text-dark ">
                      <Link to={`/products/${item._id}`} className="text-primary ">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="small text-secondary">
                      Precio unitario: <strong className="text-body">{formatCurrency(item.price)}</strong>
                    </p>
                  </div>
                </div>

                {/* Controles de Cantidad y Subtotal */}
                <div className="d-flex align-items-center justify-content-between w-100  gap-4 border-top border-top-0 pt-3 pt-sm-0">
                  {/* Selector de cantidad */}
                  <div className="d-flex align-items-center border border-secondary-subtle rounded-3 bg-white">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, -1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-secondary bg-secondary-subtle  "
                      title="Decrease quantity"
                    >
                      <Minus className=" " />
                    </button>
                    <span className="px-3 py-1 small fw-bold text-dark  text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 text-secondary bg-secondary-subtle  "
                      title="Increase quantity"
                    >
                      <Plus className=" " />
                    </button>
                  </div>

                  {/* Subtotal por ítem */}
                  <div className="text-end ">
                    <span className="small text-secondary d-block d-sm-none">Subtotal</span>
                    <span className="small fw-bold text-dark">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-secondary text-danger bg-danger-subtle rounded-3 "
                    title="Remove product"
                  >
                    <Trash2 className=" " />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link to="/products" className="d-inline-flex align-items-center gap-2 small fw-medium text-primary text-primary">
              <ArrowLeft className=" " />
              <span>Continue shopping</span>
            </Link>
          </div>
        </div>

        {/* ==========================================
            2. Resumen del Pedido (Checkout Sidebar)
            ========================================== */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-4">
          <h3 className="fs-5 fw-bold text-dark border-bottom pb-3">Order Summary</h3>

          <div className="vstack gap-3 small">
            <div className="d-flex align-items-center justify-content-between text-secondary">
              <span>Subtotal ({totalQuantity} ítems)</span>
              <span className="fw-semibold text-dark">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between text-secondary">
              <span>Envío estimado</span>
              <span className="text-success fw-semibold">GRATIS</span>
            </div>
            <div className="d-flex align-items-center justify-content-between text-secondary">
              <span>Impuestos calculados</span>
              <span className="text-dark fw-semibold">Incluidos</span>
            </div>

            <div className="border-top border-secondary-subtle pt-3 d-flex align-items-center justify-content-between">
              <span className=" fw-bold text-dark">Total a Pagar</span>
              <span className="fs-4 fw-bolder text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-100 btn btn-primary py-3 d-flex align-items-center justify-content-center gap-2 small shadow"
          >
            <span>Procesar Pago</span>
            <ArrowRight className=" " />
          </button>

          <div className="d-flex align-items-center justify-content-center gap-2 small text-secondary pt-2 border-top border-secondary-subtle">
            <ShieldCheck className="  text-success" />
            <span>Garantía de Pago Seguro SSL</span>
          </div>
        </div>

      </div>

    </div>
  );
};