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
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Section header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-dark">Product Management</h1>
          <p className="small text-secondary mt-1">
            Create, update, and manage your store inventory ({user?.shop?.name || 'My Store'})
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-primary d-inline-flex align-items-center gap-2 py-2 px-3 small align-self-start align-self-sm-auto shadow"
        >
          <Plus className=" " />
          <span>New Product</span>
        </button>
      </div>

      {isError && (
        <Alert type="danger" message={message || 'An error occurred while processing the request.'} />
      )}

      {/* Search and filter bar */}
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 bg-white p-3 rounded-3 border border-secondary-subtle shadow-sm">
        <div className="position-relative w-100 ">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="form-control ps-5 pe-3 py-2 small"
          />
          <Search className="position-absolute     text-secondary" />
        </div>

        <div className="d-flex align-items-center gap-2 w-100 ">
          <label className="small text-secondary fw-medium flex-shrink-0">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control small py-2 ps-3 pe-5 w-100  bg-body-tertiary"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-capitalize">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product table */}
      {isLoading ? (
        <div className="py-5">
          <Spinner size="lg" />
        </div>
      ) : sellerProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle vstack gap-3">
          <Package className="  text-secondary mx-auto" />
          <h3 className="fs-5 fw-semibold text-dark">No products registered</h3>
          <p className="small text-secondary mw-100 mx-auto">
            You have not published any items yet, or no product matches the selected filter.
          </p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary small py-2 px-3 mt-2">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3 border border-secondary-subtle shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-100 text-start small">
              <thead className="bg-body-tertiary text-secondary small text-uppercase  border-bottom border-secondary-subtle">
                <tr>
                  <th className="px-4 py-3 fw-semibold">Product</th>
                  <th className="px-4 py-3 fw-semibold">Category</th>
                  <th className="px-4 py-3 fw-semibold">Price</th>
                  <th className="px-4 py-3 fw-semibold">Stock</th>
                  <th className="px-4 py-3 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody className=" ">
                {sellerProducts.map((product) => {
                  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';
                  
                  return (
                    <tr key={product._id} className="bg-body-tertiary ">
                      <td className="px-4 py-3 d-flex align-items-center gap-3">
                        <img src={image} alt={product.name} className="  object-fit-cover rounded-3 bg-body-tertiary border flex-shrink-0" />
                        <div>
                          <h4 className="fw-semibold text-dark ">{product.name}</h4>
                          <span className="small text-secondary">ID: #{product._id.slice(-6)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-capitalize bg-body-tertiary text-body px-2 py-1 rounded-pill small fw-medium">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 fw-bold text-dark">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        {product.stock > 0 ? (
                          <Badge variant="success">{product.stock} available</Badge>
                        ) : (
                          <Badge variant="danger">Out of stock</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 text-primary bg-primary-subtle rounded-3 "
                            title="Edit product"
                          >
                            <Edit2 className=" " />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            className="p-2 text-danger bg-danger-subtle rounded-3 "
                            title="Delete product"
                          >
                            <Trash2 className=" " />
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
        <form onSubmit={handleSubmitForm} className="vstack gap-3">
          <div className="mb-3">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="form-control"
            />
          </div>

          <div className="row row-cols-1 row-cols-sm-3 g-3">
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-control text-capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
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
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Initial Stock *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="25"
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Escribe las características principales del producto..."
              className="form-control"
            />
          </div>

          {/* URLs de Imágenes */}
          <div className="vstack gap-2">
            <label className="form-label mb-0">Imágenes (URLs)</label>
            {formData.images.map((imgUrl, index) => (
              <div key={index} className="d-flex align-items-center gap-2">
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="form-control small"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(index)}
                    className="p-2 text-danger bg-danger-subtle rounded-3"
                  >
                    <X className=" " />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageField}
              className="small fw-semibold text-primary text-decoration-underline d-inline-flex align-items-center gap-1 pt-1"
            >
              <Plus className=" " />
              <span>Add another image URL</span>
            </button>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary-subtle">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary small py-2 px-3 shadow-sm"
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
        <div className="vstack gap-3">
          <div className="d-flex align-items-center gap-3 text-warning bg-warning-subtle p-3 rounded-3">
            <AlertTriangle className="  flex-shrink-0" />
            <p className="small text-warning">
              Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.
            </p>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary small py-2 px-3"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-danger-subtle bg-danger text-white fw-medium small py-2 px-3 rounded-3  shadow-sm"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};