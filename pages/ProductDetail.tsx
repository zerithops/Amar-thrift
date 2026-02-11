
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, ShoppingBag, ArrowRight, Check, Share2, ShieldCheck, Truck } from 'lucide-react';
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

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;
  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_/";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center space-x-2 mb-8 text-sm text-brand-secondary">
          <button onClick={() => navigate(-1)} className="hover:text-brand-primary flex items-center space-x-1 transition-colors">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <span className="text-brand-border">/</span>
          <span className="uppercase tracking-widest text-xs font-bold">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
             <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-border group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={product.images[currentImageIndex]} 
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                  />
                </AnimatePresence>
                
                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Sold Out
                  </div>
                )}
             </div>
             
             {/* Thumbnails */}
             {product.images.length > 1 && (
               <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                 {product.images.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setCurrentImageIndex(idx)}
                     className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                       idx === currentImageIndex ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'
                     }`}
                   >
                     <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
             )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col h-full lg:py-4">
            <div className="mb-auto">
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-primary mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-2xl font-medium text-brand-primary">{formatPrice(product.price)}</span>
                <span className="text-xs text-brand-muted bg-white px-2 py-1 rounded border border-brand-border">Tax included</span>
              </div>

              <div className="space-y-6 border-t border-brand-border pt-8 mb-10">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">Description</h3>
                   <p className="text-brand-secondary leading-relaxed text-lg font-light">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-xl border border-brand-border flex items-start space-x-3">
                      <Truck size={20} className="text-brand-muted mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase text-brand-primary mb-1">Delivery</p>
                        <p className="text-xs text-brand-secondary">2-3 days within Dhaka</p>
                      </div>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-brand-border flex items-start space-x-3">
                      <ShieldCheck size={20} className="text-brand-muted mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase text-brand-primary mb-1">Authentic</p>
                        <p className="text-xs text-brand-secondary">Verified Vintage Quality</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-brand-border bg-brand-bg sticky bottom-0 lg:static p-4 lg:p-0 -mx-4 lg:mx-0 z-10 lg:z-auto">
               <a 
                 href={INSTAGRAM_LINK}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`w-full bg-[#006747] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center justify-center space-x-3 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
               >
                 <span>Order Now</span>
                 <ArrowRight size={20} />
               </a>
               
               <button 
                 onClick={handleAddToCart}
                 disabled={product.stock <= 0}
                 className="w-full bg-white border border-brand-primary text-brand-primary py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-primary"
               >
                 {added ? (
                    <>
                      <Check size={20} />
                      <span>Added to Bag</span>
                    </>
                 ) : (
                    <>
                      <ShoppingBag size={20} />
                      <span>Add to Cart</span>
                    </>
                 )}
               </button>
               
               {product.stock <= 0 && (
                 <p className="text-center text-red-500 text-sm font-bold mt-2">Currently Unavailable</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
