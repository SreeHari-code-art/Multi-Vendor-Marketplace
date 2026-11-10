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
  Filter, 
  PackageSearch 
} from 'lucide-react';

export const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, isLoading } = useSelector((state) => state.products);

  // States for filters and search
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books'];

  // Load products when search parameters or filters change
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
  }, [dispatch, category, minPrice, maxPrice, sortBy, currentPage, setSearchParams]);

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
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5 bg-body text-body">
      
      {/* Header and Search Bar */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-body">Product Catalog</h1>
          <p className="small text-secondary mt-1 mb-0">
            Explore the best offers from our verified sellers
          </p>
        </div>

        {/* Main Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-100 d-flex gap-2" style={{ maxWidth: '450px' }}>
          <div className="position-relative flex-fill">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="form-control bg-body-tertiary text-body border-secondary-subtle ps-5 pe-3 py-2 small"
            />
            <Search size={18} className="position-absolute top-50 translate-middle-y text-secondary ms-3" />
          </div>
          <button type="submit" className="btn btn-primary py-2 px-3 small fw-semibold">
            Search
          </button>
        </form>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-5">
        
        {/* ==========================================
            Sidebar Filters (Desktop)
            ========================================== */}
        <aside className="d-none d-lg-block flex-shrink-0 vstack gap-4" style={{ width: '260px' }}>
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="fw-semibold text-body fs-5 mb-0 d-flex align-items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span>Filters</span>
            </h3>
            {(category || minPrice || maxPrice || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="small text-primary text-decoration-underline fw-medium bg-transparent border-0 p-0"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter by Categories */}
          <div className="vstack gap-3 pt-3 border-top border-secondary-subtle">
            <h4 className="small fw-semibold text-body mb-0">Categories</h4>
            <div className="vstack gap-1">
              <button
                onClick={() => { setCategory(''); setCurrentPage(1); }}
                className={`w-100 text-start px-3 py-2 rounded-3 small fw-medium text-capitalize border-0 ${
                  category === '' 
                    ? 'bg-primary-subtle text-primary fw-bold'
                    : 'text-body bg-body-tertiary opacity-75 hover-opacity-100'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setCurrentPage(1); }}
                  className={`w-100 text-start px-3 py-2 rounded-3 small fw-medium text-capitalize border-0 ${
                    category === cat 
                      ? 'bg-primary-subtle text-primary fw-bold'
                      : 'text-body bg-body-tertiary opacity-75'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="vstack gap-3 pt-3 border-top border-secondary-subtle">
            <h4 className="small fw-semibold text-body mb-0">Price Range (INR)</h4>
            <div className="row row-cols-2 g-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-control small py-2 bg-body-tertiary text-body border-secondary-subtle"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-control small py-2 bg-body-tertiary text-body border-secondary-subtle"
              />
            </div>
          </div>
        </aside>

        {/* ==========================================
            Main Catalog Content
            ========================================== */}
        <main className="flex-fill vstack gap-4">
          
          {/* Top Bar: Sorting and Mobile Filter Button */}
          <div className="d-flex align-items-center justify-content-between bg-body-tertiary p-3 rounded-3 border border-secondary-subtle shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="d-lg-none d-flex align-items-center gap-2 small fw-medium text-body bg-transparent border-0 p-0"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>

            <span className="small text-secondary fw-medium">
              Showing <strong className="text-body">{products.length}</strong> products
            </span>

            {/* Sorting Selector */}
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sort" className="small text-secondary d-none d-sm-block">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control small py-2 ps-3 pe-5 w-auto bg-body text-body border-secondary-subtle"
              >
                <option value="newest">Most recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product List / Grid */}
          {isLoading ? (
            <div className="py-5 text-center">
              <Spinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="pt-5">
                <Pagination
                  currentPage={currentPage}
                  totalPages={5}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-5 bg-body-tertiary rounded-3 border border-secondary-subtle vstack gap-3">
              <PackageSearch size={48} className="text-secondary mx-auto" />
              <h3 className="fs-5 fw-semibold text-body mb-0">No results found</h3>
              <p className="small text-secondary mw-100 mx-auto mb-0">
                We couldn&apos;t find products matching your filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn btn-outline-secondary small py-2 px-3 mt-2 mx-auto"
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
        <div className="position-fixed top-0 bottom-0 start-0 end-0 d-flex d-lg-none" style={{ zIndex: 1050 }}>
          <div
            className="position-fixed top-0 bottom-0 start-0 end-0 bg-black opacity-50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="position-relative ms-auto w-100 bg-body h-100 shadow-lg d-flex flex-column p-4 vstack gap-4 overflow-y-auto" style={{ maxWidth: '320px', zIndex: 1055 }}>
            <div className="d-flex align-items-center justify-content-between border-bottom border-secondary-subtle pb-3">
              <h3 className="fw-semibold text-body fs-5 mb-0">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-body bg-transparent border-0 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="vstack gap-2">
              <h4 className="small fw-semibold text-body mb-2">Categories</h4>
              <button
                onClick={() => { setCategory(''); setIsMobileFilterOpen(false); }}
                className={`w-100 text-start px-3 py-2 rounded-3 small text-capitalize border-0 ${
                  category === '' ? 'bg-primary-subtle text-primary fw-bold' : 'text-body bg-body-tertiary'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-100 text-start px-3 py-2 rounded-3 small text-capitalize border-0 ${
                    category === cat ? 'bg-primary-subtle text-primary fw-bold' : 'text-body bg-body-tertiary'
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
              className="btn btn-outline-secondary small py-2 w-100 mt-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCatalog;