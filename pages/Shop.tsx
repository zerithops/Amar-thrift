
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, X, ChevronLeft, ChevronRight, ZoomIn, Check } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const Shop: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    firebaseService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setAdded(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

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
                onClick={() => openModal(product)}
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
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="text-xs bg-brand-bg border border-brand-border text-brand-primary px-4 py-2 rounded-full font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-card w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative"
            >
              <button 
                onClick={closeModal} 
                className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur hover:bg-white p-2 rounded-full transition-colors text-brand-primary shadow-sm"
              >
                <X size={24} />
              </button>

              <div className="relative bg-brand-bg aspect-[4/5] md:aspect-auto md:h-full group">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img 
                    src={selectedProduct.images[currentImageIndex]} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                      {selectedProduct.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full transition-colors shadow-sm ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-10 md:p-14 flex flex-col h-full overflow-y-auto bg-brand-card">
                <div className="flex-grow">
                   <p className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-3">{selectedProduct.category}</p>
                   <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-primary mb-4 leading-tight">{selectedProduct.name}</h2>
                   <p className="text-2xl font-medium text-brand-primary mb-8">{formatPrice(selectedProduct.price)}</p>
                   
                   <div className="space-y-4 mb-10">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted">Description</h3>
                     <p className="text-brand-secondary leading-relaxed text-lg font-light">{selectedProduct.description}</p>
                   </div>

                   <div className="flex items-center space-x-4 mb-10">
                      {selectedProduct.stock > 0 ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                          In Stock ({selectedProduct.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider">
                          Sold Out
                        </span>
                      )}
                   </div>
                </div>

                <div className="mt-auto pt-8 border-t border-brand-border">
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.stock <= 0}
                    className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {added ? (
                      <>
                        <Check size={20} />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
