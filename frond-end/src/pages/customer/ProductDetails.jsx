import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../features/products/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { formatCurrency } from '../../utils/format';
import { Spinner, Badge, Alert } from '../../components/common/ui';
import { 
  Heart, 
  ShoppingBag, 
  Store, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ArrowLeft,
  Check
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, isLoading, isError, message } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  // Local view state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const handleQuantityChange = (type) => {
    if (!product) return;
    if (type === 'increment' && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    dispatch(addToCart({ ...product, quantity }));
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist(product));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert
          type="danger"
          title="Error loading product"
          message={message || 'The requested product information could not be found.'}
        />
        <div className="mt-6">
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <div>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to catalog</span>
        </Link>
      </div>

      {/* Grid Principal: Galería + Información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* ==========================================
            1. Galería de Imágenes
            ========================================== */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
            {product.stock <= 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            )}
          </div>

          {/* Miniaturas de la galería */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==========================================
            2. Detalles del Producto y Acciones
            ========================================== */}
        <div className="space-y-6">
          
          {/* Categoría e Identificador de Tienda */}
          <div className="flex items-center justify-between text-xs">
            <span className="capitalize bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full">
              {product.category || 'General'}
            </span>
            <Link 
              to={`/shops/${product.shop?._id || ''}`} 
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium"
            >
              <Store className="h-4 w-4 text-indigo-600" />
              <span>Sold by: <strong>{product.shop?.name || 'Official Store'}</strong></span>
            </Link>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Precios */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Inventory Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Availability:</span>
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="danger">Sold Out</Badge>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Quantity Selector and Purchase Buttons */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= product.stock}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Guarantees and Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Shipping guaranteed by the seller</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Purchase protected by MultiMarket</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Simple returns</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};