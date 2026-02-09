
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    firebaseService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()} BDT`;

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full transition-colors duration-500" />
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter text-white">
              AMAR <span className="text-brand transition-colors duration-500">THRIFT</span>
            </h1>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-2xl text-white/60 font-light tracking-wide">
            Premium Thrift • Minimal Style
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Link to="/order" className="inline-flex items-center space-x-3 bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full font-bold transition-all glow-hover hover:scale-105 active:scale-95 duration-500">
              <ShoppingBag size={20} />
              <span>SHOP COLLECTION</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand mb-2 transition-colors duration-500">Curated Drops</h2>
            <p className="text-3xl md:text-4xl font-heading font-bold text-white">Featured Selection</p>
          </div>
          <p className="text-white/40 text-sm max-w-xs">Carefully inspected and cleaned pieces. Each item is unique.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-brand transition-colors duration-500" size={40} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-dark-card rounded-3xl border border-dashed border-white/10">
             <p className="text-white/30 italic">Collection being refreshed. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-dark-card shadow-lg">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/order?product=${encodeURIComponent(product.name)}`} className="bg-white text-dark px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand hover:text-white">
                      Quick Order
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors duration-500">{product.name}</h3>
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded text-white/50">{product.category}</span>
                  </div>
                  <p className="text-lg font-heading font-bold text-brand whitespace-nowrap transition-colors duration-500">{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-dark-card py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand transition-colors duration-500">The Philosophy</h2>
          <p className="text-2xl md:text-4xl font-heading font-medium leading-tight text-white/90 italic">
            "Fast fashion is a cycle. Thrifting is a statement. We bridge the gap between sustainability and high-end aesthetics."
          </p>
          <div className="w-12 h-1 bg-brand mx-auto transition-colors duration-500"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
