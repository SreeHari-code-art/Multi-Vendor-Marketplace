import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeFromWishlist, 
  clearWishlist 
} from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/format';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Store, 
  Eye 
} from 'lucide-react';

export const Wishlist = () => {
  const dispatch = useDispatch();

  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist());
    }
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-3 py-5 text-center vstack gap-4 min-vh-75 d-flex flex-column justify-content-center align-items-center">
        <div className="p-4 bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center">
          <Heart size={40} />
        </div>
        <div className="vstack gap-2">
          <h2 className="fs-3 fw-bold text-body">Your wishlist is empty</h2>
          <p className="small text-secondary mw-100 mx-auto mb-0">
            Save products you love by clicking the heart icon while browsing the catalog.
          </p>
        </div>
        <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 shadow-sm text-decoration-none">
          <ArrowLeft size={16} />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-body mb-1">My Wishlist</h1>
          <p className="small text-secondary mb-0">
            You have <strong className="text-body">{wishlistItems.length}</strong> {wishlistItems.length === 1 ? 'saved item' : 'saved items'}
          </p>
        </div>
        <button
          onClick={handleClearWishlist}
          className="btn btn-link text-danger text-decoration-none small fw-semibold d-flex align-items-center gap-2 p-0"
        >
          <Trash2 size={16} />
          <span>Clear List</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {wishlistItems.map((product) => {
          const productImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

          return (
            <div 
              key={product._id}
              className="card position-relative d-flex flex-column overflow-hidden p-0 shadow-sm border border-secondary-subtle rounded-3 bg-body"
            >
              {/* Product Image & Remove Button */}
              <div className="position-relative ratio ratio-1x1 w-100 overflow-hidden bg-body-secondary">
                <Link to={`/products/${product._id}`}>
                  <img 
                    src={productImage} 
                    alt={product.name}
                    className="h-100 w-100 object-fit-cover"
                  />
                </Link>

                <button
                  onClick={() => handleRemove(product._id)}
                  className="position-absolute top-0 end-0 m-2 p-2 bg-body text-danger border border-secondary-subtle rounded-circle shadow-sm"
                  title="Remove from favorites"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <div className="d-flex flex-fill flex-column p-3">
                <div className="d-flex align-items-center justify-content-between small text-secondary mb-2">
                  <span className="text-truncate fw-medium text-body d-flex align-items-center gap-1" style={{ maxWidth: '70%' }}>
                    <Store size={14} />
                    {product.shop?.name || 'Official Store'}
                  </span>
                  <span className="text-capitalize bg-body-secondary px-2 py-1 rounded small text-secondary">
                    {product.category || 'General'}
                  </span>
                </div>

                <h3 className="small fw-semibold text-body mb-3 lh-sm text-truncate-2">
                  <Link to={`/products/${product._id}`} className="text-body text-decoration-none">
                    {product.name}
                  </Link>
                </h3>

                <div className="mt-auto pt-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                  <span className="fw-bold text-body">
                    {formatCurrency(product.price)}
                  </span>

                  <div className="d-flex align-items-center gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="p-2 text-body bg-body-secondary rounded-3 text-decoration-none"
                      title="View details"
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-2 rounded-3 border-0 ${product.stock <= 0 ? 'bg-secondary opacity-50 text-white' : 'bg-primary text-white shadow-sm'}`}
                      title="Move to cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Wishlist;