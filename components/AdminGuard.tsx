// @ts-nocheck
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
    );
  }

  if (!user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // User is logged in but not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;