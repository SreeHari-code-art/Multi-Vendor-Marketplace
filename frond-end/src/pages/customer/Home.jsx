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

  // Categorías destacadas predefinidas para navegación rápida
  const featuredCategories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80', query: 'electronics' },
    { name: 'Fashion & Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80', query: 'fashion' },
    { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', query: 'home' },
    { name: 'Beauty & Care', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', query: 'beauty' },
  ];

  return (
    <div className="vstack gap-5 pb-5">
      
      {/* ==========================================
          1. Sección Hero (Banner Principal)
          ========================================== */}
      <section className="position-relative bg-primary text-white overflow-hidden rounded-3 mx-3 mx-sm-4 mx-lg-5 mt-4 shadow">
        
        <div className="position-relative container mx-auto px-4 px-sm-5 py-5 py-lg-5 d-flex flex-column align-items-start vstack gap-4">
          <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill small fw-semibold bg-white text-primary">
            <Sparkles className="  text-warning" />
            The Ultimate Multi-Vendor Marketplace
          </span>

          <h1 className="fs-1 fw-bolder text-white mw-100 lh-sm">
            Discover unique products from independent stores.
          </h1>

          <p className="fs-5 text-white-50 mw-100 fw-normal lh-lg">
            Shop directly from hundreds of verified merchants with fast shipping, secure payments, and the best selection in Indian Rupees (INR).
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3 pt-3">
            <Link 
              to="/products" 
              className="btn btn-light text-primary fw-bold d-inline-flex align-items-center gap-2"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="   " />
            </Link>

            <Link 
              to="/register?role=seller" 
              className="btn btn-outline-light fw-semibold d-inline-flex align-items-center gap-2"
            >
              <Store className=" " />
              <span>Open Your Store</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. Sección de Propuestas de Valor (Beneficios)
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="d-flex align-items-center gap-3 p-4 bg-white rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-primary-subtle text-primary rounded-3">
              <Truck className=" " />
            </div>
            <div>
              <h3 className="fw-semibold text-dark">Fast Shipping</h3>
              <p className="small text-secondary">Secure deliveries nationwide</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 p-4 bg-white rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-success-subtle text-success rounded-3">
              <ShieldCheck className=" " />
            </div>
            <div>
              <h3 className="fw-semibold text-dark">100% Secure Payments</h3>
              <p className="small text-secondary">Protection on every transaction</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 p-4 bg-white rounded-3 border border-secondary-subtle shadow-sm">
            <div className="p-3 bg-primary-subtle text-primary rounded-3">
              <Headphones className=" " />
            </div>
            <div>
              <h3 className="fw-semibold text-dark">Dedicated Support</h3>
              <p className="small text-secondary">Personal support 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. Categorías Destacadas
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h2 className="fs-3 fw-bold text-dark">Shop by Category</h2>
            <p className="small text-secondary mt-1">Find exactly what you are looking for</p>
          </div>
          <Link to="/products" className="small fw-semibold text-primary text-primary d-flex align-items-center gap-1">
            <span>View all</span>
            <ArrowRight className=" " />
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-sm-2 row-cols-lg-4 g-4">
          {featuredCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/products?category=${cat.query}`}
              className=" position-relative  rounded-3 overflow-hidden shadow-sm border border-secondary-subtle d-flex align-items-end p-4 bg-dark"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="position-absolute top-0 bottom-0 start-0 end-0 w-100 h-100 object-fit-cover     opacity-75 "
              />
              <div className="position-absolute top-0 bottom-0 start-0 end-0    " />
              <div className="position-relative ">
                <h3 className="fs-5 fw-bold text-white  ">
                  {cat.name}
                </h3>
                <span className="small text-secondary d-flex align-items-center gap-1 mt-1">
                  Explore collection <ArrowRight className=" " />
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
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <h2 className="fs-3 fw-bold text-dark">Featured Products</h2>
            <p className="small text-secondary mt-1">Most popular among our shoppers</p>
          </div>
          <Link to="/products" className="small fw-semibold text-primary text-primary d-flex align-items-center gap-1">
            <span>View full catalog</span>
            <ArrowRight className=" " />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-5">
            <Spinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle">
            <Tag className="  text-secondary mx-auto mb-3" />
            <h3 className=" fw-semibold text-dark">No products available</h3>
            <p className="small text-secondary mt-1">Check back soon for new offers.</p>
          </div>
        )}
      </section>

      {/* ==========================================
          5. Seller Call to Action
          ========================================== */}
      <section className="container mx-auto px-3 px-sm-4 px-lg-5">
        <div className="    rounded-3 p-5 p-sm-5 text-white d-flex flex-column flex-md-row align-items-center justify-content-between gap-5 shadow">
          <div className="vstack gap-3 mw-100">
            <span className="d-inline-block px-3 py-1 rounded-pill small fw-semibold bg-primary-subtle border border-primary-subtle text-primary">
              Have a business?
            </span>
            <h2 className="fs-2 fw-bold ">
              Sell your products on MultiMarket
            </h2>
            <p className="text-primary small lh-lg">
              Create your own online store in minutes, manage inventory with advanced tools, and reach thousands of ready-to-buy shoppers.
            </p>
          </div>
          <Link 
            to="/register?role=seller" 
            className="px-5 py-3 bg-white text-primary fw-bold rounded-3 shadow bg-primary-subtle  flex-shrink-0 d-flex align-items-center gap-2"
          >
            <Store className=" " />
            <span>Start Selling Today</span>
          </Link>
        </div>
      </section>

    </div>
  );
};