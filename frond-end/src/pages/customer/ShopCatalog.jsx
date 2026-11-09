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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Alert type="danger" title="Could not load stores" message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Marketplace</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Featured Stores</h1>
        <p className="mt-2 text-gray-600">Explore verified sellers and discover exclusive products.</p>
      </div>

      {shops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          There are currently no stores available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shops/${shop._id}`}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src={shop.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
                  alt={shop.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{shop.name}</h2>
                    </div>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">{shop.description}</p>

                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  <span>{shop.address?.city || 'Location unavailable'}, {shop.address?.country || ''}</span>
                </div>

                <div className="flex items-center justify-between pt-3 text-sm font-medium text-indigo-600">
                  <span>View store</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
