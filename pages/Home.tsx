
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Only fetch first 3 products for featured section
    firebaseService.getProducts().then(data => {
      setProducts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

  return (
    <div className="bg-brand-gray min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
            alt="Fashion Background" 
            className="w-full h-full object-cover"
          />
          {/* Light Blue Overlay */}
          <div className="absolute inset-0 bg-brand-blue/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest"
          >
            New Collection 2024
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight drop-shadow-lg"
          >
            Elevate Your Style
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-md"
          >
            Discover premium thrifted pieces that define modern elegance. Sustainable, stylish, and unique.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-6"
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-3 bg-brand-blue text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-brand-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-black">Featured Items</h2>
            <p className="text-gray-500">Handpicked highlights from our latest collection.</p>
          </div>
          <Link to="/shop" className="group flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-brand-blue hover:text-brand-black transition-colors">
            <span>View All Products</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-blue" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
             <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: index * 0.1 }} 
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Add Button */}
                  <Link 
                    to={`/order?product=${encodeURIComponent(product.name)}`}
                    className="absolute bottom-4 left-4 right-4 bg-white text-brand-black py-3 rounded-xl font-bold text-center text-sm shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-blue hover:text-white"
                  >
                    Order Now
                  </Link>
                </div>
                
                {/* Product Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-brand-black mb-2 group-hover:text-brand-blue transition-colors">{product.name}</h3>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-heading font-bold text-brand-black">{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-400 font-medium">{product.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
