
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Instagram, Copy } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { useCart } from '../context/CartContext';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<any>(null);
  
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Dhaka' as 'Dhaka' | 'Outside Dhaka',
    address: '',
  });

  // Redirect if cart is empty and no direct product param
  React.useEffect(() => {
    if (items.length === 0 && !searchParams.get('product') && !success) {
      navigate('/shop');
    }
  }, [items, searchParams, navigate, success]);

  const deliveryCharge = formData.city === 'Dhaka' ? 80 : 120;
  const total = cartTotal + deliveryCharge;

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_?igsh=OTQwdmgxYnJjZm56";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await firebaseService.addOrder({
        ...formData,
        items: items,
        deliveryCharge: deliveryCharge,
        total: total
      });
      setCreatedOrder(order);
      setSuccess(true);
      clearCart();
      window.scrollTo(0,0);
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyToken = () => {
    if (createdOrder?.orderId) {
        navigator.clipboard.writeText(createdOrder.orderId);
        alert('Token copied!');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Left Column: Form */}
              <div className="lg:col-span-7 bg-brand-card p-10 rounded-3xl shadow-soft border border-brand-border">
                <div className="mb-10">
                  <h1 className="text-3xl font-heading font-bold text-brand-primary mb-3">Checkout</h1>
                  <p className="text-brand-secondary">Please fill in your details to complete the purchase.</p>
                </div>

                <form id="orderForm" onSubmit={handleSubmit} className="space-y-10">
                  {/* Contact Info */}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent border-b border-brand-border pb-3">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-brand-muted uppercase">Full Name</label>
                         <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all" placeholder="e.g. Jane Doe" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-brand-muted uppercase">Phone Number</label>
                         <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all" placeholder="017..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-brand-muted uppercase">Email Address</label>
                       <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all" placeholder="jane@example.com" />
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent border-b border-brand-border pb-3">Shipping Details</h2>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-brand-muted uppercase">Delivery Address</label>
                       <textarea required rows={3} name="address" value={formData.address} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-none" placeholder="Street address, apartment, etc." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-brand-muted uppercase">Location</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setFormData({...formData, city: 'Dhaka'})} className={`py-4 rounded-xl border-2 text-sm font-bold uppercase transition-all ${formData.city === 'Dhaka' ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-border bg-brand-bg text-brand-secondary hover:border-brand-muted'}`}>Dhaka</button>
                          <button type="button" onClick={() => setFormData({...formData, city: 'Outside Dhaka'})} className={`py-4 rounded-xl border-2 text-sm font-bold uppercase transition-all ${formData.city === 'Outside Dhaka' ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-border bg-brand-bg text-brand-secondary hover:border-brand-muted'}`}>Outside Dhaka</button>
                       </div>
                       <p className="text-xs text-brand-muted mt-2">
                         Delivery: {formData.city === 'Dhaka' ? '80 BDT' : '120 BDT'}
                       </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-brand-card p-8 rounded-3xl shadow-soft border border-brand-border">
                  <h3 className="text-xl font-heading font-bold text-brand-primary mb-6">Order Summary</h3>
                  
                  {/* Cart List Mini */}
                  <div className="space-y-4 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center text-sm">
                         <div className="flex items-center space-x-3">
                           <span className="text-brand-accent font-bold bg-brand-bg px-2 py-1 rounded-md">{item.quantity}x</span>
                           <span className="text-brand-secondary truncate max-w-[150px]">{item.name}</span>
                         </div>
                         <span className="text-brand-primary font-bold">৳ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8 border-t border-brand-border pt-6">
                    <div className="flex justify-between text-sm text-brand-secondary">
                      <span>Subtotal</span>
                      <span className="font-bold text-brand-primary">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-brand-secondary">
                      <span>Shipping ({formData.city})</span>
                      <span className="font-bold text-brand-primary">৳ {deliveryCharge}</span>
                    </div>
                    <div className="pt-4 border-t border-brand-border flex justify-between items-end">
                      <span className="text-lg font-bold text-brand-primary">Total</span>
                      <span className="text-3xl font-heading font-bold text-brand-accent">৳ {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      form="orderForm"
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><span>Complete Order</span><ArrowRight size={20} /></>}
                    </button>
                    <div className="flex items-center justify-center space-x-2 text-brand-muted text-xs">
                       <ShieldCheck size={14} />
                       <span>Secure payment verification via Instagram</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto pt-16 space-y-8"
            >
              <div className="bg-brand-card p-12 rounded-[2rem] shadow-soft border border-brand-border text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                
                <h1 className="text-4xl font-heading font-bold text-brand-primary mb-3">Order Confirmed</h1>
                <p className="text-brand-secondary mb-10 text-lg">Your order has been placed successfully.</p>

                <div className="bg-brand-bg border border-brand-border p-8 rounded-2xl mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">Your Order Token</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl font-mono font-bold text-brand-primary tracking-wider">{createdOrder?.orderId}</span>
                    <button onClick={copyToken} className="p-2 text-brand-muted hover:text-brand-primary transition-colors" title="Copy Token">
                        <Copy size={24} />
                    </button>
                  </div>
                  <p className="text-xs text-brand-secondary mt-6 max-w-sm mx-auto leading-relaxed">Please send this token to our Instagram to complete your payment and confirm delivery.</p>
                </div>

                <div className="space-y-4">
                    <a 
                        href={INSTAGRAM_LINK} 
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#E1306C] transition-all shadow-lg flex items-center justify-center space-x-3"
                    >
                        <Instagram size={22} />
                        <span>Pay on Instagram</span>
                    </a>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="text-sm font-bold text-brand-muted hover:text-brand-primary transition-colors py-2"
                    >
                        Return to Shop
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Order;
