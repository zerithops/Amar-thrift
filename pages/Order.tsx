
// @ts-nocheck
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Instagram, Copy, Truck, MapPin } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { useCart } from '../context/CartContext';
import { BANGLADESH_LOCATIONS, District } from '../data/locations';

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
    district: '',
    upazila: '',
    address: '',
  });

  const [availableUpazilas, setAvailableUpazilas] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (items.length === 0 && !searchParams.get('product') && !success) {
      navigate('/shop');
    }
  }, [items, searchParams, navigate, success]);

  // If any item has free delivery, the whole order's delivery charge is zero.
  const hasFreeDelivery = items.some(item => item.isFreeDelivery);
  
  // Delivery Charge Logic: Dhaka = 80, Others = 150
  const baseDeliveryCharge = formData.district === 'Dhaka' ? 80 : 150;
  const deliveryCharge = hasFreeDelivery ? 0 : (formData.district ? baseDeliveryCharge : 0);
  const total = cartTotal + deliveryCharge;

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_/";

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    const districtObj = BANGLADESH_LOCATIONS.find(d => d.name === districtName);
    
    setFormData(prev => ({ 
      ...prev, 
      district: districtName, 
      upazila: '' // Reset upazila when district changes
    }));

    if (districtObj) {
      setAvailableUpazilas(districtObj.upazilas);
    } else {
      setAvailableUpazilas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.upazila) {
      alert('Please select your location completely.');
      return;
    }

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

  const formatPrice = (price: number) => `৳ ${Math.round(price).toLocaleString()}`;

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
              <div className="lg:col-span-7 bg-brand-card p-10 rounded-3xl shadow-soft border border-brand-border">
                <div className="mb-10">
                  <h1 className="text-3xl font-heading font-bold text-brand-primary mb-3">Complete Your Order</h1>
                  <p className="text-brand-secondary text-sm font-light">Enter your shipping details. Delivery is handled within 2-5 business days.</p>
                </div>

                <form id="orderForm" onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent border-b border-brand-border pb-3">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Full Name</label>
                         <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-300" placeholder="e.g. Adit Hasan" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Phone Number</label>
                         <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-300" placeholder="017XXXXXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Email Address</label>
                       <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-300" placeholder="hello@example.com" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-brand-border pb-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-accent">Shipping Details</h2>
                        <div className="flex items-center gap-1.5 text-[10px] text-brand-muted font-bold uppercase">
                           <MapPin size={12} />
                           Bangladesh
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">District</label>
                           <div className="relative">
                               <select 
                                 required 
                                 name="district" 
                                 value={formData.district} 
                                 onChange={handleDistrictChange} 
                                 className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all appearance-none cursor-pointer"
                               >
                                  <option value="">Select District</option>
                                  {BANGLADESH_LOCATIONS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                               </select>
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
                                  <ArrowRight size={14} className="rotate-90" />
                               </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Upazila / Thana</label>
                           <div className="relative">
                               <select 
                                 required 
                                 name="upazila" 
                                 value={formData.upazila} 
                                 onChange={handleChange} 
                                 disabled={!formData.district}
                                 className={`w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                               >
                                  <option value="">Select Upazila</option>
                                  {availableUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
                                  <ArrowRight size={14} className="rotate-90" />
                               </div>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Detailed Address</label>
                       <textarea required rows={3} name="address" value={formData.address} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all resize-none placeholder:text-gray-300" placeholder="House no, Flat, Road, Area name..." />
                    </div>

                    <div className="bg-brand-bg border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-brand-accent shadow-sm">
                                <Truck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-primary">Delivery Charge</p>
                                <p className="text-[10px] text-brand-secondary font-medium uppercase tracking-wider">Based on your selection</p>
                            </div>
                        </div>
                        <div className="text-right">
                           {hasFreeDelivery ? (
                               <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                   <Truck size={12} />
                                   Free Shipping
                               </div>
                           ) : formData.district ? (
                               <p className="text-lg font-bold text-brand-primary">{formatPrice(baseDeliveryCharge)}</p>
                           ) : (
                               <p className="text-xs text-brand-muted italic">Select district to see charge</p>
                           )}
                        </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-brand-card p-8 rounded-3xl shadow-soft border border-brand-border overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-accent opacity-20"></div>
                  <h3 className="text-xl font-heading font-bold text-brand-primary mb-6">Order Summary</h3>
                  
                  <div className="space-y-5 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-start text-sm">
                         <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-bg flex-shrink-0">
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col">
                            <span className="text-brand-primary font-bold line-clamp-1 text-xs">{item.name}</span>
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{item.quantity}x • {item.category}</span>
                           </div>
                         </div>
                         <span className="text-brand-primary font-bold text-xs">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-10 border-t border-brand-border pt-6">
                    <div className="flex justify-between text-sm text-brand-secondary">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold text-brand-primary">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-brand-secondary">
                      <span className="font-medium">Delivery</span>
                      <span className={`font-bold ${deliveryCharge === 0 ? 'text-green-600' : 'text-brand-primary'}`}>
                        {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                    <div className="pt-6 border-t border-brand-border flex justify-between items-end">
                      <span className="text-lg font-bold text-brand-primary">Grand Total</span>
                      <div className="flex flex-col items-end">
                          <span className="text-3xl font-heading font-bold text-brand-accent">{formatPrice(total)}</span>
                          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">BDT (৳)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      form="orderForm"
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><span>Confirm Order</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                    <div className="flex items-center justify-center space-x-2 text-brand-muted text-[10px] font-bold uppercase tracking-widest pt-2">
                       <ShieldCheck size={14} className="text-brand-accent" />
                       <span>Direct support available 24/7</span>
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
              <div className="bg-brand-card p-12 rounded-[2rem] shadow-soft border border-brand-border text-center overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-brand-primary -rotate-12"><Truck size={150}/></div>
                
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <CheckCircle2 size={48} className="text-green-600" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-green-200"
                  />
                </div>
                
                <h1 className="text-4xl font-heading font-bold text-brand-primary mb-3 tracking-tight">Order Received</h1>
                <p className="text-brand-secondary mb-10 text-lg font-light">Your vintage curation will be ready shortly.</p>

                <div className="bg-brand-bg border border-brand-border p-10 rounded-3xl mb-10 relative">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-4">Your Tracking Token</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <span className="text-6xl font-heading font-bold text-brand-primary tracking-tighter">{createdOrder?.orderId}</span>
                    <button onClick={copyToken} className="p-4 bg-white rounded-2xl text-brand-muted hover:text-brand-accent hover:shadow-md transition-all group" title="Copy Token">
                        <Copy size={24} className="group-active:scale-90 transition-transform" />
                    </button>
                  </div>
                  <p className="text-xs text-brand-secondary mt-8 max-w-sm mx-auto leading-relaxed italic">Submit this token on our Instagram DM to proceed with payment and confirm shipment.</p>
                </div>

                <div className="space-y-4">
                    <a 
                        href={INSTAGRAM_LINK} 
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#E1306C] transition-all shadow-lg flex items-center justify-center space-x-3 group"
                    >
                        <Instagram size={22} />
                        <span>Confirm via Instagram</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors py-4 uppercase tracking-widest border-b border-transparent hover:border-brand-primary"
                    >
                        Continue Curating
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
