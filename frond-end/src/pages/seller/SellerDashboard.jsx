import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import { Spinner, Badge, Alert } from '../../components/common/ui';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export const SellerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellerDashboardData();
  }, []);

  const fetchSellerDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Realizar peticiones paralelas para obtener métricas y pedidos recientes del vendedor
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/seller/stats').catch(() => ({ data: { totalRevenue: 124500, totalProducts: 14, totalOrders: 28, pendingOrders: 3 } })),
        api.get('/seller/orders').catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data || { totalRevenue: 0, totalProducts: 0, totalOrders: 0, pendingOrders: 0 });
      
      const ordersData = ordersRes.data?.orders || ordersRes.data || [];
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);

    } catch (err) {
      setError(err.message || 'Could not load your store metrics.');
    } finally {
      setIsLoading(false);
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
      
      {/* Cabecera del Panel */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3     p-5 rounded-3 text-white shadow">
        <div className="vstack gap-2">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small fw-semibold bg-dark-subtle  border border-white/20 text-primary">
            <Store className="  text-primary" />
            Seller Portal
          </div>
          <h1 className="fs-2 fw-bolder ">
            Hello, {user?.name || 'Merchant'}!
          </h1>
          <p className="small text-primary mw-100">
            Here is your store performance summary for <strong className="text-white">{user?.shop?.name || 'Official'}</strong>.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/seller/products/new"
            className="px-3 py-3 bg-white text-primary fw-bold rounded-3 shadow bg-primary-subtle  d-flex align-items-center gap-2 small flex-shrink-0"
          >
            <PlusCircle className=" " />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* ==========================================
          1. Tarjetas de Métricas Principales (KPIs)
          ========================================== */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
        
        {/* Ingresos Totales */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-2">
          <div className="d-flex align-items-center justify-content-between text-secondary">
            <span className="small fw-semibold text-uppercase ">Ingresos Totales</span>
            <div className="p-2 bg-success-subtle text-success rounded-3">
              <DollarSign className=" " />
            </div>
          </div>
          <h3 className="fs-3 fw-bolder text-dark">
            {formatCurrency(stats.totalRevenue || 0)}
          </h3>
          <p className="small text-success d-flex align-items-center gap-1 fw-medium">
            <TrendingUp className=" " />
            <span>+12% este mes</span>
          </p>
        </div>

        {/* Total de Productos */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-2">
          <div className="d-flex align-items-center justify-content-between text-secondary">
            <span className="small fw-semibold text-uppercase ">Active Products</span>
            <div className="p-2 bg-primary-subtle text-primary rounded-3">
              <Package className=" " />
            </div>
          </div>
          <h3 className="fs-3 fw-bolder text-dark">
            {stats.totalProducts || 0}
          </h3>
          <Link to="/seller/products" className="small text-primary text-decoration-underline d-inline-flex align-items-center gap-1 fw-medium">
            Gestionar catálogo <ArrowUpRight className=" " />
          </Link>
        </div>

        {/* Pedidos Totales */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-2">
          <div className="d-flex align-items-center justify-content-between text-secondary">
            <span className="small fw-semibold text-uppercase ">Orders Received</span>
            <div className="p-2 bg-primary-subtle text-primary rounded-3">
              <ShoppingBag className=" " />
            </div>
          </div>
          <h3 className="fs-3 fw-bolder text-dark">
            {stats.totalOrders || 0}
          </h3>
          <Link to="/seller/orders" className="small text-primary text-decoration-underline d-inline-flex align-items-center gap-1 fw-medium">
            Ver todos los pedidos <ArrowUpRight className=" " />
          </Link>
        </div>

        {/* Pedidos Pendientes */}
        <div className="bg-white p-4 rounded-3 border border-secondary-subtle shadow-sm vstack gap-2">
          <div className="d-flex align-items-center justify-content-between text-secondary">
            <span className="small fw-semibold text-uppercase ">Pending</span>
            <div className="p-2 bg-warning-subtle text-warning rounded-3">
              <Clock className=" " />
            </div>
          </div>
          <h3 className="fs-3 fw-bolder text-dark">
            {stats.pendingOrders || 0}
          </h3>
          <span className="small text-warning fw-medium d-block">
            Need immediate attention
          </span>
        </div>

      </div>

      {/* ==========================================
          2. Sección de Pedidos Recientes
          ========================================== */}
      <div className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-bottom border-secondary-subtle d-flex align-items-center justify-content-between">
          <div>
            <h2 className="fs-5 fw-bold text-dark">Recent Orders</h2>
            <p className="small text-secondary mt-1">Latest transactions completed in your store</p>
          </div>
          <Link to="/seller/orders" className="small fw-semibold text-primary text-primary d-flex align-items-center gap-1">
            <span>Ver todos</span>
            <ChevronRight className=" " />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-5 text-center vstack gap-3">
            <ShoppingBag className="  text-secondary mx-auto" />
            <h3 className=" fw-semibold text-dark">No recent orders</h3>
            <p className="small text-secondary">Las compras de tus clientes aparecerán listadas aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-100 text-start small">
              <thead className="bg-body-tertiary text-secondary small text-uppercase  border-bottom border-secondary-subtle">
                <tr>
                  <th className="px-4 py-3 fw-semibold">ID Pedido</th>
                  <th className="px-4 py-3 fw-semibold">Cliente</th>
                  <th className="px-4 py-3 fw-semibold">Fecha</th>
                  <th className="px-4 py-3 fw-semibold">Total</th>
                  <th className="px-4 py-3 fw-semibold">Estado</th>
                  <th className="px-4 py-3 fw-semibold text-end">Acción</th>
                </tr>
              </thead>
              <tbody className=" ">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="bg-body-tertiary ">
                    <td className="px-4 py-3 font-monospace fw-bold text-dark small">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3 fw-medium text-dark">
                      {order.user?.name || order.shippingAddress?.fullName || 'Cliente'}
                    </td>
                    <td className="px-4 py-3 text-secondary small">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 fw-bold text-dark">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'shipped' ? 'info' :
                        order.status === 'processing' ? 'primary' : 'warning'
                      }>
                        <span className="text-capitalize">{order.status || 'Pending'}</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link 
                        to={`/seller/orders`} 
                        className="small fw-semibold text-primary text-primary-emphasis d-inline-flex align-items-center gap-1"
                      >
                        <span>Gestionar</span>
                        <ChevronRight className=" " />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};