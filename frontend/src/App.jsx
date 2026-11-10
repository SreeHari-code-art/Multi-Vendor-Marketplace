import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import ProductCatalog from './pages/customer/ProductCatalog';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import SellerDashboard from './pages/seller/SellerDashboard';
import ManageProducts from './pages/seller/ManageProducts';
import ManageOrders from './pages/seller/ManageOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageShops from './pages/admin/ManageShops';

const NotFound = () => (
  <div className="py-20 text-center">
    <h1 className="text-3xl font-bold">404</h1>
    <p className="mt-2 text-slate-500">That page doesn't exist.</p>
    <Link to="/" className="btn btn-primary mt-4">Go home</Link>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute roles={['customer']} />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
            </Route>

            <Route element={<ProtectedRoute roles={['seller']} />}>
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<ManageProducts />} />
              <Route path="/seller/orders" element={<ManageOrders />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/shops" element={<ManageShops />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
