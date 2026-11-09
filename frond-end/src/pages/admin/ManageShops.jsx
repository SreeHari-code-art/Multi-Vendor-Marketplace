import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/format';
import { Spinner, Badge, Alert, Modal } from '../../components/common/ui';
import { 
  Store, 
  Search, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Filter, 
  Package,
  Building
} from 'lucide-react';

export const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Estados para Modal de Cambio de Estado
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statuses = ['active', 'pending', 'suspended'];

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/shops');
      const data = response.data?.shops || response.data || [];
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load the platform stores.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = (shop) => {
    setShopToEdit(shop);
    setSelectedStatus(shop.status || 'active');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!shopToEdit) return;

    setIsUpdating(true);
    setError(null);

    try {
      await api.put(`/admin/shops/${shopToEdit._id}/status`, { status: selectedStatus });
      
      // Actualizar estado local
      setShops((prev) =>
        prev.map((s) => (s._id === shopToEdit._id ? { ...s, status: selectedStatus } : s))
      );

      setIsStatusModalOpen(false);
      setShopToEdit(null);
    } catch (err) {
      setError(err.message || 'Failed to update the store status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDeleteModal = (shop) => {
    setShopToDelete(shop);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!shopToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await api.delete(`/admin/shops/${shopToDelete._id}`);
      
      // Eliminar de la lista local
      setShops((prev) => prev.filter((s) => s._id !== shopToDelete._id));

      setIsDeleteModalOpen(false);
      setShopToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete the store.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const norm = (status || 'active').toLowerCase();
    switch (norm) {
      case 'active':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /><span>Active</span></Badge>;
      case 'suspended':
        return <Badge variant="danger" className="gap-1"><XCircle className="h-3 w-3" /><span>Suspended</span></Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /><span>Under Review</span></Badge>;
    }
  };

  const filteredShops = shops.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.owner?.name && s.owner.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review, approve, and supervise the independent stores selling on the platform
          </p>
        </div>

        {/* Filtro por Estado */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-none capitalize cursor-pointer pr-4"
          >
            <option value="">All ({shops.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st} className="capitalize">{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Search bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search className="h-4 w-4 text-gray-400 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stores by name or owner..."
          className="w-full text-xs bg-transparent border-none focus:outline-none text-gray-900"
        />
      </div>

      {/* Stores table */}
      {filteredShops.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3">
          <Store className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">No stores found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are no stores matching the current search or status criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Store</th>
                  <th className="px-6 py-3 font-semibold">Owner / Seller</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold shrink-0 border border-purple-100">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                        <span className="text-[11px] text-gray-400 font-mono">ID: #{shop._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <User className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{shop.owner?.name || 'Unknown Seller'}</span>
                      </div>
                      <span className="text-gray-400 text-[11px] block">{shop.owner?.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(shop.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDate(shop.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenStatusModal(shop)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Change status"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(shop)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete store"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          Modal: Update store status
          ========================================== */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Change Status - ${shopToEdit?.name}`}
        size="sm"
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Store Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary text-xs py-2 px-5 shadow-sm"
            >
              {isUpdating ? 'Saving...' : 'Save Status'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ==========================================
          Modal: Confirm deletion
          ========================================== */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Store Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-xs text-amber-800">
              Are you sure you want to delete the store <strong>"{shopToDelete?.name}"</strong>? This action will remove commercial access for its associated seller.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete Store'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};