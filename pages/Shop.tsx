
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
    <div className="bg-brand-gray min-h-screen pb-20">
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
                onClick={() => openModal(product)}
                className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-brand-black mb-2 group-hover:text-brand-blue transition-colors">{product.name}</h3>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-heading font-bold text-brand-black">{formatPrice(product.price)}</span>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="text-xs bg-brand-black text-white px-3 py-1.5 rounded-full font-bold uppercase tracking-wider hover:bg-brand-blue transition-colors"
                    >
                      Add to Cart
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative"
            >
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur hover:bg-white p-2 rounded-full transition-colors text-black"
              >
                <X size={24} />
              </button>

              <div className="relative bg-gray-100 aspect-[4/5] md:aspect-auto md:h-full group">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {selectedProduct.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-brand-blue' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                <div className="flex-grow">
                   <p className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-2">{selectedProduct.category}</p>
                   <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-black mb-4">{selectedProduct.name}</h2>
                   <p className="text-2xl font-bold text-brand-black mb-6">{formatPrice(selectedProduct.price)}</p>
                   
                   <div className="space-y-4 mb-8">
                     <h3 className="text-sm font-bold uppercase text-gray-400">Description</h3>
                     <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                   </div>

                   <div className="flex items-center space-x-4 mb-8">
                      {selectedProduct.stock > 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider">
                          In Stock ({selectedProduct.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                          Sold Out
                        </span>
                      )}
                   </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.stock <= 0}
                    className="w-full bg-brand-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-blue transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
