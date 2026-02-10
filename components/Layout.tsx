
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

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-brand-blue/95 backdrop-blur-md shadow-soft transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-heading font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
                AMAR THRIFT
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-white/90 hover:text-white relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
               
               {/* Cart Icon */}
               <Link to="/cart" className="relative p-2 text-white/90 hover:text-white transition-colors">
                 <ShoppingBag size={22} />
                 {cartCount > 0 && (
                   <span className="absolute top-0 right-0 bg-brand-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                     {cartCount}
                   </span>
                 )}
               </Link>

               <Link to="/shop" className="hidden md:flex items-center space-x-2 text-sm font-bold bg-white text-brand-blue px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md">
                 <span>Shop Now</span>
               </Link>

               {/* Admin Menu */}
               <div className="relative">
                 <button 
                   onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                   className="p-2 text-white/80 hover:text-white transition-colors"
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
                         className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-hover z-20 py-2"
                       >
                         <button
                           onClick={() => {
                             setIsAdminMenuOpen(false);
                             navigate('/admin');
                           }}
                           className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue transition-colors"
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
                  className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-white fixed inset-0 z-40 pt-24 px-6 overflow-hidden"
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
                      className="block text-2xl font-heading font-bold text-brand-black hover:text-brand-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="pt-8 border-t border-gray-100"
                >
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-gray-100 text-brand-black py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-gray-200 transition-colors mb-4">
                    View Cart ({cartCount})
                  </Link>
                  <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-brand-blue text-white py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-black transition-colors shadow-lg">
                    Start Shopping
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-blue text-white pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-bold">Amar Thrift</h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                Premium vintage fashion curated for the modern individual. 
                Experience sustainable luxury with our hand-picked collection.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/" className="hover:text-white hover:underline transition-all">Home</Link></li>
                <li><Link to="/shop" className="hover:text-white hover:underline transition-all">New Arrivals</Link></li>
                <li><Link to="/reviews" className="hover:text-white hover:underline transition-all">Client Reviews</Link></li>
                <li><Link to="/track-order" className="hover:text-white hover:underline transition-all">Track Order</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
               <h4 className="text-sm font-bold uppercase tracking-wider text-white">Connect</h4>
               <div className="flex space-x-4">
                  <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-brand-blue transition-all">
                    <Instagram size={20}/>
                  </a>
                  <a href="mailto:hello@amarthrift.com" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-brand-blue transition-all">
                    <Mail size={20}/>
                  </a>
               </div>
               <p className="text-xs text-white/60 pt-2">Dhaka, Bangladesh</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-center text-xs text-white/60">
            <p>&copy; {new Date().getFullYear()} Amar Thrift. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
