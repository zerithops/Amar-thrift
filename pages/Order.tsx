
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Send, Instagram, Copy, ExternalLink, ArrowRight, Truck } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<any>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [countdown, setCountdown] = React.useState(5);
  const [copied, setCopied] = React.useState(false);
  const [idCopied, setIdCopied] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Dhaka' as 'Dhaka' | 'Outside Dhaka',
    address: '',
    productName: searchParams.get('product') || '',
    price: ''
  });

  // Calculate totals
  const price = parseFloat(formData.price) || 0;
  const deliveryCharge = formData.city === 'Dhaka' ? 70 : 150;
  const total = price + deliveryCharge;

  // Fetch products to look up price
  React.useEffect(() => {
    const loadProducts = async () => {
      const data = await firebaseService.getProducts();
      setProducts(data);
      
      const urlProduct = searchParams.get('product');
      if (urlProduct) {
        const found = data.find(p => p.name === urlProduct);
        if (found) {
          setFormData(prev => ({ ...prev, price: found.price.toString() }));
        }
      }
    };
    loadProducts();
  }, [searchParams]);

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_?igsh=OTQwdmgxYnJjZm56";

  const messageTemplate = createdOrder ? `Hello Amar Thrift 👋
I placed an order. My Order ID: ${createdOrder.orderId}
Total: ৳${createdOrder.total} BDT
Please confirm payment.` : '';

  React.useEffect(() => {
    let timer: any;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      window.location.href = INSTAGRAM_LINK;
    }
    return () => clearInterval(timer);
  }, [success, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const order = await firebaseService.addOrder({
        ...formData,
        price: price,
        deliveryCharge: deliveryCharge,
        total: total
      });
      setCreatedOrder(order);
      setSuccess(true);
    } catch (error) {
      console.error('Order failed', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOrderId = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.orderId);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    }
  };

  const handleProductBlur = () => {
    const found = products.find(p => p.name.toLowerCase() === formData.productName.toLowerCase());
    if (found) {
      setFormData(prev => ({ ...prev, price: found.price.toString() }));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-dark">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="order-form"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-lg bg-dark-card border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <Send size={120} />
            </div>

            <div className="text-center mb-8 relative z-10">
              <h1 className="text-3xl font-heading font-bold text-white mb-2">Secure Your Find</h1>
              <p className="text-white/40 text-sm">Complete form. Payment handled securely via Instagram.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Phone</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="017..."
                    className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Product</label>
                  <input
                    required
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    onBlur={handleProductBlur}
                    placeholder="e.g. Vintage Blazer"
                    className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Price (৳)</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500"
                    className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Delivery Zone</label>
                 <div className="grid grid-cols-2 gap-4">
                   <button 
                    type="button" 
                    onClick={() => setFormData({...formData, city: 'Dhaka'})}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${formData.city === 'Dhaka' ? 'bg-brand text-white border-brand' : 'bg-dark text-white/50 border-white/10 hover:border-white/30'}`}
                   >
                     Dhaka (৳70)
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setFormData({...formData, city: 'Outside Dhaka'})}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${formData.city === 'Outside Dhaka' ? 'bg-brand text-white border-brand' : 'bg-dark text-white/50 border-white/10 hover:border-white/30'}`}
                   >
                     Outside Dhaka (৳150)
                   </button>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Full Address</label>
                <textarea
                  required
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, Area, House No"
                  className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand transition-colors resize-none"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Product Price</span>
                  <span>৳ {price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Delivery ({formData.city})</span>
                  <span>৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                  <span>Total To Pay</span>
                  <span className="text-brand">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-5 rounded-xl transition-all glow-hover flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>PLACE ORDER</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center space-y-8 bg-dark-card border border-white/5 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex justify-center relative">
               <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-brand/20 rounded-full blur-xl"
               />
               <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-6 rounded-full relative z-10 shadow-lg shadow-pink-500/20">
                 <Instagram size={48} className="text-white" />
               </div>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Order Placed!</h2>
              <p className="text-white/50 text-sm">
                Redirecting to Instagram in <span className="text-brand font-bold">{countdown}s</span>...
              </p>
            </div>

             {/* Order ID Card */}
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-left">Order ID</p>
                 <p className="text-xl font-mono font-bold text-white tracking-widest">{createdOrder?.orderId}</p>
               </div>
               <button 
                 onClick={copyOrderId} 
                 className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all group"
                 title="Copy Order ID"
               >
                 {idCopied ? <CheckCircle2 size={16} className="text-green-500"/> : <Copy size={16} className="text-white/70 group-hover:text-white"/>}
                 <span className="text-xs font-bold uppercase tracking-wider">{idCopied ? 'Copied' : 'Copy'}</span>
               </button>
             </div>

            <div className="bg-dark border border-white/10 rounded-xl p-4 text-left group relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 block">Message Preview</label>
              <p className="text-white/70 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {messageTemplate}
              </p>
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                 {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                 <span className="text-xs font-bold">{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <div className="space-y-3">
               <button 
                onClick={() => window.location.href = INSTAGRAM_LINK}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
               >
                 <span>OPEN INSTAGRAM NOW</span>
                 <ExternalLink size={18} />
               </button>
               
               <p className="text-xs text-white/20">
                 If redirection doesn't start automatically, click the button above.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
