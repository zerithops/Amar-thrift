
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Products', path: '/products', icon: Package },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-[#e63946] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 fixed h-full border-r border-white/5 bg-[#0b0b0b] z-50 hidden md:flex flex-col">
        <div className="p-8">
          <h1 className="text-xl font-heading font-bold tracking-tighter">
            AMAR <span className="text-[#e63946]">ADMIN</span>
          </h1>
          <p className="text-xs text-white/30 mt-1 uppercase tracking-widest">Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#e63946]/10 text-[#e63946]' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#e63946]' : 'group-hover:text-white transition-colors'} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button className="flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-white transition-colors w-full">
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
