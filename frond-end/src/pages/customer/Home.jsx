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
    <div className="space-y-16 pb-16">
      
      {/* ==========================================
          1. Sección Hero (Banner Principal)
          ========================================== */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-28 flex flex-col items-start space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            The Ultimate Multi-Vendor Marketplace
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Discover unique products from independent stores.
          </h1>

          <p className="text-lg text-indigo-100 max-w-xl font-normal leading-relaxed">
            Shop directly from hundreds of verified merchants with fast shipping, secure payments, and the best selection in Indian Rupees (INR).
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              to="/products" 
              className="px-6 py-3.5 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 group"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/register?role=seller" 
              className="px-6 py-3.5 bg-indigo-600/50 hover:bg-indigo-600 text-white font-semibold rounded-xl border border-indigo-400/30 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              <span>Open Your Store</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. Sección de Propuestas de Valor (Beneficios)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
              <p className="text-sm text-gray-500">Secure deliveries nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">100% Secure Payments</h3>
              <p className="text-sm text-gray-500">Protection on every transaction</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dedicated Support</h3>
              <p className="text-sm text-gray-500">Personal support 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. Categorías Destacadas
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Find exactly what you are looking for</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/products?category=${cat.query}`}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex items-end p-6 bg-gray-900"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-gray-300 flex items-center gap-1 mt-0.5">
                  Explore collection <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. Featured Products (Grid)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Most popular among our shoppers</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <span>View full catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20">
            <Spinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Tag className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No products available</h3>
            <p className="text-sm text-gray-500 mt-1">Check back soon for new offers.</p>
          </div>
        )}
      </section>

      {/* ==========================================
          5. Seller Call to Action
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 border border-purple-400/30 text-purple-200">
              Have a business?
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Sell your products on MultiMarket
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Create your own online store in minutes, manage inventory with advanced tools, and reach thousands of ready-to-buy shoppers.
            </p>
          </div>
          <Link 
            to="/register?role=seller" 
            className="px-8 py-4 bg-white text-purple-950 font-bold rounded-xl shadow-lg hover:bg-purple-50 transition-all shrink-0 flex items-center gap-2"
          >
            <Store className="h-5 w-5" />
            <span>Start Selling Today</span>
          </Link>
        </div>
      </section>

    </div>
  );
};