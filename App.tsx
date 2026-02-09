
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the two separate applications
const CustomerRoutes = React.lazy(() => import('./routes/CustomerRoutes'));
const AdminRoutes = React.lazy(() => import('./routes/AdminRoutes'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
    <Loader2 className="animate-spin text-[#e63946]" size={40} />
  </div>
);

const App: React.FC = () => {
  const [isAdminDomain, setIsAdminDomain] = React.useState(false);

  React.useEffect(() => {
    const hostname = window.location.hostname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check for 'admin.' subdomain OR 'admin_mode' query param for local dev
    if (hostname.startsWith('admin.') || searchParams.get('admin_mode') === 'true') {
      setIsAdminDomain(true);
      // Clean URL for dev mode aesthetics if needed, but keeping logic simple
    }
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isAdminDomain ? <AdminRoutes /> : <CustomerRoutes />}
    </Suspense>
  );
};

export default App;
