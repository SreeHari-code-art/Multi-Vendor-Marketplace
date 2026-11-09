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
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5">
        <Alert
          type="danger"
          title="Error loading product"
          message={message || 'The requested product information could not be found.'}
        />
        <div className="mt-4">
          <Link to="/products" className="btn btn-secondary d-inline-flex align-items-center gap-2">
            <ArrowLeft className=" " />
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
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Back button */}
      <div>
        <Link 
          to="/products" 
          className="d-inline-flex align-items-center gap-2 small fw-medium text-secondary text-primary "
        >
          <ArrowLeft className=" " />
          <span>Back to catalog</span>
        </Link>
      </div>

      {/* Grid Principal: Galería + Información */}
      <div className="row row-cols-1 row-cols-lg-2 g-5 align-items-start">
        
        {/* ==========================================
            1. Galería de Imágenes
            ========================================== */}
        <div className="vstack gap-3">
          <div className="ratio ratio-1x1 w-100 rounded-3 overflow-hidden bg-body-tertiary border border-secondary-subtle position-relative">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="h-100 w-100 object-fit-cover "
            />
            {product.stock <= 0 && (
              <span className="position-absolute   bg-danger-subtle text-white small fw-bold px-3 py-1 rounded-pill text-uppercase ">
                Sold Out
              </span>
            )}
          </div>

          {/* Miniaturas de la galería */}
          {images.length > 1 && (
            <div className="d-flex align-items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`position-relative ratio ratio-1x1  rounded-3 overflow-hidden border-2  flex-shrink-0 ${
                    selectedImage === idx ? 'border-primary-subtle  ' : 'border-secondary-subtle border-secondary'
                  }`}
                >
                  <img src={img} alt="" className="h-100 w-100 object-fit-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==========================================
            2. Detalles del Producto y Acciones
            ========================================== */}
        <div className="vstack gap-4">
          
          {/* Categoría e Identificador de Tienda */}
          <div className="d-flex align-items-center justify-content-between small">
            <span className="text-capitalize bg-primary-subtle text-primary fw-semibold px-3 py-1 rounded-pill">
              {product.category || 'General'}
            </span>
            <Link 
              to={`/shops/${product.shop?._id || ''}`} 
              className="d-flex align-items-center gap-2 text-secondary text-primary fw-medium"
            >
              <Store className="  text-primary" />
              <span>Sold by: <strong>{product.shop?.name || 'Official Store'}</strong></span>
            </Link>
          </div>

          {/* Título */}
          <h1 className="fs-3 fs-2 fw-bold text-dark lh-sm">
            {product.name}
          </h1>

          {/* Precios */}
          <div className="d-flex align-items-baseline gap-3">
            <span className="fs-2 fw-bolder text-dark">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className=" text-secondary text-decoration-line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Inventory Status */}
          <div className="d-flex align-items-center gap-2">
            <span className="small fw-semibold text-body">Availability:</span>
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="danger">Sold Out</Badge>
            )}
          </div>

          {/* Description */}
          <div className="border-top border-bottom border-secondary-subtle py-3 vstack gap-2">
            <h3 className="small fw-bold text-dark text-uppercase ">Product Description</h3>
            <p className="small text-secondary lh-lg text-break">
              {product.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Quantity Selector and Purchase Buttons */}
          {product.stock > 0 && (
            <div className="vstack gap-3">
              <div className="d-flex align-items-center gap-3">
                <span className="small fw-semibold text-body">Quantity:</span>
                <div className="d-flex align-items-center border border-secondary-subtle rounded-3 bg-white">
                  <button
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity <= 1}
                    className="p-2 text-secondary bg-secondary-subtle  "
                  >
                    <Minus className=" " />
                  </button>
                  <span className="px-3 py-1 small fw-bold text-dark  text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= product.stock}
                    className="p-2 text-secondary bg-secondary-subtle  "
                  >
                    <Plus className=" " />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-fill btn btn-primary py-3 d-flex align-items-center justify-content-center gap-2 small shadow"
                >
                  {addedSuccess ? (
                    <>
                      <Check className=" " />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className=" " />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-3 border  ${
                    isWishlisted 
                      ? 'bg-danger-subtle border-primary-subtle text-danger'
                      : 'bg-white border-secondary-subtle text-secondary bg-body-tertiary'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`  ${isWishlisted ? '' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Guarantees and Benefits */}
          <div className="row row-cols-1 row-cols-sm-3 g-3 pt-3 border-top border-secondary-subtle small text-secondary">
            <div className="d-flex align-items-center gap-2">
              <Truck className="  text-primary flex-shrink-0" />
              <span>Shipping guaranteed by the seller</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <ShieldCheck className="  text-primary flex-shrink-0" />
              <span>Purchase protected by MultiMarket</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <RotateCcw className="  text-primary flex-shrink-0" />
              <span>Simple returns</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};