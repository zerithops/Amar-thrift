// @ts-nocheck
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = localStorage.getItem('adminSession') === 'true';
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};

const AdminRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={
          <AdminGuard>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminGuard>
        } />
        <Route path="/orders" element={
          <AdminGuard>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminGuard>
        } />
        <Route path="/products" element={
          <AdminGuard>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminGuard>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AdminRoutes;