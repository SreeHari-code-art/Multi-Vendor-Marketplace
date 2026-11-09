import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // Check if the product is currently in the wishlist
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  // Default image if the product has no photo records
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card position-relative d-flex flex-column overflow-hidden p-0 shadow border border-secondary-subtle rounded-3 bg-white">
      {/* Contenedor de Imagen y Botones Flotantes */}
      <div className="position-relative ratio ratio-1x1 w-100 overflow-hidden bg-body-tertiary">
        <Link to={`/products/${product._id}`}>
          <img 
            src={productImage} 
            alt={product.name}
            className="h-100 w-100 object-fit-cover    "
          />
        </Link>

        {/* Status Badge (e.g. Sold Out) */}
        {product.stock <= 0 && (
          <span className="position-absolute   bg-danger-subtle text-white small fw-bold px-2 py-1 rounded-pill text-uppercase  shadow-sm">
            Sold Out
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`position-absolute   p-2 rounded-pill shadow  ${
            isWishlisted 
              ? 'bg-danger-subtle text-danger'
              : 'bg-white text-secondary'
          }`}
          title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`  ${isWishlisted ? '' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="d-flex flex-fill flex-column p-3">
        {/* Header: Store & Category */}
        <div className="d-flex align-items-center justify-content-between small text-secondary mb-2">
          <span className="text-truncate fw-medium text-primary mw-100">
            {product.shop?.name || 'Official Store'}
          </span>
          <span className="text-capitalize bg-body-tertiary px-2 py-1 rounded small">
            {product.category || 'General'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="small fw-semibold text-dark mb-2  lh-sm">
          <Link to={`/products/${product._id}`} className="text-primary ">
            {product.name}
          </Link>
        </h3>

        {/* Card Footer: Price and Actions */}
        <div className="mt-auto pt-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
          <div>
            <span className=" fw-bold text-dark">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="d-block small text-secondary text-decoration-line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Quick view link */}
            <Link
              to={`/products/${product._id}`}
              className="p-2 text-secondary text-primary bg-secondary-subtle rounded-3 "
              title="View details"
            >
              <Eye className=" " />
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="p-2 bg-primary-subtle text-white rounded-3 bg-primary opacity-50   shadow-sm"
              title="Add to cart"
            >
              <ShoppingBag className=" " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};