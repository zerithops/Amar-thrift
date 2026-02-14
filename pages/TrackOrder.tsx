// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, PackageCheck } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Order, OrderStatus } from '../types';

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
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundOrder = await firebaseService.getOrderForTracking(orderId, phone);
    if (foundOrder) setOrder(foundOrder);
    else setError('No order found with provided details.');
    setLoading(false);
  };

  const getStatusStep = (status: OrderStatus) => {
    const statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    return statuses.indexOf(status) + 1;
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-brand-bg px-6 py-24">
      <div className="w-full max-w-lg space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-card shadow-soft text-brand-primary mb-4 border border-brand-border">
            <PackageCheck size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-heading font-bold text-brand-primary">Track Order</h1>
          <p className="text-brand-secondary">Enter your details to see current status.</p>
        </div>

        <form onSubmit={handleTrack} className="space-y-6 bg-brand-card p-10 rounded-3xl shadow-soft border border-brand-border">
          <div className="space-y-6">
            <div>
               <label className="text-xs font-bold text-brand-muted uppercase ml-1 mb-2 block">Order ID</label>
               <input 
                  required
                  type="text" 
                  placeholder="e.g. X7Y9Z2"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-6 py-4 text-brand-primary font-mono text-sm tracking-widest placeholder:text-brand-muted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                />
            </div>
            <div>
               <label className="text-xs font-bold text-brand-muted uppercase ml-1 mb-2 block">Phone Number</label>
               <input 
                  required
                  type="tel" 
                  placeholder="017..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-6 py-4 text-brand-primary font-mono text-sm tracking-widest placeholder:text-brand-muted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
               />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold uppercase tracking-widest py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span>Track Order</span>}
          </button>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 text-red-500 text-xs text-center font-bold rounded-xl">
              {error}
            </motion.div>
          )}
        </form>

        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-card p-8 rounded-3xl border border-brand-border shadow-soft space-y-8"
          >
            <div className="text-center">
               <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Current Status</p>
               <h2 className="text-3xl font-heading font-bold text-brand-primary">{order.status}</h2>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-4 pb-2">
              <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(getStatusStep(order.status) / 4) * 100}%` }}
                  className="h-full bg-brand-accent"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-muted mt-4">
                <span className={getStatusStep(order.status) >= 1 ? 'text-brand-primary' : ''}>Received</span>
                <span className={getStatusStep(order.status) >= 2 ? 'text-brand-primary' : ''}>Confirmed</span>
                <span className={getStatusStep(order.status) >= 3 ? 'text-brand-primary' : ''}>Shipped</span>
                <span className={getStatusStep(order.status) >= 4 ? 'text-brand-primary' : ''}>Delivered</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] uppercase text-brand-muted mb-1">Item</p>
                <p className="text-sm font-bold text-brand-primary">{order.productName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-brand-muted mb-1">Total Amount</p>
                <p className="text-sm font-bold text-brand-accent">৳ {order.total}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;