
// @ts-nocheck
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, ShoppingBag, ArrowRight, Check, ShieldCheck, Truck, Star, Percent } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      firebaseService.getProduct(id).then(data => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const formatPrice = (price: number) => `৳ ${Math.round(price).toLocaleString()}`;
  
  const getDiscountedPrice = (product: Product) => {
    if (!product.discountPercentage) return product.price;
    return product.price - (product.price * product.discountPercentage / 100);
  };

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_/";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg space-y-4">
        <h2 className="text-2xl font-bold text-brand-primary">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="text-brand-secondary hover:text-brand-primary underline">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center space-x-3 mb-10 text-sm">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-brand-border text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
            <ArrowLeft size={16} />
          </button>
          <span className="text-brand-muted">/</span>
          <span className="uppercase tracking-widest text-xs font-bold text-brand-secondary hover:text-brand-primary cursor-pointer" onClick={() => navigate('/shop')}>Shop</span>
          <span className="text-brand-muted">/</span>
          <span className="text-brand-primary font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Premium Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-soft group"
             >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={product.images[currentImageIndex]} 
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {product.stock <= 0 && (
                  <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">
                    Sold Out
                  </div>
                )}

                {product.discountPercentage > 0 && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Percent size={14}/> {product.discountPercentage}% OFF
                  </div>
                )}
             </motion.div>
             
             {/* Thumbnails */}
             {product.images.length > 1 && (
               <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                 {product.images.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setCurrentImageIndex(idx)}
                     className={`relative w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                       idx === currentImageIndex ? 'border-brand-accent shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                     }`}
                   >
                     <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col lg:py-4">
            <div className="mb-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block px-3 py-1 rounded-md bg-brand-tag-bg text-brand-tag-text text-[10px] font-bold uppercase tracking-widest">
                        {product.category}
                    </span>
                    {product.isFreeDelivery && (
                      <span className="inline-block px-3 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <Truck size={12}/> Free Delivery
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-primary mb-6 leading-[1.1]">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center space-x-6 mb-10">
                    <div className="flex flex-col">
                      {product.discountPercentage > 0 ? (
                        <>
                          <span className="text-3xl font-medium text-brand-primary">{formatPrice(getDiscountedPrice(product))}</span>
                          <span className="text-sm text-brand-muted line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-medium text-brand-primary">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <div className="h-8 w-[1px] bg-brand-border"></div>
                    <div className="flex items-center space-x-1">
                        <Star size={14} className="text-brand-gold fill-current" />
                        <span className="text-sm font-bold text-brand-primary">4.9</span>
                        <span className="text-xs text-brand-secondary underline decoration-dotted cursor-pointer">(12 Reviews)</span>
                    </div>
                  </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8 border-t border-brand-border pt-8 mb-12">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">Description</h3>
                   <p className="text-brand-secondary leading-relaxed text-base md:text-lg font-light">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-brand-border/50 flex items-start space-x-4">
                      <div className="p-2 bg-brand-bg rounded-lg text-brand-primary">
                        {product.isFreeDelivery ? <Percent size={20} strokeWidth={1.5} className="text-green-600"/> : <Truck size={20} strokeWidth={1.5} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-brand-primary mb-1">{product.isFreeDelivery ? 'Zero Shipping' : 'Fast Delivery'}</p>
                        <p className="text-xs text-brand-secondary leading-relaxed">{product.isFreeDelivery ? 'Applied for this item' : '2-3 days in Dhaka'}</p>
                      </div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-brand-border/50 flex items-start space-x-4">
                      <div className="p-2 bg-brand-bg rounded-lg text-brand-primary"><ShieldCheck size={20} strokeWidth={1.5} /></div>
                      <div>
                        <p className="text-xs font-bold uppercase text-brand-primary mb-1">Authentic</p>
                        <p className="text-xs text-brand-secondary leading-relaxed">Verified Quality</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="space-y-4 pt-6 border-t border-brand-border bg-brand-bg sticky bottom-0 lg:static p-4 lg:p-0 -mx-4 lg:mx-0 z-20"
            >
               <a 
                 href={INSTAGRAM_LINK}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`w-full bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-98 transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center space-x-3 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
               >
                 <span>Order via Instagram</span>
                 <ArrowRight size={18} />
               </a>
               
               <button 
                 onClick={handleAddToCart}
                 disabled={product.stock <= 0}
                 className="w-full bg-white border border-brand-border text-brand-primary py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-brand-primary transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {added ? (
                    <>
                      <Check size={18} className="text-green-600" />
                      <span>Added to Bag</span>
                    </>
                 ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </>
                 )}
               </button>
               
               {product.stock <= 0 && (
                 <p className="text-center text-red-500 text-xs font-bold uppercase tracking-widest mt-2">Currently Unavailable</p>
               )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
