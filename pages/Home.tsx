
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Only fetch first 3 products for featured section
    firebaseService.getProducts().then(data => {
      setProducts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Background" 
            className="w-full h-full object-cover"
          />
          {/* Subtle Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-widest"
          >
            <span>Est. 2026</span>
            <span className="w-1 h-1 rounded-full bg-brand-gold"></span>
            <span>Premium Vintage</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-heading font-semibold text-white leading-[1.1] tracking-tight drop-shadow-sm"
          >
            Timeless Style,<br />Reimagined.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/90 font-light max-w-xl mx-auto leading-relaxed"
          >
            Curated pieces that tell a story. Discover our exclusive collection of sustainable luxury fashion.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-3 bg-white text-brand-primary px-10 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-brand-bg transition-all duration-300 shadow-xl transform hover:-translate-y-1"
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-6 md:space-y-0">
          <div className="space-y-3">
            <h2 className="text-4xl font-heading font-bold text-brand-primary tracking-tight">Featured Selections</h2>
            <p className="text-brand-secondary max-w-md">Handpicked highlights from our latest drop. Exclusive pieces for the discerning collector.</p>
          </div>
          <Link to="/shop" className="group flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-brand-primary border-b border-brand-primary pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-accent" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-brand-card rounded-3xl shadow-soft border border-brand-border">
             <ShoppingBag size={48} className="mx-auto text-brand-muted mb-4" strokeWidth={1} />
             <p className="text-brand-secondary font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="group bg-brand-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover border border-brand-border/50 transition-all duration-500 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-bg">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  {/* Quick View / Action */}
                  <div className="absolute bottom-6 right-6 bg-[#006747] backdrop-blur text-white p-4 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:opacity-90">
                    <ArrowRight size={20} />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1.5">{product.category}</p>
                        <h3 className="text-lg font-heading font-semibold text-brand-primary">{product.name}</h3>
                     </div>
                  </div>
                  <div className="pt-4 mt-2 border-t border-brand-border flex items-center justify-between">
                    <span className="text-lg font-medium text-brand-primary">{formatPrice(product.price)}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
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
