import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../features/products/productSlice';
import { formatCurrency } from '../../utils/format';
import { Spinner, Badge, Alert, Modal } from '../../components/common/ui';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Image as ImageIcon, 
  Store, 
  X,
  AlertTriangle
} from 'lucide-react';

export const ManageProducts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  // Local filtering and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal state for create/edit product
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'electronics',
    price: '',
    compareAtPrice: '',
    stock: '',
    description: '',
    images: [''],
  });

  // Estados para Modal de Confirmación de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const categories = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books'];

  useEffect(() => {
    // Filtrar los productos por la tienda del vendedor si está definida
    const shopQuery = user?.shop?._id ? `?shop=${user.shop._id}` : '';
    dispatch(fetchProducts(shopQuery));
  }, [dispatch, user]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleAddImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages.length ? newImages : [''] }));
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'electronics',
      price: '',
      compareAtPrice: '',
      stock: '',
      description: '',
      images: [''],
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'electronics',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      stock: product.stock || '',
      description: product.description || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock),
      images: formData.images.filter((url) => url.trim() !== ''),
    };

    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct._id, productData: payload }));
    } else {
      await dispatch(createProduct(payload));
    }

    setIsFormModalOpen(false);
  };

  // Delete handlers
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete._id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Local table filtering
  const sellerProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, update, and manage your store inventory ({user?.shop?.name || 'My Store'})
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary inline-flex items-center gap-2 py-2.5 px-4 text-sm self-start sm:self-auto shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
        </button>
      </div>

      {isError && (
        <Alert type="danger" message={message || 'An error occurred while processing the request.'} />
      )}

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="form-input pl-10 pr-4 py-2 text-xs"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-gray-500 font-medium shrink-0">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input text-xs py-2 pl-3 pr-8 w-full sm:w-auto bg-gray-50"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product table */}
      {isLoading ? (
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      ) : sellerProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
          <Package className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">No products registered</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not published any items yet, or no product matches the selected filter.
          </p>
          <button onClick={handleOpenCreateModal} className="btn-primary text-xs py-2 px-4 mt-2">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Stock</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellerProducts.map((product) => {
                  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';
                  
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={image} alt={product.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100 border shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                          <span className="text-[11px] text-gray-400">ID: #{product._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        {product.stock > 0 ? (
                          <Badge variant="success">{product.stock} available</Badge>
                        ) : (
                          <Badge variant="danger">Out of stock</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          Modal: Create / Edit Product
          ========================================== */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (INR) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="1499"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="25"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Escribe las características principales del producto..."
              className="form-input"
            />
          </div>

          {/* URLs de Imágenes */}
          <div className="space-y-2">
            <label className="form-label mb-0">Imágenes (URLs)</label>
            {formData.images.map((imgUrl, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="form-input text-xs"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(index)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another image URL</span>
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-5 shadow-sm"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ==========================================
          Modal: Confirmar Eliminación
          ========================================== */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-xs text-amber-800">
              Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};