
// @ts-nocheck
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Mail, Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-primary font-sans">
      {/* Sticky Glass Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-glass border-b border-brand-border/60' 
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 -ml-2 text-brand-primary hover:bg-black/5 rounded-full transition-colors"
                  aria-label="Open Menu"
                >
                  <Menu size={24} strokeWidth={1.5} />
              </button>

              <Link to="/" className="flex items-center group relative z-10">
                <img 
                  src="/logo.png" 
                  alt="Amar Thrift" 
                  className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                      location.pathname === link.path 
                      ? 'text-brand-primary font-semibold' 
                      : 'text-brand-secondary hover:text-brand-primary'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span 
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-accent rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3 md:space-x-5">
               
               {/* Search (Desktop) */}
               <Link to="/shop" className="hidden md:flex p-2 text-brand-primary hover:bg-black/5 rounded-full transition-colors">
                  <Search size={20} strokeWidth={1.5} />
               </Link>

               {/* Cart Icon */}
               <Link to="/cart" className="relative p-2 text-brand-primary hover:bg-black/5 rounded-full transition-colors group">
                 <ShoppingBag size={22} strokeWidth={1.5} className="group-hover:text-brand-accent transition-colors duration-300" />
                 {cartCount > 0 && (
                   <span className="absolute top-0 right-0 bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg transform scale-100 animate-in zoom-in duration-200">
                     {cartCount}
                   </span>
                 )}
               </Link>

               {/* User Profile */}
               <div className="relative">
                 {user ? (
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-tag-bg text-brand-tag-text font-bold text-xs border border-brand-accent/10 hover:border-brand-accent transition-colors"
                    >
                        {user.email?.charAt(0).toUpperCase()}
                    </button>
                 ) : (
                    <Link to="/login" className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-brand-bg hover:bg-gray-200 transition-colors">
                        <User size={18} strokeWidth={1.5} />
                    </Link>
                 )}
                 
                 <AnimatePresence>
                   {isUserMenuOpen && user && (
                     <>
                       <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         className="absolute right-0 top-full mt-3 w-56 bg-white border border-brand-border rounded-xl shadow-hover z-20 py-2 overflow-hidden"
                       >
                         <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-sm font-bold text-brand-primary truncate">{profile?.full_name}</p>
                            <p className="text-xs text-brand-secondary truncate">{user.email}</p>
                         </div>
                         
                         {isAdmin && (
                            <button
                                onClick={() => { setIsUserMenuOpen(false); navigate('/dashboard'); }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-brand-secondary hover:bg-brand-bg hover:text-brand-primary transition-colors flex items-center space-x-2"
                            >
                                <LayoutDashboard size={16} />
                                <span>Dashboard</span>
                            </button>
                         )}

                         <button
                           onClick={handleLogout}
                           className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center space-x-2"
                         >
                           <LogOut size={16} />
                           <span>Sign Out</span>
                         </button>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white md:hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-brand-border">
                <span className="text-xl font-heading font-bold text-brand-primary tracking-tight">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-brand-bg rounded-full hover:bg-gray-200 transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-3xl font-heading font-medium text-brand-primary hover:text-brand-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-10 border-t border-brand-border mt-10">
                  {!user ? (
                      <Link 
                        to="/login" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full py-4 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-widest shadow-lg"
                      >
                          Sign In
                      </Link>
                  ) : (
                      <button 
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="flex items-center justify-center w-full py-4 bg-red-50 text-red-500 rounded-xl font-bold uppercase tracking-widest"
                      >
                          Log Out
                      </button>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>

      {/* Modern Minimal Footer */}
      <footer className="bg-white border-t border-brand-border pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div className="space-y-4 max-w-sm">
              <Link to="/" className="flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="Amar Thrift" 
                    className="h-8 md:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
              </Link>
              <p className="text-brand-secondary text-sm leading-relaxed">
                Curated premium vintage essentials. Sustainable fashion reimagined for the modern individual.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div className="flex flex-col space-y-3">
                    <h4 className="font-bold text-brand-primary text-sm uppercase tracking-widest mb-1">Shop</h4>
                    <Link to="/shop" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">All Products</Link>
                    <Link to="/shop" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">New Arrivals</Link>
                    <Link to="/category/accessories" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">Accessories</Link>
                </div>
                <div className="flex flex-col space-y-3">
                    <h4 className="font-bold text-brand-primary text-sm uppercase tracking-widest mb-1">Support</h4>
                    <Link to="/track-order" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">Track Order</Link>
                    <Link to="/reviews" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">Reviews</Link>
                    <a href="mailto:hello@amarthrift.com" className="text-brand-secondary hover:text-brand-accent transition-colors text-sm">Contact Us</a>
                </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-muted">
            <p>&copy; {new Date().getFullYear()} Amar Thrift. All Rights Reserved.</p>
            <div className="flex space-x-6">
                <a href="#" className="hover:text-brand-primary transition-colors"><Instagram size={18} /></a>
                <a href="mailto:hello@amarthrift.com" className="hover:text-brand-primary transition-colors"><Mail size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
