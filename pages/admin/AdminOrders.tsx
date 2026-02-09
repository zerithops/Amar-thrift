
import React from 'react';
import { Search, ChevronDown, Check, X, Filter } from 'lucide-react';
import { firebaseService } from '../../services/firebase';
import { Order, OrderStatus, PaymentStatus } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('All');

  const fetchOrders = async () => {
    setLoading(true);
    const data = await firebaseService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    await firebaseService.updateOrder(id, { status });
    fetchOrders(); // Refresh
  };

  const handlePaymentUpdate = async (id: string, paymentStatus: PaymentStatus) => {
    await firebaseService.updateOrder(id, { paymentStatus });
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.phone.includes(searchTerm) ||
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'text-white/50 bg-white/5 border-white/10';
      case OrderStatus.CONFIRMED: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case OrderStatus.SHIPPED: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case OrderStatus.DELIVERED: return 'text-green-500 bg-green-500/10 border-green-500/20';
      case OrderStatus.CANCELLED: return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white">Orders</h2>
          <p className="text-white/40 text-sm">Manage customer purchases.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Name or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-[#e63946] transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', ...Object.values(OrderStatus)].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                statusFilter === s 
                  ? 'bg-[#e63946] text-white border-[#e63946]' 
                  : 'bg-[#141414] text-white/50 border-white/5 hover:border-white/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">Product</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">Total</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">Payment</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-white/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-[#e63946]">{order.orderId}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium text-sm">{order.fullName}</p>
                    <p className="text-white/40 text-xs">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{order.productName}</p>
                    <p className="text-white/40 text-xs truncate max-w-[150px]">{order.address}</p>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">৳ {order.total}</td>
                  <td className="px-6 py-4">
                     <select 
                       value={order.paymentStatus}
                       onChange={(e) => handlePaymentUpdate(order.id!, e.target.value as PaymentStatus)}
                       className={`bg-transparent text-xs font-bold uppercase cursor-pointer outline-none ${
                         order.paymentStatus === PaymentStatus.PAID ? 'text-green-500' : 'text-white/50'
                       }`}
                     >
                       {Object.values(PaymentStatus).map(s => <option key={s} value={s} className="bg-dark text-white">{s}</option>)}
                     </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id!, e.target.value as OrderStatus)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer appearance-none ${getStatusStyle(order.status)}`}
                    >
                       {Object.values(OrderStatus).map(s => <option key={s} value={s} className="bg-dark text-white">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">No orders found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
