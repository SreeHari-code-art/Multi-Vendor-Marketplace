import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import { ProductCard } from '../../components/product/ProductCard';
import { Spinner } from '../../components/common/ui';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Store, 
  Sparkles, 
  Tag 
} from 'lucide-react';

export const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts('?limit=8'));
  }, [dispatch]);

  // Featured categories with updated imagery & queries
  const featuredCategories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80', query: 'electronics' },
    { name: 'Fashion & Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80', query: 'fashion' },
    { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', query: 'home' },
    { name: 'Beauty & Care', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', query: 'beauty' },
  ];

  return (
    <div className="vstack gap-5 pb-5 bg-body text-body">
      
      {/* ==========================================
          1. Hero Section (Main Banner)
          ========================================== */}
      <section className="position-relative bg-primary text-white overflow-hidden rounded-4 mx-3 mx-sm-4 mx-lg-5 mt-4 shadow-sm">
        <div className="position-relative container mx-auto px-4 px-sm-5 py-5 py-lg-5 d-flex flex-column align-items-start vstack gap-4">
          <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill small fw-semibold bg-body text-primary shadow-sm">
            <Sparkles size={16} className="text-warning" />
            The Ultimate Multi-Vendor Marketplace
          </span>

          <h1 className="display-5 fw-bolder text-white mw-100 lh-sm mb-0">
            Discover unique products from independent stores.
          </h1>

          <p className="fs-5 text-white-50 mw-100 fw-normal lh-lg mb-0" style={{ maxWidth: '720px' }}>
            Shop directly from hundreds of verified merchants with fast shipping, secure payments, and the best selection in Indian Rupees (INR).
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3 pt-2">
            <Link 
              to="/products" 
              className="btn btn-light text-primary fw-bold d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none shadow-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              to="/register?role=seller" 
              className="btn btn-outline-light fw-semibold d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none"
            >
              <Store size={18} />
              <span>Open Your Store</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. Value Propositions (Benefits)
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="d-flex align-items-center gap-3 p-4 bg-body-tertiary rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-primary-subtle text-primary rounded-3 flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="fw-semibold text-body fs-6 mb-1">Fast Shipping</h3>
              <p className="small text-secondary mb-0">Secure deliveries nationwide</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 p-4 bg-body-tertiary rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-success-subtle text-success rounded-3 flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="fw-semibold text-body fs-6 mb-1">100% Secure Payments</h3>
              <p className="small text-secondary mb-0">Protection on every transaction</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 p-4 bg-body-tertiary rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-primary-subtle text-primary rounded-3 flex-shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="fw-semibold text-body fs-6 mb-1">Dedicated Support</h3>
              <p className="small text-secondary mb-0">Personal support 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. Featured Categories
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fs-3 fw-bold text-body mb-0">Shop by Category</h2>
            <p className="small text-secondary mt-1 mb-0">Find exactly what you are looking for</p>
          </div>
          <Link to="/products" className="small fw-semibold text-primary text-decoration-none d-flex align-items-center gap-1">
            <span>View all</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {featuredCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/products?category=${cat.query}`}
              className="position-relative rounded-4 overflow-hidden shadow-sm border border-secondary-subtle d-flex align-items-end p-4 text-decoration-none"
              style={{ minHeight: '220px' }}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="position-absolute top-0 bottom-0 start-0 end-0 w-100 h-100 object-fit-cover"
              />
              {/* Gradient overlay to ensure text readability */}
              <div 
                className="position-absolute top-0 bottom-0 start-0 end-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' }} 
              />
              <div className="position-relative z-1 text-white">
                <h3 className="fs-5 fw-bold text-white mb-0">
                  {cat.name}
                </h3>
                <span className="small text-white-50 d-flex align-items-center gap-1 mt-1">
                  Explore collection <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. Featured Products (Grid)
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fs-3 fw-bold text-body mb-0">Featured Products</h2>
            <p className="small text-secondary mt-1 mb-0">Most popular among our shoppers</p>
          </div>
          <Link to="/products" className="small fw-semibold text-primary text-decoration-none d-flex align-items-center gap-1">
            <span>View full catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-5 text-center">
            <Spinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-body-tertiary rounded-3 border border-secondary-subtle">
            <Tag size={40} className="text-secondary mx-auto mb-3" />
            <h3 className="fs-5 fw-semibold text-body mb-1">No products available</h3>
            <p className="small text-secondary mb-0">Check back soon for new offers.</p>
          </div>
        )}
      </section>

      {/* ==========================================
          5. Seller Call to Action
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="bg-body-secondary border border-secondary-subtle rounded-4 p-4 p-sm-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 shadow-sm">
          <div className="vstack gap-2 mw-100" style={{ maxWidth: '640px' }}>
            <span className="d-inline-block px-3 py-1 rounded-pill small fw-semibold bg-primary-subtle text-primary align-self-start">
              Have a business?
            </span>
            <h2 className="fs-2 fw-bold text-body mb-0">
              Sell your products on MultiMarket
            </h2>
            <p className="text-secondary small lh-lg mb-0">
              Create your own online store in minutes, manage inventory with advanced tools, and reach thousands of ready-to-buy shoppers.
            </p>
          </div>
          <Link 
            to="/register?role=seller" 
            className="btn btn-primary px-4 py-3 fw-bold rounded-3 shadow-sm flex-shrink-0 d-flex align-items-center gap-2 text-decoration-none"
          >
            <Store size={20} />
            <span>Start Selling Today</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;