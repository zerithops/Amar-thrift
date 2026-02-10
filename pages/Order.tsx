
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

  // Redirect if cart is empty and no direct product param (backward compatibility)
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
    <div className="bg-brand-gray min-h-screen py-12 md:py-20">
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
              <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl shadow-soft">
                <div className="mb-8">
                  <h1 className="text-3xl font-heading font-bold text-brand-black mb-2">Checkout</h1>
                  <p className="text-gray-500">Please fill in your details to complete the purchase.</p>
                </div>

                <form id="orderForm" onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-gray-100 pb-2">Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                         <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all" placeholder="e.g. Jane Doe" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                         <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all" placeholder="017..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                       <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all" placeholder="jane@example.com" />
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-gray-100 pb-2">Shipping Details</h2>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Delivery Address</label>
                       <textarea required rows={3} name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none" placeholder="Street address, apartment, etc." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setFormData({...formData, city: 'Dhaka'})} className={`py-3 rounded-lg border-2 text-sm font-bold uppercase transition-all ${formData.city === 'Dhaka' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>Dhaka</button>
                          <button type="button" onClick={() => setFormData({...formData, city: 'Outside Dhaka'})} className={`py-3 rounded-lg border-2 text-sm font-bold uppercase transition-all ${formData.city === 'Outside Dhaka' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>Outside Dhaka</button>
                       </div>
                       <p className="text-xs text-gray-400 mt-1">
                         Delivery: {formData.city === 'Dhaka' ? '80 BDT' : '120 BDT'}
                       </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
                  <h3 className="text-xl font-heading font-bold text-brand-black mb-6">Order Summary</h3>
                  
                  {/* Cart List Mini */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center text-sm">
                         <div className="flex items-center space-x-2">
                           <span className="text-brand-blue font-bold">{item.quantity}x</span>
                           <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                         </div>
                         <span className="text-gray-900 font-medium">৳ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-brand-black">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping ({formData.city})</span>
                      <span className="font-bold text-brand-black">৳ {deliveryCharge}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <span className="text-lg font-bold text-brand-black">Total</span>
                      <span className="text-3xl font-heading font-bold text-brand-blue">৳ {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      form="orderForm"
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-black transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><span>Complete Order</span><ArrowRight size={20} /></>}
                    </button>
                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
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
              <div className="bg-white p-10 rounded-3xl shadow-soft border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                
                <h1 className="text-4xl font-heading font-bold text-brand-black mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">Your order has been placed successfully.</p>

                <div className="bg-brand-blue/5 border border-brand-blue/10 p-6 rounded-2xl mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">Your Order Token</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-mono font-bold text-brand-black tracking-wider">{createdOrder?.orderId}</span>
                    <button onClick={copyToken} className="p-2 text-gray-400 hover:text-brand-black transition-colors" title="Copy Token">
                        <Copy size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 max-w-sm mx-auto">Please send this token to our Instagram to complete your payment and confirm delivery.</p>
                </div>

                <div className="space-y-4">
                    <a 
                        href={INSTAGRAM_LINK} 
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-brand-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#E1306C] transition-all shadow-lg flex items-center justify-center space-x-3"
                    >
                        <Instagram size={20} />
                        <span>Pay on Instagram</span>
                    </a>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="text-sm font-bold text-gray-400 hover:text-brand-black transition-colors"
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
