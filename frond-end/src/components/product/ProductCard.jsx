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
    <div className="card group relative flex flex-col overflow-hidden p-0 hover:shadow-lg transition-all duration-300 border border-gray-200/80 rounded-xl bg-white">
      {/* Contenedor de Imagen y Botones Flotantes */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link to={`/products/${product._id}`}>
          <img 
            src={productImage} 
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Status Badge (e.g. Sold Out) */}
        {product.stock <= 0 && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Sold Out
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Header: Store & Category */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="truncate font-medium text-indigo-600 max-w-[60%]">
            {product.shop?.name || 'Official Store'}
          </span>
          <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-[11px]">
            {product.category || 'General'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
          <Link to={`/products/${product._id}`} className="hover:text-indigo-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Card Footer: Price and Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="block text-[11px] text-gray-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick view link */}
            <Link
              to={`/products/${product._id}`}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};