
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, ShoppingBag } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Shop: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Dynamically fetch products from Admin upload
    firebaseService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

  return (
    <div className="bg-brand-gray min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 py-16 mb-12 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-brand-black mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto"
          >
            Explore our latest drop of premium vintage essentials.
          </motion.p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-blue" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl shadow-soft">
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
                transition={{ duration: 0.5, delay: index * 0.05 }} 
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
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
      </div>
    </div>
  );
};

export default Shop;
