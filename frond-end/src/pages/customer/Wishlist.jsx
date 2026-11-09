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
      <div className="mw-100 mx-auto px-3 py-5 text-center vstack gap-4">
        <div className="  bg-danger-subtle text-danger rounded-pill d-flex align-items-center justify-content-center mx-auto">
          <Heart className="  " />
        </div>
        <div className="vstack gap-2">
          <h2 className="fs-3 fw-bold text-dark">Your wishlist is empty</h2>
          <p className="small text-secondary mw-100 mx-auto">
            Save products you love by clicking the heart icon while browsing the catalog.
          </p>
        </div>
        <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-3">
          <ArrowLeft className=" " />
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
          <h1 className="fs-2 fw-bold text-dark">My Wishlist</h1>
          <p className="small text-secondary mt-1">
            You have <strong className="text-dark">{wishlistItems.length}</strong> {wishlistItems.length === 1 ? 'saved item' : 'saved items'}
          </p>
        </div>
        <button
          onClick={handleClearWishlist}
          className="small fw-semibold text-danger text-danger-emphasis d-flex align-items-center gap-2 "
        >
          <Trash2 className=" " />
          <span>Clear List</span>
        </button>
      </div>

      {/* Cuadrícula de Productos en la Lista de Deseos */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {wishlistItems.map((product) => {
          const productImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

          return (
            <div 
              key={product._id}
              className="card position-relative d-flex flex-column overflow-hidden p-0 shadow border border-secondary-subtle rounded-3 bg-white"
            >
              {/* Imagen y Botón de Eliminar Individual */}
              <div className="position-relative ratio ratio-1x1 w-100 overflow-hidden bg-body-tertiary">
                <Link to={`/products/${product._id}`}>
                  <img 
                    src={productImage} 
                    alt={product.name}
                    className="h-100 w-100 object-fit-cover    "
                  />
                </Link>

                <button
                  onClick={() => handleRemove(product._id)}
                  className="position-absolute   p-2 bg-white  text-danger bg-danger-subtle rounded-pill shadow "
                  title="Remove from favorites"
                >
                  <Heart className="  " />
                </button>
              </div>

              {/* Contenido */}
              <div className="d-flex flex-fill flex-column p-3">
                <div className="d-flex align-items-center justify-content-between small text-secondary mb-2">
                  <span className="text-truncate fw-medium text-primary mw-100 d-flex align-items-center gap-1">
                    <Store className=" " />
                    {product.shop?.name || 'Official Store'}
                  </span>
                  <span className="text-capitalize bg-body-tertiary px-2 py-1 rounded small">
                    {product.category || 'General'}
                  </span>
                </div>

                <h3 className="small fw-semibold text-dark mb-2  lh-sm">
                  <Link to={`/products/${product._id}`} className="text-primary ">
                    {product.name}
                  </Link>
                </h3>

                <div className="mt-auto pt-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                  <span className=" fw-bold text-dark">
                    {formatCurrency(product.price)}
                  </span>

                  <div className="d-flex align-items-center gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="p-2 text-secondary text-primary bg-secondary-subtle rounded-3 "
                      title="View details"
                    >
                      <Eye className=" " />
                    </Link>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock <= 0}
                      className="p-2 bg-primary-subtle text-white rounded-3 bg-primary opacity-50   shadow-sm"
                      title="Move to cart"
                    >
                      <ShoppingBag className=" " />
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