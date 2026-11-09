import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ==========================================
// Shared Layout Components
// ==========================================
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// ==========================================
// Authentication Pages
// ==========================================
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// ==========================================
// Customer Pages
// ==========================================
import { Home } from './pages/customer/Home';
import { ProductCatalog } from './pages/customer/ProductCatalog';
import { ProductDetails } from './pages/customer/ProductDetails';
import { Cart } from './pages/customer/Cart';
import { Wishlist } from './pages/customer/Wishlist';
import { Checkout } from './pages/customer/Checkout';
import { MyOrders } from './pages/customer/MyOrders';

// ==========================================
// Seller Pages
// ==========================================
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { ManageProducts } from './pages/seller/ManageProducts';
import { ManageOrders } from './pages/seller/ManageOrders';

// ==========================================
// Admin Pages
// ==========================================
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageShops } from './pages/admin/ManageShops';
import { ShopCatalog } from './pages/customer/ShopCatalog';
import { ShopDetails } from './pages/customer/ShopDetails';

import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">404 - Page not found</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Sorry, the page you are looking for does not exist, has moved, or you do not have permission to access it.
        </p>
      </div>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm shadow-sm">
        <ArrowLeft className="h-4 w-4" />
      <span>Back to Home</span>
      </Link>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
        
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content with Routing */}
        <main className="flex-1">
          <Routes>
            
            {/* ==========================================
                Public and Customer Routes
                ========================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/shops" element={<ShopCatalog />} />
            <Route path="/shops/:id" element={<ShopDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ==========================================
                Protected Routes: Customer
                ========================================== */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'seller', 'admin']} />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/customer/orders" element={<MyOrders />} />
              <Route path="/customer/orders/:id" element={<MyOrders />} />
            </Route>

            {/* ==========================================
                Protected Routes: Seller
                ========================================== */}
            <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<ManageProducts />} />
              <Route path="/seller/products/new" element={<ManageProducts />} />
              <Route path="/seller/orders" element={<ManageOrders />} />
            </Route>

            {/* ==========================================
                Protected Routes: Admin
                ========================================== */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/shops" element={<ManageShops />} />
            </Route>

            {/* Ruta 404 Catch-All */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

      </div>
    </Router>
  );
};

export default App;