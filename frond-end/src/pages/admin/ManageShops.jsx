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
        return <Badge variant="success" className="gap-1"><CheckCircle2 className=" " /><span>Active</span></Badge>;
      case 'suspended':
        return <Badge variant="danger" className="gap-1"><XCircle className=" " /><span>Suspended</span></Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" className="gap-1"><AlertTriangle className=" " /><span>Under Review</span></Badge>;
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
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Cabecera */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-dark">Store Management</h1>
          <p className="small text-secondary mt-1">
            Review, approve, and supervise the independent stores selling on the platform
          </p>
        </div>

        {/* Filtro por Estado */}
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border border-secondary-subtle shadow-sm">
          <Filter className="  text-secondary" />
          <span className="small text-secondary fw-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="small fw-semibold text-dark bg-transparent border-0  text-capitalize  pe-3"
          >
            <option value="">All ({shops.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st} className="text-capitalize">{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Search bar */}
      <div className="bg-white p-3 rounded-3 border border-secondary-subtle shadow-sm d-flex align-items-center gap-3">
        <Search className="  text-secondary ms-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stores by name or owner..."
          className="w-100 small bg-transparent border-0  text-dark"
        />
      </div>

      {/* Stores table */}
      {filteredShops.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle vstack gap-3">
          <Store className="  text-secondary mx-auto" />
          <h3 className="fs-5 fw-semibold text-dark">No stores found</h3>
          <p className="small text-secondary mw-100 mx-auto">
            There are no stores matching the current search or status criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-100 text-start small">
              <thead className="bg-body-tertiary text-secondary small text-uppercase  border-bottom border-secondary-subtle">
                <tr>
                  <th className="px-4 py-3 fw-semibold">Store</th>
                  <th className="px-4 py-3 fw-semibold">Owner / Seller</th>
                  <th className="px-4 py-3 fw-semibold">Status</th>
                  <th className="px-4 py-3 fw-semibold">Created</th>
                  <th className="px-4 py-3 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody className=" ">
                {filteredShops.map((shop) => (
                  <tr key={shop._id} className="bg-body-tertiary ">
                    <td className="px-4 py-3 d-flex align-items-center gap-3">
                      <div className="  bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0 border border-primary-subtle">
                        <Building className=" " />
                      </div>
                      <div>
                        <h4 className="fw-semibold text-dark">{shop.name}</h4>
                        <span className="small text-secondary font-monospace">ID: #{shop._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 small text-secondary">
                      <div className="d-flex align-items-center gap-2 fw-medium text-dark">
                        <User className="  text-primary" />
                        <span>{shop.owner?.name || 'Unknown Seller'}</span>
                      </div>
                      <span className="text-secondary small d-block">{shop.owner?.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(shop.status)}
                    </td>
                    <td className="px-4 py-3 text-secondary small">
                      {formatDate(shop.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          onClick={() => handleOpenStatusModal(shop)}
                          className="p-2 text-primary bg-primary-subtle rounded-3 "
                          title="Change status"
                        >
                          <Edit3 className=" " />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(shop)}
                          className="p-2 text-danger bg-danger-subtle rounded-3 "
                          title="Delete store"
                        >
                          <Trash2 className=" " />
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
        <form onSubmit={handleUpdateStatusSubmit} className="vstack gap-3">
          <div className="mb-3">
            <label className="form-label">Store Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary small py-2 px-3 shadow-sm"
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
        <div className="vstack gap-3">
          <div className="d-flex align-items-center gap-3 text-warning bg-warning-subtle p-3 rounded-3">
            <AlertTriangle className="  flex-shrink-0" />
            <p className="small text-warning">
              Are you sure you want to delete the store <strong>"{shopToDelete?.name}"</strong>? This action will remove commercial access for its associated seller.
            </p>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-danger-subtle bg-danger text-white fw-medium small py-2 px-3 rounded-3  shadow-sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete Store'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};