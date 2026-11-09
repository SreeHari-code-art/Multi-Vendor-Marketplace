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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            It looks like you haven&apos;t added any products yet. Explore our catalog and discover great deals!
          </p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <ArrowLeft className="h-4 w-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{totalQuantity}</strong> {totalQuantity === 1 ? 'item' : 'items'} in your order
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ==========================================
            1. Lista de Productos en el Carrito
            ========================================== */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemImage = item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

            return (
              <div 
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm gap-4"
              >
                {/* Imagen e Información */}
                <div className="flex items-center gap-4 flex-1">
                  <img 
                    src={itemImage} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                      <Store className="h-3 w-3" />
                      {item.shop?.name || 'Official Store'}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      <Link to={`/products/${item._id}`} className="hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Precio unitario: <strong className="text-gray-700">{formatCurrency(item.price)}</strong>
                    </p>
                  </div>
                </div>

                {/* Controles de Cantidad y Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Selector de cantidad */}
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 py-0.5 text-xs font-bold text-gray-900 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, item.stock, 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal por ítem */}
                  <div className="text-right min-w-[5.5rem]">
                    <span className="text-xs text-gray-400 block sm:hidden">Subtotal</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link to="/products" className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue shopping</span>
            </Link>
          </div>
        </div>

        {/* ==========================================
            2. Resumen del Pedido (Checkout Sidebar)
            ========================================== */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal ({totalQuantity} ítems)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Envío estimado</span>
              <span className="text-emerald-600 font-semibold">GRATIS</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Impuestos calculados</span>
              <span className="text-gray-900 font-semibold">Incluidos</span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total a Pagar</span>
              <span className="text-xl font-extrabold text-indigo-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <span>Procesar Pago</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Garantía de Pago Seguro SSL</span>
          </div>
        </div>

      </div>

    </div>
  );
};