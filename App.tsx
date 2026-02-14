// @ts-nocheck
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Order from './pages/Order';
import TrackOrder from './pages/TrackOrder';
import AdminGuard from './components/AdminGuard';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const Login = React.lazy(() => import('./pages/Login'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminProducts = React.lazy(() => import('./pages/AdminProducts'));
const AdminReviews = React.lazy(() => import('./pages/AdminReviews'));
const AddEditProduct = React.lazy(() => import('./pages/AddEditProduct'));

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg">
    <Loader2 className="animate-spin text-brand-primary" size={40} />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:categoryId" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/order" element={<Order />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin/Auth Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<AdminGuard><Dashboard /></AdminGuard>} />
                <Route path="/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
                <Route path="/admin-reviews" element={<AdminGuard><AdminReviews /></AdminGuard>} />
                <Route path="/add-product" element={<AdminGuard><AddEditProduct /></AdminGuard>} />
                <Route path="/edit-product/:id" element={<AdminGuard><AddEditProduct /></AdminGuard>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;