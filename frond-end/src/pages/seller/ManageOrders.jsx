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
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /><span>Delivered</span></Badge>;
      case 'shipped':
        return <Badge variant="info" className="gap-1"><Truck className="h-3 w-3" /><span>Shipped</span></Badge>;
      case 'processing':
        return <Badge variant="primary" className="gap-1"><Clock className="h-3 w-3" /><span>Processing</span></Badge>;
      case 'cancelled':
        return <Badge variant="danger" className="gap-1"><XCircle className="h-3 w-3" /><span>Cancelled</span></Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /><span>Pending</span></Badge>;
    }
  };

  const filteredOrders = statusFilter 
    ? orders.filter((ord) => (ord.status || 'pending').toLowerCase() === statusFilter)
    : orders;

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
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage received orders and update delivery status for your customers
          </p>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-none capitalize cursor-pointer pr-4"
          >
            <option value="">All ({orders.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st} className="capitalize">{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No orders are registered with the selected status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const customerName = order.user?.name || order.shippingAddress?.fullName || 'Cliente';
            const shipping = order.shippingAddress || {};

            return (
              <div 
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Cabecera de la Orden */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-gray-500 block">ID Pedido:</span>
                      <span className="font-mono font-bold text-gray-900 uppercase">#{order._id.slice(-8)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Fecha:</span>
                      <span className="font-semibold text-gray-900">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total:</span>
                      <span className="font-bold text-indigo-600">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => handleOpenStatusModal(order)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Actualizar Estado</span>
                    </button>
                  </div>
                </div>

                {/* Información de Envío y Artículos */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Datos del Cliente y Envío */}
                  <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100 space-y-2 text-xs text-gray-600">
                    <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
                      Información de Envío
                    </h4>
                    <p className="flex items-center gap-2 font-medium text-gray-900">
                      <User className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{customerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{shipping.phone || 'Teléfono no especificado'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{shipping.address ? `${shipping.address}, ${shipping.city} (${shipping.postalCode})` : 'Dirección no registrada'}</span>
                    </p>
                  </div>

                  {/* Artículos de la Orden */}
                  <div className="md:col-span-2 divide-y divide-gray-100">
                    <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
                      Artículos Solicitados ({order.orderItems?.length || 0})
                    </h4>
                    {(order.orderItems || []).map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 border shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h5>
                            <span className="text-gray-500">Cant: <strong className="text-gray-700">{item.quantity}</strong> × {formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 shrink-0">
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
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nuevo Estado del Pedido</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="form-input capitalize"
            >
              {statuses.map((st) => (
                <option key={st} value={st} className="capitalize">{st}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary text-xs py-2 px-5 shadow-sm"
            >
              {isUpdating ? 'Actualizando...' : 'Guardar Estado'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};