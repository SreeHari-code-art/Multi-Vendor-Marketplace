import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import { ProductCard } from '../../components/product/ProductCard';
import { Spinner, Pagination } from '../../components/common/ui';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Grid, 
  Filter, 
  PackageSearch 
} from 'lucide-react';

export const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, isLoading } = useSelector((state) => state.products);

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books'];

  // Cargar productos al cambiar parámetros de búsqueda o filtros
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.append('search', searchTerm);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sort', sortBy);
    params.append('page', currentPage);

    setSearchParams(params);
    dispatch(fetchProducts(`?${params.toString()}`));
  }, [dispatch, category, minPrice, maxPrice, sortBy, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    dispatch(fetchProducts(`?${params.toString()}`));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
    dispatch(fetchProducts(''));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore the best offers from our verified sellers
          </p>
        </div>

        {/* Main Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="form-input pl-10 pr-4 py-2.5 text-sm"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <button type="submit" className="btn-primary py-2.5 px-4 text-sm">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ==========================================
            Sidebar Filters (Desktop)
            ========================================== */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-600" />
              <span>Filters</span>
            </h3>
            {(category || minPrice || maxPrice || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter by Categories */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Categories</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => { setCategory(''); setCurrentPage(1); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  category === '' 
                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setCurrentPage(1); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    category === cat 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Price Range (INR)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input text-xs py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input text-xs py-2"
              />
            </div>
          </div>
        </aside>

        {/* ==========================================
            Main Catalog Content
            ========================================== */}
        <main className="flex-1 space-y-6">
          
          {/* Top Bar: Sorting and Mobile Button */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <span className="text-xs text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{products.length}</strong> products
            </span>

            {/* Sorting Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs text-gray-500 hidden sm:block">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input text-xs py-1.5 pl-3 pr-8 w-auto bg-gray-50 border-gray-200"
              >
                <option value="newest">Most recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product List / Grid */}
          {isLoading ? (
            <div className="py-24">
              <Spinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={5} // Ajustable según meta devuelta por el backend
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3">
              <PackageSearch className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">No results</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                We couldn&apos;t find products matching your filters. Try adjusting your search.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-secondary text-xs py-2 px-4 mt-2"
              >
                Reset filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          Filter Modal for Mobile Devices
          ========================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-xl flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Categories</h4>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs capitalize ${
                    category === cat ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                handleResetFilters();
                setIsMobileFilterOpen(false);
              }}
              className="btn-secondary text-xs py-2.5 w-full mt-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};