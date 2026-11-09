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
        return <Badge variant="danger" className="gap-1"><Shield className="h-3 w-3" /><span>Administrator</span></Badge>;
      case 'seller':
        return <Badge variant="primary" className="gap-1"><Building className="h-3 w-3" /><span>Seller</span></Badge>;
      case 'customer':
      default:
        return <Badge variant="success" className="gap-1"><UserCheck className="h-3 w-3" /><span>Buyer</span></Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage permissions, roles, and registered accounts on the platform
          </p>
        </div>

        {/* Filtro por Rol */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-none capitalize cursor-pointer pr-4"
          >
            <option value="">All ({users.length})</option>
            {roles.map((r) => (
              <option key={r} value={r} className="capitalize">{r}</option>
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
          placeholder="Search by name or email..."
          className="w-full text-xs bg-transparent border-none focus:outline-none text-gray-900"
        />
      </div>

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3">
          <Users className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are no records matching the current search or role filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Registration Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {u.name ? u.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{u.name}</h4>
                        <span className="text-[11px] text-gray-400 font-mono">ID: #{u._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenRoleModal(u)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modify role"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* Evitar auto-eliminación del admin actual */}
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => handleOpenDeleteModal(u)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
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
        <form onSubmit={handleUpdateRoleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Select New Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-input capitalize"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1">
              * Changing the role will alter the access permissions and available views for this user.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary text-xs py-2 px-5 shadow-sm"
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
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-xs text-amber-800">
              Are you sure you want to delete the account for <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? This action is irreversible.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};