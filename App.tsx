
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Order from './pages/Order';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import AddEditProduct from './pages/AddEditProduct';
import AdminGuard from './components/AdminGuard';

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

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/track-order" element={<TrackOrder />} />
          
          {/* Admin Auth */}
          <Route path="/admin" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/dashboard" element={<AdminGuard><Dashboard /></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
          <Route path="/admin/add-product" element={<AdminGuard><AddEditProduct /></AdminGuard>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
