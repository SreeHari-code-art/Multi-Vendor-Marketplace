import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import { Spinner, Badge, Alert, Pagination } from '../../components/common/ui';
import { 
  Package, 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Store,
  ArrowLeft
} from 'lucide-react';

export const MyOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(
    location.state?.orderSuccess || false
  );

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/orders/my-orders');
      // Ensure compatibility with direct or paginated backend responses
      const data = response.data?.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  // Map badges and visual variants based on order status
  const getStatusBadge = (status) => {
    const normalizedStatus = (status || 'pending').toLowerCase();
    
    switch (normalizedStatus) {
      case 'delivered':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Delivered</span>
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="info" className="gap-1">
            <Truck className="h-3 w-3" />
            <span>Shipped</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="primary" className="gap-1">
            <Clock className="h-3 w-3" />
            <span>Processing</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" className="gap-1">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Check the status and details of all your purchases
          </p>
        </div>
        <Link to="/products" className="btn-secondary inline-flex items-center gap-2 text-xs py-2.5 px-4 self-start sm:self-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Go to Catalog</span>
        </Link>
      </div>

      {/* Success Alert from Checkout */}
      {showSuccessAlert && (
        <Alert
          type="success"
          title="Order Placed Successfully!"
          message="We have received your order successfully. You can track its status from this section."
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Listado de Pedidos */}
      {orders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">You have no orders yet</h3>
            <p className="text-xs text-gray-500">
              Once you place your first order, it will appear here.
            </p>
          </div>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5">
            <ShoppingBag className="h-4 w-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Order Card Header */}
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-500 block">Order ID:</span>
                    <span className="font-mono font-bold text-gray-900 uppercase">#{order._id.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date:</span>
                    <span className="font-semibold text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total:</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status || order.orderStatus)}
                </div>
              </div>

              {/* Lista compacta de artículos en la orden */}
              <div className="p-6 divide-y divide-gray-100">
                {(order.orderItems || []).map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-gray-100 shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Quantity: <strong className="text-gray-700">{item.quantity}</strong> × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pie de la tarjeta */}
              <div className="bg-gray-50/40 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Método de pago: <strong className="text-gray-700 capitalize">{order.paymentMethod || 'Tarjeta'}</strong>
                </span>
                <span className="text-indigo-600 font-semibold inline-flex items-center gap-1 group cursor-pointer">
                  <span>Ver detalles completos</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};