
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Mail, Menu, X, MoreVertical, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav 
            className={`w-full max-w-7xl transition-all duration-300 rounded-2xl px-6 lg:px-8 py-4 ${
                scrolled 
                ? 'bg-white/90 backdrop-blur-md shadow-glass border border-white/20' 
                : 'bg-transparent'
            }`}
        >
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className={`text-2xl font-heading font-bold tracking-tight transition-colors ${scrolled || location.pathname !== '/' ? 'text-brand-primary' : 'text-brand-primary md:text-white'}`}>
                AMAR THRIFT
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium relative group transition-colors ${
                      scrolled || location.pathname !== '/' ? 'text-brand-secondary hover:text-brand-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${scrolled || location.pathname !== '/' ? 'bg-brand-primary' : 'bg-white'}`}></span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
               
               {/* Cart Icon */}
               <Link to="/cart" className={`relative p-2 transition-colors ${scrolled || location.pathname !== '/' ? 'text-brand-primary' : 'text-white'}`}>
                 <ShoppingBag size={22} strokeWidth={1.5} />
                 {cartCount > 0 && (
                   <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                     {cartCount}
                   </span>
                 )}
               </Link>

               <Link to="/shop" className={`hidden md:flex items-center space-x-2 text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm ${
                   scrolled || location.pathname !== '/' 
                   ? 'bg-brand-primary text-white hover:bg-brand-accent hover:opacity-90' 
                   : 'bg-white text-brand-primary hover:bg-gray-100'
               }`}>
                 <span>Shop Now</span>
               </Link>

               {/* Admin Menu */}
               <div className="relative">
                 <button 
                   onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                   className={`p-2 transition-colors ${scrolled || location.pathname !== '/' ? 'text-brand-secondary hover:text-brand-primary' : 'text-white/80 hover:text-white'}`}
                 >
                   <MoreVertical size={20} />
                 </button>
                 
                 <AnimatePresence>
                   {isAdminMenuOpen && (
                     <>
                       <div className="fixed inset-0 z-10" onClick={() => setIsAdminMenuOpen(false)}></div>
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-border rounded-xl shadow-hover z-20 py-2"
                       >
                         <button
                           onClick={() => {
                             setIsAdminMenuOpen(false);
                             navigate('/admin');
                           }}
                           className="w-full text-left px-4 py-3 text-sm font-medium text-brand-secondary hover:bg-brand-bg hover:text-brand-primary transition-colors"
                         >
                           Admin Panel
                         </button>
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>

               {/* Mobile Menu Toggle */}
               <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`md:hidden p-2 rounded-full transition-colors ${scrolled || location.pathname !== '/' ? 'text-brand-primary hover:bg-brand-bg' : 'text-white hover:bg-white/10'}`}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white fixed inset-0 z-40 pt-28 px-6 overflow-hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-3xl font-heading font-bold text-brand-primary hover:text-brand-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="pt-8 border-t border-brand-border"
              >
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-brand-bg text-brand-primary py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-gray-200 transition-colors mb-4 border border-brand-border">
                  View Cart ({cartCount})
                </Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:opacity-90 transition-colors shadow-lg">
                  Start Shopping
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white pt-20 pb-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold tracking-tight">AMAR THRIFT</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Premium vintage fashion curated for the modern individual. 
                Experience sustainable luxury with our hand-picked collection.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Navigation</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                <li><Link to="/shop" className="hover:text-brand-gold transition-colors">New Arrivals</Link></li>
                <li><Link to="/reviews" className="hover:text-brand-gold transition-colors">Client Reviews</Link></li>
                <li><Link to="/track-order" className="hover:text-brand-gold transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Connect</h4>
               <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all">
                    <Instagram size={18}/>
                  </a>
                  <a href="mailto:hello@amarthrift.com" className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all">
                    <Mail size={18}/>
                  </a>
               </div>
               <p className="text-xs text-gray-500 pt-2">Dhaka, Bangladesh</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Amar Thrift. All Rights Reserved.</p>
            <p className="mt-2 md:mt-0">Designed for 2026.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
