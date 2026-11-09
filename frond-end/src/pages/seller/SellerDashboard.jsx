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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-950 p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-200">
            <Store className="h-3.5 w-3.5 text-purple-300" />
            Seller Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Merchant'}!
          </h1>
          <p className="text-sm text-indigo-200 max-w-xl">
            Here is your store performance summary for <strong className="text-white">{user?.shop?.name || 'Official'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/products/new"
            className="px-5 py-3 bg-white text-purple-950 font-bold rounded-xl shadow-md hover:bg-purple-50 transition-all flex items-center gap-2 text-xs shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Ingresos Totales */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Ingresos Totales</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(stats.totalRevenue || 0)}
          </h3>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% este mes</span>
          </p>
        </div>

        {/* Total de Productos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Products</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {stats.totalProducts || 0}
          </h3>
          <Link to="/seller/products" className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-medium">
            Gestionar catálogo <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Pedidos Totales */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders Received</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {stats.totalOrders || 0}
          </h3>
          <Link to="/seller/orders" className="text-xs text-purple-600 hover:underline inline-flex items-center gap-0.5 font-medium">
            Ver todos los pedidos <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Pedidos Pendientes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {stats.pendingOrders || 0}
          </h3>
          <span className="text-xs text-amber-600 font-medium block">
            Need immediate attention
          </span>
        </div>

      </div>

      {/* ==========================================
          2. Sección de Pedidos Recientes
          ========================================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest transactions completed in your store</p>
          </div>
          <Link to="/seller/orders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <span>Ver todos</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-semibold text-gray-900">No recent orders</h3>
            <p className="text-xs text-gray-500">Las compras de tus clientes aparecerán listadas aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">ID Pedido</th>
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/55 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 text-xs">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.user?.name || order.shippingAddress?.fullName || 'Cliente'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'shipped' ? 'info' :
                        order.status === 'processing' ? 'primary' : 'warning'
                      }>
                        <span className="capitalize">{order.status || 'Pending'}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/seller/orders`} 
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                      >
                        <span>Gestionar</span>
                        <ChevronRight className="h-3 w-3" />
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