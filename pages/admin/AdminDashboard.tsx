// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { firebaseService } from '../../services/firebase';
import { Order, OrderStatus } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0
  });

  React.useEffect(() => {
    const loadStats = async () => {
      const orders = await firebaseService.getOrders();
      const revenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
        delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      });
    };
    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `৳ ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-[#e63946]' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-white' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-500' },
    { title: 'Completed', value: stats.delivered, icon: CheckCircle2, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-heading font-bold text-white">Overview</h2>
        <p className="text-white/40 text-sm">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#141414] border border-white/5 p-6 rounded-2xl hover:border-[#e63946]/20 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-full bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
            <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
         <h3 className="text-lg font-bold text-white mb-6">System Status</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-white/60 text-sm">Database Connected</span>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-white/60 text-sm">Payment Gateway (Instagram) Active</span>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-white/60 text-sm">Frontend Live</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;