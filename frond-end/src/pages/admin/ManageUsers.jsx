import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { formatDate } from '../../utils/format';
import { Spinner, Badge, Alert, Modal } from '../../components/common/ui';
import { 
  Users, 
  Search, 
  Shield, 
  UserCheck, 
  Building, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Filter 
} from 'lucide-react';

export const ManageUsers = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Estados para Modal de Edición de Rol
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = ['customer', 'seller', 'admin'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/users');
      const data = response.data?.users || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load platform users.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRoleModal = (user) => {
    setUserToEdit(user);
    setSelectedRole(user.role || 'customer');
    setIsRoleModalOpen(true);
  };

  const handleUpdateRoleSubmit = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    setIsUpdating(true);
    setError(null);

    try {
      await api.put(`/admin/users/${userToEdit._id}/role`, { role: selectedRole });
      
      // Actualizar estado local
      setUsers((prev) =>
        prev.map((u) => (u._id === userToEdit._id ? { ...u, role: selectedRole } : u))
      );

      setIsRoleModalOpen(false);
      setUserToEdit(null);
    } catch (err) {
      setError(err.message || 'Error al actualizar el rol del usuario.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      
      // Eliminar localmente
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err.message || 'Error al eliminar el usuario.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role) => {
    const norm = (role || 'customer').toLowerCase();
    switch (norm) {
      case 'admin':
        return <Badge variant="danger" className="gap-1"><Shield className=" " /><span>Administrator</span></Badge>;
      case 'seller':
        return <Badge variant="primary" className="gap-1"><Building className=" " /><span>Seller</span></Badge>;
      case 'customer':
      default:
        return <Badge variant="success" className="gap-1"><UserCheck className=" " /><span>Buyer</span></Badge>;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
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
          <h1 className="fs-2 fw-bold text-dark">User Management</h1>
          <p className="small text-secondary mt-1">
            Manage permissions, roles, and registered accounts on the platform
          </p>
        </div>

        {/* Filtro por Rol */}
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border border-secondary-subtle shadow-sm">
          <Filter className="  text-secondary" />
          <span className="small text-secondary fw-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="small fw-semibold text-dark bg-transparent border-0  text-capitalize  pe-3"
          >
            <option value="">All ({users.length})</option>
            {roles.map((r) => (
              <option key={r} value={r} className="text-capitalize">{r}</option>
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
          placeholder="Search by name or email..."
          className="w-100 small bg-transparent border-0  text-dark"
        />
      </div>

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle vstack gap-3">
          <Users className="  text-secondary mx-auto" />
          <h3 className="fs-5 fw-semibold text-dark">No users found</h3>
          <p className="small text-secondary mw-100 mx-auto">
            There are no records matching the current search or role filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-100 text-start small">
              <thead className="bg-body-tertiary text-secondary small text-uppercase  border-bottom border-secondary-subtle">
                <tr>
                  <th className="px-4 py-3 fw-semibold">User</th>
                  <th className="px-4 py-3 fw-semibold">Email</th>
                  <th className="px-4 py-3 fw-semibold">Role</th>
                  <th className="px-4 py-3 fw-semibold">Registration Date</th>
                  <th className="px-4 py-3 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody className=" ">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="bg-body-tertiary ">
                    <td className="px-4 py-3 d-flex align-items-center gap-3">
                      <div className="  bg-primary-subtle text-primary rounded-pill d-flex align-items-center justify-content-center fw-bold small text-uppercase flex-shrink-0">
                        {u.name ? u.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="fw-semibold text-dark">{u.name}</h4>
                        <span className="small text-secondary font-monospace">ID: #{u._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary small">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-4 py-3 text-secondary small">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          onClick={() => handleOpenRoleModal(u)}
                          className="p-2 text-primary bg-primary-subtle rounded-3 "
                          title="Modify role"
                        >
                          <Edit3 className=" " />
                        </button>

                        {/* Evitar auto-eliminación del admin actual */}
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => handleOpenDeleteModal(u)}
                            className="p-2 text-danger bg-danger-subtle rounded-3 "
                            title="Delete user"
                          >
                            <Trash2 className=" " />
                          </button>
                        )}
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
          Modal: Update role
          ========================================== */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={`Modify Role - ${userToEdit?.name}`}
        size="sm"
      >
        <form onSubmit={handleUpdateRoleSubmit} className="vstack gap-3">
          <div className="mb-3">
            <label className="form-label">Select New Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-control text-capitalize"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="text-capitalize">{r}</option>
              ))}
            </select>
            <p className="small text-secondary mt-1">
              * Changing the role will alter the access permissions and available views for this user.
            </p>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary-subtle">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary small py-2 px-3 shadow-sm"
            >
              {isUpdating ? 'Updating...' : 'Save Role'}
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
        title="Confirm User Deletion"
        size="sm"
      >
        <div className="vstack gap-3">
          <div className="d-flex align-items-center gap-3 text-warning bg-warning-subtle p-3 rounded-3">
            <AlertTriangle className="  flex-shrink-0" />
            <p className="small text-warning">
              Are you sure you want to delete the account for <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? This action is irreversible.
            </p>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-danger-subtle bg-danger text-white fw-medium small py-2 px-3 rounded-3  shadow-sm"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};