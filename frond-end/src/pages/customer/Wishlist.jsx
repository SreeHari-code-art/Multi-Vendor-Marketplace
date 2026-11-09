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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="h-10 w-10 fill-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Save products you love by clicking the heart icon while browsing the catalog.
          </p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <ArrowLeft className="h-4 w-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{wishlistItems.length}</strong> {wishlistItems.length === 1 ? 'saved item' : 'saved items'}
          </p>
        </div>
        <button
          onClick={handleClearWishlist}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear List</span>
        </button>
      </div>

      {/* Cuadrícula de Productos en la Lista de Deseos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const productImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

          return (
            <div 
              key={product._id}
              className="card group relative flex flex-col overflow-hidden p-0 hover:shadow-lg transition-all duration-300 border border-gray-200/80 rounded-xl bg-white"
            >
              {/* Imagen y Botón de Eliminar Individual */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Link to={`/products/${product._id}`}>
                  <img 
                    src={productImage} 
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-50 rounded-full shadow-md transition-all"
                  title="Remove from favorites"
                >
                  <Heart className="h-4 w-4 fill-rose-600" />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="truncate font-medium text-indigo-600 max-w-[60%] flex items-center gap-1">
                    <Store className="h-3 w-3" />
                    {product.shop?.name || 'Official Store'}
                  </span>
                  <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {product.category || 'General'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                  <Link to={`/products/${product._id}`} className="hover:text-indigo-600 transition-colors">
                    {product.name}
                  </Link>
                </h3>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/products/${product._id}`}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock <= 0}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      title="Move to cart"
                    >
                      <ShoppingBag className="h-4 w-4" />
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