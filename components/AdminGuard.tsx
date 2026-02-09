
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = localStorage.getItem('adminSession') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
