import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import { Spinner, Badge, Alert, Modal } from '../../components/common/ui';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Edit3, 
  Filter, 
  Package, 
  User, 
  Phone, 
  MapPin 
} from 'lucide-react';

export const ManageOrders = () => {
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Estados para Modal de actualización de estado
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('processing');
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/seller/orders');
      const data = response.data?.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load your store orders.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'processing');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setError(null);

    try {
      await api.put(`/seller/orders/${selectedOrder._id}/status`, { status: newStatus });
      
      // Actualizar estado localmente
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord._id === selectedOrder._id ? { ...ord, status: newStatus } : ord
        )
      );

      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message || 'Could not update the order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const norm = (status || 'pending').toLowerCase();
    switch (norm) {
      case 'delivered':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className=" " /><span>Delivered</span></Badge>;
      case 'shipped':
        return <Badge variant="info" className="gap-1"><Truck className=" " /><span>Shipped</span></Badge>;
      case 'processing':
        return <Badge variant="primary" className="gap-1"><Clock className=" " /><span>Processing</span></Badge>;
      case 'cancelled':
        return <Badge variant="danger" className="gap-1"><XCircle className=" " /><span>Cancelled</span></Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" className="gap-1"><Clock className=" " /><span>Pending</span></Badge>;
    }
  };

  const filteredOrders = statusFilter 
    ? orders.filter((ord) => (ord.status || 'pending').toLowerCase() === statusFilter)
    : orders;

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
          <h1 className="fs-2 fw-bold text-dark">Order Management</h1>
          <p className="small text-secondary mt-1">
            Manage received orders and update delivery status for your customers
          </p>
        </div>

        {/* Status filter */}
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border border-secondary-subtle shadow-sm">
          <Filter className="  text-secondary" />
          <span className="small text-secondary fw-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="small fw-semibold text-dark bg-transparent border-0  text-capitalize  pe-3"
          >
            <option value="">All ({orders.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st} className="text-capitalize">{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle vstack gap-3">
          <ShoppingBag className="  text-secondary mx-auto" />
          <h3 className="fs-5 fw-semibold text-dark">No orders found</h3>
          <p className="small text-secondary mw-100 mx-auto">
            No orders are registered with the selected status filter.
          </p>
        </div>
      ) : (
        <div className="vstack gap-4">
          {filteredOrders.map((order) => {
            const customerName = order.user?.name || order.shippingAddress?.fullName || 'Cliente';
            const shipping = order.shippingAddress || {};

            return (
              <div 
                key={order._id}
                className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden"
              >
                {/* Cabecera de la Orden */}
                <div className="bg-body-tertiary px-4 py-3 border-bottom border-secondary-subtle d-flex flex-wrap align-items-center justify-content-between gap-3 small">
                  <div className="d-flex flex-wrap align-items-center gap-4">
                    <div>
                      <span className="text-secondary d-block">ID Pedido:</span>
                      <span className="font-monospace fw-bold text-dark text-uppercase">#{order._id.slice(-8)}</span>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Fecha:</span>
                      <span className="fw-semibold text-dark">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Total:</span>
                      <span className="fw-bold text-primary">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => handleOpenStatusModal(order)}
                      className="px-3 py-2 bg-primary-subtle bg-primary text-white rounded-3 fw-medium  d-inline-flex align-items-center gap-2 shadow-sm"
                    >
                      <Edit3 className=" " />
                      <span>Actualizar Estado</span>
                    </button>
                  </div>
                </div>

                {/* Información de Envío y Artículos */}
                <div className="p-4 row row-cols-1 row-cols-md-3 g-4 align-items-start">
                  
                  {/* Datos del Cliente y Envío */}
                  <div className="bg-body-tertiary p-3 rounded-3 border border-secondary-subtle vstack gap-2 small text-secondary">
                    <h4 className="fw-semibold text-dark text-uppercase  small mb-2">
                      Información de Envío
                    </h4>
                    <p className="d-flex align-items-center gap-2 fw-medium text-dark">
                      <User className="  text-primary" />
                      <span>{customerName}</span>
                    </p>
                    <p className="d-flex align-items-center gap-2">
                      <Phone className="  text-primary" />
                      <span>{shipping.phone || 'Teléfono no especificado'}</span>
                    </p>
                    <p className="d-flex align-items-start gap-2">
                      <MapPin className="  text-primary flex-shrink-0 mt-1" />
                      <span>{shipping.address ? `${shipping.address}, ${shipping.city} (${shipping.postalCode})` : 'Dirección no registrada'}</span>
                    </p>
                  </div>

                  {/* Artículos de la Orden */}
                  <div className="col-md-12  ">
                    <h4 className="fw-semibold text-dark text-uppercase  small mb-2">
                      Artículos Solicitados ({order.orderItems?.length || 0})
                    </h4>
                    {(order.orderItems || []).map((item, idx) => (
                      <div key={idx} className="py-2 pt-0 pb-0 d-flex align-items-center justify-content-between gap-3 small">
                        <div className="d-flex align-items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="  object-fit-cover rounded-3 bg-body-tertiary border flex-shrink-0" />
                          ) : (
                            <div className="  bg-body-tertiary rounded-3 d-flex align-items-center justify-content-center text-secondary flex-shrink-0">
                              <Package className=" " />
                            </div>
                          )}
                          <div>
                            <h5 className="fw-semibold text-dark ">{item.name}</h5>
                            <span className="text-secondary">Cant: <strong className="text-body">{item.quantity}</strong> × {formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <span className="fw-bold text-dark flex-shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          Modal: Actualizar Estado del Pedido
          ========================================== */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Actualizar Estado - Pedido #${selectedOrder?._id?.slice(-8)}`}
        size="sm"
      >
        <form onSubmit={handleUpdateStatusSubmit} className="vstack gap-3">
          <div className="mb-3">
            <label className="form-label">Nuevo Estado del Pedido</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="form-control text-capitalize"
            >
              {statuses.map((st) => (
                <option key={st} value={st} className="text-capitalize">{st}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary-subtle">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary small py-2 px-3 shadow-sm"
            >
              {isUpdating ? 'Actualizando...' : 'Guardar Estado'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};