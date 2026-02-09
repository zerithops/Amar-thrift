
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Order from './pages/Order';
import TrackOrder from './pages/TrackOrder';
import AdminGuard from './components/AdminGuard';

// Lazy load admin pages
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminProducts = React.lazy(() => import('./pages/AdminProducts'));
const AddEditProduct = React.lazy(() => import('./pages/AddEditProduct'));
// Using dashboard for orders view as per previous structure

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
  <div className="min-h-screen flex items-center justify-center bg-dark">
    <Loader2 className="animate-spin text-brand" size={40} />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/track-order" element={<TrackOrder />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<AdminGuard><Dashboard /></AdminGuard>} />
            <Route path="/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
            <Route path="/add-product" element={<AdminGuard><AddEditProduct /></AdminGuard>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
