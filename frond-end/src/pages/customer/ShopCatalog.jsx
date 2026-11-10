import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner, Alert } from '../../components/common/ui';
import { MapPin, ArrowRight, Store } from 'lucide-react';

export const ShopCatalog = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/shops');
        const result = response?.data || [];
        setShops(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(err.message || 'Could not load stores.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mw-100 mx-auto px-3 py-5">
        <Alert type="danger" title="Could not load stores" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 px-sm-4 px-lg-5 py-5">
      <div className="mb-5">
        <p className="small fw-semibold text-uppercase text-primary">Marketplace</p>
        <h1 className="mt-2 fs-2 fw-bolder text-body">Featured Stores</h1>
        <p className="mt-2 text-secondary">Explore verified sellers and discover exclusive products.</p>
      </div>

      {shops.length === 0 ? (
        <div className="rounded-3 border border-secondary-subtle bg-body-tertiary p-5 text-center text-secondary">
          There are currently no stores available.
        </div>
      ) : (
        <div className="row g-4 row-cols-md-2 row-cols-xl-3">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shops/${shop._id}`}
              className="overflow-hidden rounded-3 border border-secondary-subtle bg-body shadow-sm text-decoration-none"
            >
              <div className="overflow-hidden bg-body-secondary" style={{ height: '180px' }}>
                <img
                  src={shop.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
                  alt={shop.name}
                  className="h-100 w-100 object-fit-cover"
                />
              </div>

              <div className="p-3">
                <div className="mb-3 d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary p-2">
                      <Store size={20} />
                    </div>
                    <div>
                      <h2 className="fs-5 fw-bold text-body mb-0">{shop.name}</h2>
                    </div>
                  </div>
                </div>

                <p className="mb-3 small text-secondary text-truncate">
                  {shop.description || 'Discover amazing products from this store.'}
                </p>

                <div className="mb-3 d-flex align-items-center gap-2 small text-secondary">
                  <MapPin size={16} className="text-primary" />
                  <span>{shop.address?.city || 'Location unavailable'}, {shop.address?.country || ''}</span>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary-subtle small fw-medium text-primary">
                  <span>View store</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};