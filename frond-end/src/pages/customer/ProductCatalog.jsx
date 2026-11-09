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
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5 vstack gap-5">
      
      {/* Header and Search Bar */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-4 border-bottom border-secondary-subtle">
        <div>
          <h1 className="fs-2 fw-bold text-dark">Product Catalog</h1>
          <p className="small text-secondary mt-1">
            Explore the best offers from our verified sellers
          </p>
        </div>

        {/* Main Search */}
        <form onSubmit={handleSearchSubmit} className="w-100  d-flex gap-2">
          <div className="position-relative flex-fill">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="form-control ps-5 pe-3 py-2 small"
            />
            <Search className="position-absolute     text-secondary" />
          </div>
          <button type="submit" className="btn btn-primary py-2 px-3 small">
            Search
          </button>
        </form>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-5">
        
        {/* ==========================================
            Sidebar Filters (Desktop)
            ========================================== */}
        <aside className="d-none d-lg-block  flex-shrink-0 vstack gap-4">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="fw-semibold text-dark d-flex align-items-center gap-2">
              <Filter className="  text-primary" />
              <span>Filters</span>
            </h3>
            {(category || minPrice || maxPrice || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="small text-primary text-decoration-underline fw-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter by Categories */}
          <div className="vstack gap-3 pt-3 border-top border-secondary-subtle">
            <h4 className="small fw-semibold text-body">Categories</h4>
            <div className="vstack gap-2">
              <button
                onClick={() => { setCategory(''); setCurrentPage(1); }}
                className={`w-100 text-start px-3 py-2 rounded-3 small fw-medium text-capitalize  ${
                  category === '' 
                    ? 'bg-primary-subtle text-primary fw-bold'
                    : 'text-secondary bg-secondary-subtle'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setCurrentPage(1); }}
                  className={`w-100 text-start px-3 py-2 rounded-3 small fw-medium text-capitalize  ${
                    category === cat 
                      ? 'bg-primary-subtle text-primary fw-bold'
                      : 'text-secondary bg-secondary-subtle'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="vstack gap-3 pt-3 border-top border-secondary-subtle">
            <h4 className="small fw-semibold text-body">Price Range (INR)</h4>
            <div className="row row-cols-2 g-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-control small py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-control small py-2"
              />
            </div>
          </div>
        </aside>

        {/* ==========================================
            Main Catalog Content
            ========================================== */}
        <main className="flex-fill vstack gap-4">
          
          {/* Top Bar: Sorting and Mobile Button */}
          <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded-3 border border-secondary-subtle shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="d-lg-none d-flex align-items-center gap-2 small fw-medium text-body text-primary"
            >
              <SlidersHorizontal className=" " />
              <span>Filters</span>
            </button>

            <span className="small text-secondary fw-medium">
              Showing <strong className="text-dark">{products.length}</strong> products
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
                className="form-control small py-2 ps-3 pe-5 w-auto bg-body-tertiary border-secondary-subtle"
              >
                <option value="newest">Most recent</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product List / Grid */}
          {isLoading ? (
            <div className="py-5">
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
                  totalPages={5} // Ajustable según meta devuelta por el backend
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle vstack gap-3">
              <PackageSearch className="  text-secondary mx-auto" />
              <h3 className="fs-5 fw-semibold text-dark">No results</h3>
              <p className="small text-secondary mw-100 mx-auto">
                We couldn&apos;t find products matching your filters. Try adjusting your search.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary small py-2 px-3 mt-2"
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
        <div className="position-fixed top-0 bottom-0 start-0 end-0  d-flex d-lg-none">
          <div
            className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark "
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="position-relative  w-100 mw-100 bg-white h-100 shadow d-flex flex-column p-4 vstack gap-4 overflow-y-auto">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
              <h3 className="fw-semibold text-dark">Filtros</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-secondary text-secondary"
              >
                <X className=" " />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="vstack gap-2">
              <h4 className="small fw-semibold text-body">Categories</h4>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-100 text-start px-3 py-2 rounded-3 small text-capitalize ${
                    category === cat ? 'bg-primary-subtle text-primary fw-bold' : 'text-secondary'
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
              className="btn btn-secondary small py-2 w-100 mt-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};