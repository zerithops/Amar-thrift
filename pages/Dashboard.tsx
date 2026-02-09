
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, RefreshCcw, Package, Clock, User, Phone, MapPin, Mail, ShoppingCart, Plus, List, CreditCard, DollarSign, Truck, Edit2, Save, X } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Order, OrderStatus, PaymentStatus } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [stats, setStats] = React.useState({ totalOrders: 0, totalProducts: 0, pendingOrders: 0, deliveredOrders: 0 });
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // Temp state for editing
  const [editForm, setEditForm] = React.useState({
    deliveryCharge: 0,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const orderData = await firebaseService.getOrders();
    const statData = await firebaseService.getStats();
    setOrders(orderData);
    setStats(statData);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startEdit = (order: Order) => {
    setEditingId(order.id!);
    setEditForm({
      deliveryCharge: order.deliveryCharge || 0,
      status: order.status,
      paymentStatus: order.paymentStatus || PaymentStatus.PENDING
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string, originalOrder: Order) => {
    const newTotal = originalOrder.price + Number(editForm.deliveryCharge);
    
    await firebaseService.updateOrder(id, {
      deliveryCharge: Number(editForm.deliveryCharge),
      total: newTotal,
      status: editForm.status,
      paymentStatus: editForm.paymentStatus
    });
    setEditingId(null);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/_secure-admin-9xA7');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case OrderStatus.CONFIRMED: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case OrderStatus.SHIPPED: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case OrderStatus.DELIVERED: return 'bg-green-500/10 text-green-500 border-green-500/20';
      case OrderStatus.CANCELLED: return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'text-green-500';
      case PaymentStatus.REFUNDED: return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-card border border-white/5 p-6 rounded-3xl space-y-4">
      <div className={`p-3 rounded-2xl w-fit ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-heading font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white">Admin Hub</h1>
          <p className="text-white/40 mt-1">Full control over your shop ecosystem.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/_secure-admin-9xA7/products" className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
            <List size={18} />
            <span>Products</span>
          </Link>
          <Link to="/_secure-admin-9xA7/add-product" className="flex items-center space-x-2 px-6 py-3 bg-brand text-white rounded-xl font-bold transition-all glow-hover">
            <Plus size={18} />
            <span>New Item</span>
          </Link>
          <button onClick={handleLogout} className="p-3 bg-brand/10 text-brand hover:bg-brand hover:text-white rounded-xl transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-500/10 text-blue-500" />
        <StatCard title="Total Items" value={stats.totalProducts} icon={Package} color="bg-purple-500/10 text-purple-500" />
        <StatCard title="Pending" value={stats.pendingOrders} icon={Clock} color="bg-yellow-500/10 text-yellow-500" />
        <StatCard title="Delivered" value={stats.deliveredOrders} icon={Package} color="bg-green-500/10 text-green-500" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-white">Recent Orders</h2>
          <button onClick={fetchData} className="p-2 text-white/40 hover:text-white transition-colors">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><RefreshCcw className="animate-spin text-brand" size={40} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-dark-card rounded-3xl border border-dashed border-white/10">
            <Package size={64} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-bold text-white">No incoming orders</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-dark-card border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  
                  {/* Customer Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-widest">#{order.orderId}</p>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg font-bold text-white">{order.fullName}</p>
                    <div className="text-white/40 text-xs space-y-1">
                      <p className="flex items-center space-x-2"><Mail size={12}/> <span>{order.email}</span></p>
                      <p className="flex items-center space-x-2"><Phone size={12}/> <span>{order.phone}</span></p>
                      <p className="flex items-center space-x-2"><MapPin size={12}/> <span>{order.city}</span></p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Item</p>
                    <p className="text-lg font-bold text-white">{order.productName}</p>
                    <p className="text-white/40 text-xs text-ellipsis overflow-hidden whitespace-nowrap">{order.address}</p>
                  </div>

                  {/* Financials - Editable */}
                  <div className="lg:col-span-3 space-y-2">
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Payment</p>
                    {editingId === order.id ? (
                      <div className="space-y-2 bg-black/20 p-2 rounded-lg">
                         <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Delivery:</span>
                            <input 
                              type="number" 
                              value={editForm.deliveryCharge} 
                              onChange={(e) => setEditForm({...editForm, deliveryCharge: parseInt(e.target.value)})}
                              className="w-16 bg-dark border border-white/10 rounded px-1 py-0.5 text-right text-white"
                            />
                         </div>
                         <div className="flex items-center justify-between text-xs text-white/60">
                           <span>Status:</span>
                           <select 
                            value={editForm.paymentStatus}
                            onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value as PaymentStatus})}
                            className="bg-dark border border-white/10 rounded px-1 py-0.5 text-white"
                           >
                             {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                         <div className="flex justify-between text-xs text-white/60"><span>Price:</span> <span>৳{order.price}</span></div>
                         <div className="flex justify-between text-xs text-white/60"><span>Delivery:</span> <span>৳{order.deliveryCharge || 0}</span></div>
                         <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-1"><span>Total:</span> <span>৳{order.total}</span></div>
                         <div className={`text-xs font-bold uppercase mt-1 ${getPaymentColor(order.paymentStatus || PaymentStatus.PENDING)}`}>
                           {order.paymentStatus || 'Pending'}
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="lg:col-span-3 flex flex-col items-end space-y-3">
                    {editingId === order.id ? (
                      <div className="w-full space-y-2">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value as OrderStatus})}
                          className="w-full bg-dark text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand"
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="flex gap-2">
                           <button onClick={() => saveEdit(order.id!, order)} className="flex-1 bg-brand text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1"><Save size={14}/> Save</button>
                           <button onClick={cancelEdit} className="px-3 bg-white/10 text-white hover:bg-white/20 rounded-lg"><X size={14}/></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest text-center w-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                        <button onClick={() => startEdit(order)} className="flex items-center space-x-1 text-xs text-white/30 hover:text-brand transition-colors">
                          <Edit2 size={12} /> <span>Edit Order</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
