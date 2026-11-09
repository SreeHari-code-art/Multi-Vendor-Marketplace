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
            <CheckCircle2 className=" " />
            <span>Delivered</span>
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="info" className="gap-1">
            <Truck className=" " />
            <span>Shipped</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="primary" className="gap-1">
            <Clock className=" " />
            <span>Processing</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" className="gap-1">
            <XCircle className=" " />
            <span>Cancelled</span>
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className=" " />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-dark">My Orders</h1>
          <p className="small text-secondary mt-1">
            Check the status and details of all your purchases
          </p>
        </div>
        <Link to="/products" className="btn btn-secondary d-inline-flex align-items-center gap-2 small py-2 px-3 align-self-start align-self-sm-auto">
          <ArrowLeft className=" " />
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
        <div className="mw-100 mx-auto py-5 text-center vstack gap-3 bg-white rounded-3 border border-secondary-subtle p-5">
          <div className="  bg-body-tertiary text-secondary rounded-pill d-flex align-items-center justify-content-center mx-auto">
            <Package className=" " />
          </div>
          <div className="vstack gap-1">
            <h3 className="fs-5 fw-bold text-dark">You have no orders yet</h3>
            <p className="small text-secondary">
              Once you place your first order, it will appear here.
            </p>
          </div>
          <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 small py-2 px-3">
            <ShoppingBag className=" " />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="vstack gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden border-secondary "
            >
              {/* Order Card Header */}
              <div className="bg-body-tertiary px-4 py-3 border-bottom border-secondary-subtle d-flex flex-wrap align-items-center justify-content-between gap-3 small">
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <div>
                    <span className="text-secondary d-block">Order ID:</span>
                    <span className="font-monospace fw-bold text-dark text-uppercase">#{order._id.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="text-secondary d-block">Date:</span>
                    <span className="fw-semibold text-dark">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-secondary d-block">Total:</span>
                    <span className="fw-bold text-primary">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  {getStatusBadge(order.status || order.orderStatus)}
                </div>
              </div>

              {/* Lista compacta de artículos en la orden */}
              <div className="p-4  ">
                {(order.orderItems || []).map((item, idx) => (
                  <div key={idx} className="py-3 pt-0 pb-0 d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="  object-fit-cover rounded-3 bg-body-tertiary flex-shrink-0 border border-secondary-subtle"
                        />
                      ) : (
                        <div className="  bg-body-tertiary rounded-3 d-flex align-items-center justify-content-center text-secondary flex-shrink-0">
                          <Package className=" " />
                        </div>
                      )}
                      <div>
                        <h4 className="small fw-semibold text-dark ">{item.name}</h4>
                        <p className="small text-secondary mt-1">
                          Quantity: <strong className="text-body">{item.quantity}</strong> × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <span className="small fw-bold text-dark flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pie de la tarjeta */}
              <div className="bg-body-tertiary px-4 py-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between small">
                <span className="text-secondary">
                  Método de pago: <strong className="text-body text-capitalize">{order.paymentMethod || 'Tarjeta'}</strong>
                </span>
                <span className="text-primary fw-semibold d-inline-flex align-items-center gap-1  ">
                  <span>Ver detalles completos</span>
                  <ChevronRight className="   " />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};