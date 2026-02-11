
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, ZoomIn } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Shop: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    firebaseService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_/";

  return (
    <div className="bg-brand-bg min-h-screen pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6"
        >
          The Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-brand-secondary max-w-xl mx-auto text-lg font-light"
        >
          Explore our latest drop of premium vintage essentials.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-accent" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-brand-card rounded-3xl shadow-soft border border-brand-border">
             <ShoppingBag size={48} className="mx-auto text-brand-muted mb-4" strokeWidth={1} />
             <p className="text-brand-secondary font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-bg rounded-xl mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-brand-primary shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow px-1">
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">{product.category}</p>
                  <h3 className="text-lg font-heading font-medium text-brand-primary mb-2 group-hover:text-brand-accent transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-lg font-medium text-brand-primary">{formatPrice(product.price)}</span>
                    <a 
                      href={INSTAGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs bg-[#006747] border border-[#006747] text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                    >
                      Order Now
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
