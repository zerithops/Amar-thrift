
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<any>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [countdown, setCountdown] = React.useState(5);
  
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Dhaka' as 'Dhaka' | 'Outside Dhaka',
    address: '',
    productName: searchParams.get('product') || '',
    price: ''
  });

  const price = parseFloat(formData.price) || 0;
  const deliveryCharge = formData.city === 'Dhaka' ? 70 : 150;
  const total = price + deliveryCharge;

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
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let timer: any;
    if (success && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (success && countdown === 0) {
      window.location.href = INSTAGRAM_LINK;
    }
    return () => clearInterval(timer);
  }, [success, countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductBlur = () => {
    const found = products.find(p => p.name.toLowerCase() === formData.productName.toLowerCase());
    if (found) {
      setFormData(prev => ({ ...prev, price: found.price.toString() }));
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
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-gray-100 pb-2">Order Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                         <input required type="text" name="productName" value={formData.productName} onChange={handleChange} onBlur={handleProductBlur} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all" placeholder="Search product..." />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Price (BDT)</label>
                         <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
                  <h3 className="text-xl font-heading font-bold text-brand-black mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-brand-black">৳ {price.toLocaleString()}</span>
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
              className="max-w-xl mx-auto text-center pt-16 space-y-8"
            >
              <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-brand-blue" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-heading font-bold text-brand-black">Order Received!</h1>
                <p className="text-gray-500">Order ID: <span className="font-mono font-bold text-brand-black">{createdOrder?.orderId}</span></p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 text-left">
                <p className="text-sm text-gray-600 mb-4">
                  Redirecting to Instagram DM for payment confirmation in <span className="font-bold text-brand-blue">{countdown}s</span>...
                </p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 font-mono text-xs text-gray-600 break-all">
                  Hello, I placed order #{createdOrder?.orderId} for ৳{createdOrder?.total}. Please confirm payment details.
                </div>
              </div>

              <button 
                onClick={() => window.location.href = INSTAGRAM_LINK}
                className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-brand-black border-b-2 border-brand-black pb-1 hover:text-brand-blue hover:border-brand-blue transition-colors"
              >
                <span>Click if not redirected</span>
                <ExternalLink size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Order;
