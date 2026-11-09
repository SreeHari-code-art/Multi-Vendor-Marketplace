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
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.shop) {
    return (
      <div className="mw-100 mx-auto px-3 py-5">
        <Alert type="danger" title="Store unavailable" message={error || 'This store could not be found.'} />
        <div className="mt-4">
          <Link to="/shops" className="d-inline-flex align-items-center gap-2 text-primary text-primary">
            <ArrowLeft className=" " />
            Back to stores
          </Link>
        </div>
      </div>
    );
  }

  const { shop, products } = data;

  return (
    <div className="container mx-auto px-3 py-5 px-sm-4 px-lg-5">
      <div className="mb-5">
        <Link to="/shops" className="d-inline-flex align-items-center gap-2 small fw-medium text-secondary text-primary">
          <ArrowLeft className=" " />
          Back to stores
        </Link>
      </div>

      <div className="overflow-hidden rounded-3 border border-secondary-subtle bg-white shadow-sm">
        <div className=" overflow-hidden bg-body-tertiary">
          <img
            src={shop.banner || shop.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80'}
            alt={shop.name}
            className="h-100 w-100 object-fit-cover"
          />
        </div>

        <div className="p-4 p-sm-5">
          <div className="d-flex flex-column gap-3 flex-sm-row align-items-sm-center justify-content-sm-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex   align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary">
                <Store className=" " />
              </div>
              <div>
                <h1 className="fs-2 fw-bolder text-dark">{shop.name}</h1>
                <div className="mt-1 d-flex align-items-center gap-2 small text-secondary">
                  <MapPin className="  text-primary" />
                  <span>{shop.address?.city || 'Location unavailable'}, {shop.address?.country || ''}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-secondary">{shop.description}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h2 className="fs-3 fw-bold text-dark">Store Products</h2>
          <span className="d-inline-flex align-items-center gap-2 rounded-pill bg-primary-subtle px-3 py-2 small fw-medium text-primary">
            <PackageCheck className=" " />
            {products?.length || 0} items
          </span>
        </div>

        {(!products || products.length === 0) ? (
          <div className="rounded-3 border border border-secondary-subtle border-secondary-subtle bg-white p-5 text-center text-secondary">
            This store does not have active products yet.
          </div>
        ) : (
          <div className="row g-4 row-cols-md-2 row-cols-xl-3">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="overflow-hidden rounded-3 border border-secondary-subtle bg-white shadow-sm   shadow"
              >
                <div className=" overflow-hidden bg-body-tertiary">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}
                    alt={product.name}
                    className="h-100 w-100 object-fit-cover"
                  />
                </div>

                <div className="p-3">
                  <div className="mb-2 d-flex align-items-center justify-content-between gap-3">
                    <span className="rounded-pill bg-body-tertiary px-2 py-1 small fw-semibold text-uppercase  text-secondary">
                      {product.category || 'General'}
                    </span>
                    {product.stock > 0 ? (
                      <span className="small fw-medium text-success">In stock</span>
                    ) : (
                      <span className="small fw-medium text-danger">Sold out</span>
                    )}
                  </div>

                  <h3 className="fs-5 fw-bold text-dark">{product.name}</h3>
                  <p className="mt-2  small text-secondary">{product.description}</p>

                  <div className="mt-3 d-flex align-items-center justify-content-between">
                    <span className="fs-4 fw-bolder text-dark">{formatCurrency(product.price)}</span>
                    <span className="small fw-medium text-primary">View details</span>
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
