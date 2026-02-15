
// @ts-nocheck
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ShoppingBag, Truck } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  React.useEffect(() => {
    firebaseService.getProducts().then(data => {
      setProducts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${Math.round(price).toLocaleString()}`;

  const getDiscountedPrice = (product: Product) => {
    if (!product.discountPercentage) return product.price;
    return product.price - (product.price * product.discountPercentage / 100);
  };

  return (
    <div className="bg-brand-bg min-h-screen overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Parallax */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Background" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 mt-12 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]"
          >
            <span>Est. 2026</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-semibold text-white leading-[1.05] tracking-tight drop-shadow-lg"
          >
            Refined Thrift <br/> Collection
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-white/90 font-light max-w-lg mx-auto leading-relaxed"
          >
            Curated sustainability meets luxury design. Discover exclusive pieces that define your personal narrative.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 md:pt-10"
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-3 bg-white text-brand-primary px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-brand-bg hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-brand-bg relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-primary tracking-tight">New Arrivals</h2>
            <p className="text-brand-secondary text-sm md:text-base font-light max-w-sm">Handpicked highlights from our latest drop.</p>
          </div>
          <Link to="/shop" className="group flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-brand-primary border-b border-brand-primary pb-1 hover:text-brand-accent hover:border-brand-accent transition-all">
            <span>View All</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-accent" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-soft border border-brand-border">
             <ShoppingBag size={48} className="mx-auto text-brand-muted mb-4 opacity-50" strokeWidth={1} />
             <p className="text-brand-secondary font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white rounded-2xl shadow-soft group-hover:shadow-hover transition-all duration-500 mb-6">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">No Image</div>
                  )}
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.discountPercentage > 0 && (
                      <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    {product.isFreeDelivery && (
                      <div className="bg-brand-primary/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Truck size={10}/> Free Delivery
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    Quick View
                  </div>
                </div>
                
                <div className="space-y-1 px-1">
                   <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1">{product.name}</h3>
                      <div className="flex flex-col items-end">
                        {product.discountPercentage > 0 ? (
                          <>
                            <span className="text-brand-primary font-bold">{formatPrice(getDiscountedPrice(product))}</span>
                            <span className="text-[10px] text-brand-muted line-through">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="text-brand-primary font-bold">{formatPrice(product.price)}</span>
                        )}
                      </div>
                   </div>
                   <p className="text-xs text-brand-secondary font-medium uppercase tracking-wide">{product.category}</p>
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
