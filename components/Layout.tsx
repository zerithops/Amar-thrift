
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Mail, Menu, X, Palette, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isBW, setIsBW] = React.useState(() => localStorage.getItem('themePreference') === 'bw');
  const location = useLocation();
  const isAdminPath = location.pathname.includes('admin') || location.pathname.includes('dashboard');

  React.useEffect(() => {
    if (isBW) {
      document.documentElement.classList.add('theme-bw');
      localStorage.setItem('themePreference', 'bw');
    } else {
      document.documentElement.classList.remove('theme-bw');
      localStorage.setItem('themePreference', 'luxury');
    }
  }, [isBW]);

  const toggleTheme = () => setIsBW(!isBW);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/#products' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Order Now', path: '/order' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-heading font-bold tracking-tighter text-white">
                AMAR <span className="text-brand transition-colors duration-500">THRIFT</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-white/70 hover:text-brand transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <button 
                onClick={toggleTheme}
                className="p-2 text-white/50 hover:text-white transition-all flex items-center space-x-2 border border-white/10 rounded-full px-4 hover:border-white/20"
                title="Toggle B&W Mode"
              >
                {isBW ? <Sun size={14} className="text-brand" /> : <Palette size={14} className="text-brand" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{isBW ? 'Luxury Mode' : 'B&W Mode'}</span>
              </button>

              {!isAdminPath && (
                 <Link to="/admin" className="text-xs text-white/30 hover:text-white transition-colors">
                  Admin
                 </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-white border border-white/10 rounded-full"
              >
                {isBW ? <Sun size={18} /> : <Palette size={18} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark border-b border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-white/90"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm text-white/40"
                >
                  Admin Access
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="bg-dark-card border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="text-xl font-heading font-bold text-white mb-4">Amar Thrift</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Premium vintage and pre-loved fashion curated for the modern minimalist. 
                Sustainable style, redefined.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand transition-colors duration-500">Connect</h4>
              <a href="#" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors">
                <Instagram size={18} />
                <span>@amarthrift</span>
              </a>
              <a href="mailto:hello@amarthrift.com" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors">
                <Mail size={18} />
                <span>hello@amarthrift.com</span>
              </a>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand transition-colors duration-500">Newsletter</h4>
              <p className="text-white/50 text-xs">Join our list for drop announcements.</p>
              <div className="flex w-full max-w-xs">
                <input 
                  type="email" 
                  placeholder="email address" 
                  className="bg-dark border border-white/10 rounded-l px-4 py-2 text-xs w-full focus:outline-none focus:border-brand transition-all"
                />
                <button className="bg-brand px-4 py-2 text-xs font-bold rounded-r transition-colors duration-500">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Amar Thrift. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
