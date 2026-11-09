import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Spinner, Alert } from '../../components/common/ui';
import { formatCurrency } from '../../utils/format';
import { MapPin, ArrowLeft, Store, PackageCheck } from 'lucide-react';

export const ShopDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await api.get(`/shops/${id}`);
        setData(response?.data || null);
      } catch (err) {
        setError(err.message || 'Could not load the store.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchShop();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.shop) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Alert type="danger" title="Store unavailable" message={error || 'This store could not be found.'} />
        <div className="mt-6">
          <Link to="/shops" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="h-4 w-4" />
            Back to stores
          </Link>
        </div>
      </div>
    );
  }

  const { shop, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/shops" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" />
          Back to stores
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-52 overflow-hidden bg-gray-100">
          <img
            src={shop.banner || shop.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80'}
            alt={shop.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <Store className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{shop.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  <span>{shop.address?.city || 'Location unavailable'}, {shop.address?.country || ''}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-600">{shop.description}</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Store Products</h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <PackageCheck className="h-4 w-4" />
            {products?.length || 0} items
          </span>
        </div>

        {(!products || products.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            This store does not have active products yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                      {product.category || 'General'}
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-xs font-medium text-emerald-600">In stock</span>
                    ) : (
                      <span className="text-xs font-medium text-rose-600">Sold out</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{product.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
                    <span className="text-sm font-medium text-indigo-600">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
