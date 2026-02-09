
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MapPin, CheckCircle2, Truck, Home, AlertCircle, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Order, OrderStatus, PaymentStatus } from '../types';

const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundOrder = await firebaseService.getOrderForTracking(orderId, phone);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError('Order not found. Please check your ID and Phone Number.');
    }
    setLoading(false);
  };

  const getStatusStep = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 1;
      case OrderStatus.CONFIRMED: return 2;
      case OrderStatus.SHIPPED: return 3;
      case OrderStatus.DELIVERED: return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  const timelineSteps = [
    { label: 'Pending', icon: AlertCircle },
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'On Way', icon: Truck },
    { label: 'Delivered', icon: Home },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-heading font-bold text-white">Track Your Order</h1>
          <p className="text-white/40">Enter your order details below to check current status.</p>
        </div>

        {/* Search Form */}
        <div className="bg-dark-card border border-white/5 p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Order ID</label>
              <input 
                required
                type="text" 
                placeholder="e.g. X7Y9Z2"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white font-mono tracking-widest uppercase focus:outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Phone Number</label>
              <input 
                required
                type="tel" 
                placeholder="017..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-xl transition-all glow-hover flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Search size={20} /> <span>TRACK NOW</span></>}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center font-bold">
              {error}
            </motion.div>
          )}
        </div>

        {/* Results */}
        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Order Found</p>
                <h2 className="text-2xl font-bold text-white">{order.productName}</h2>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.paymentStatus === PaymentStatus.PAID ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8 bg-dark/50">
               <div className="relative flex justify-between items-center">
                 {/* Progress Bar Background */}
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0" />
                 
                 {/* Active Progress Bar */}
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }} 
                   className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand rounded-full z-0 transition-all duration-1000"
                 />

                 {timelineSteps.map((step, idx) => {
                   const isActive = idx + 1 <= currentStep;
                   const isCurrent = idx + 1 === currentStep;
                   const Icon = step.icon;

                   return (
                     <div key={step.label} className="relative z-10 flex flex-col items-center">
                       <motion.div 
                         initial={{ scale: 0.8 }}
                         animate={{ scale: isActive ? 1 : 0.8 }}
                         className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                           isActive ? 'bg-brand border-dark text-white shadow-lg shadow-brand/40' : 'bg-dark border-white/10 text-white/30'
                         }`}
                       >
                         <Icon size={16} />
                       </motion.div>
                       <p className={`absolute -bottom-8 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${
                         isActive ? 'text-white' : 'text-white/30'
                       }`}>
                         {step.label}
                       </p>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 md:p-8 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Amount</p>
                <p className="text-white font-mono">৳ {order.total.toLocaleString()}</p>
                <p className="text-xs text-white/40">(Incl. Delivery)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Delivery To</p>
                <p className="text-white line-clamp-1">{order.city}</p>
                <p className="text-xs text-white/40 line-clamp-1">{order.address}</p>
              </div>
            </div>

            {order.status === OrderStatus.CANCELLED && (
              <div className="bg-red-500/10 p-4 text-center text-red-500 text-sm font-bold border-t border-red-500/20">
                This order has been cancelled.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
