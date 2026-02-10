
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, RefreshCcw, Package, Clock, User, Phone, MapPin, Mail, ShoppingCart, Plus, List, CreditCard, DollarSign, Truck, Edit2, Save, X, Star, Activity } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Order, OrderStatus, PaymentStatus, ActivityLog } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [stats, setStats] = React.useState({ totalOrders: 0, totalProducts: 0, totalReviews: 0, pendingOrders: 0, deliveredOrders: 0 });
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
    const logData = await firebaseService.getActivityLogs();
    
    setOrders(orderData);
    setStats(statData);
    setLogs(logData);
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
    navigate('/admin');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-gray-100 text-gray-600 border-gray-200';
      case OrderStatus.CONFIRMED: return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case OrderStatus.SHIPPED: return 'bg-blue-50 text-brand-blue border-blue-200';
      case OrderStatus.DELIVERED: return 'bg-green-50 text-green-600 border-green-200';
      case OrderStatus.CANCELLED: return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'text-green-600';
      case PaymentStatus.REFUNDED: return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft space-y-4">
      <div className={`p-3 rounded-xl w-fit ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-heading font-bold text-brand-black">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12 bg-brand-gray min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-black">Admin Hub</h1>
          <p className="text-gray-500 mt-1">Full control over your shop ecosystem.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/products" className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-brand-black rounded-xl font-bold transition-all border border-gray-200 shadow-sm">
            <List size={18} />
            <span>Products</span>
          </Link>
          <Link to="/admin-reviews" className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-brand-black rounded-xl font-bold transition-all border border-gray-200 shadow-sm">
            <Star size={18} />
            <span>Reviews</span>
          </Link>
          <Link to="/add-product" className="flex items-center space-x-2 px-6 py-3 bg-brand-black text-white hover:bg-brand-blue rounded-xl font-bold transition-all shadow-md">
            <Plus size={18} />
            <span>New Item</span>
          </Link>
          <button onClick={handleLogout} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl transition-all border border-gray-200 hover:border-red-200">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-50 text-brand-blue" />
        <StatCard title="Total Items" value={stats.totalProducts} icon={Package} color="bg-purple-50 text-purple-600" />
        <StatCard title="Pending" value={stats.pendingOrders} icon={Clock} color="bg-yellow-50 text-yellow-600" />
        <StatCard title="Reviews" value={stats.totalReviews} icon={Star} color="bg-pink-50 text-pink-500" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-brand-black">Recent Orders</h2>
          <button onClick={fetchData} className="p-2 text-gray-400 hover:text-brand-black transition-colors">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><RefreshCcw className="animate-spin text-brand-blue" size={40} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <Package size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-bold text-gray-500">No incoming orders</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-hover transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  
                  {/* Customer Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">#{order.orderId}</p>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg font-bold text-brand-black">{order.fullName}</p>
                    <div className="text-gray-500 text-xs space-y-1">
                      <p className="flex items-center space-x-2"><Mail size={12}/> <span>{order.email}</span></p>
                      <p className="flex items-center space-x-2"><Phone size={12}/> <span>{order.phone}</span></p>
                      <p className="flex items-center space-x-2"><MapPin size={12}/> <span>{order.city}</span></p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="lg:col-span-3 space-y-2">
                    <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Item</p>
                    <p className="text-lg font-bold text-brand-black">{order.productName}</p>
                    <p className="text-gray-500 text-xs text-ellipsis overflow-hidden whitespace-nowrap">{order.address}</p>
                  </div>

                  {/* Financials - Editable */}
                  <div className="lg:col-span-3 space-y-2">
                    <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Payment</p>
                    {editingId === order.id ? (
                      <div className="space-y-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                         <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Delivery:</span>
                            <input 
                              type="number" 
                              value={editForm.deliveryCharge} 
                              onChange={(e) => setEditForm({...editForm, deliveryCharge: parseInt(e.target.value)})}
                              className="w-16 bg-white border border-gray-200 rounded px-1 py-0.5 text-right text-black focus:outline-none focus:border-brand-blue"
                            />
                         </div>
                         <div className="flex items-center justify-between text-xs text-gray-600">
                           <span>Status:</span>
                           <select 
                            value={editForm.paymentStatus}
                            onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value as PaymentStatus})}
                            className="bg-white border border-gray-200 rounded px-1 py-0.5 text-black focus:outline-none focus:border-brand-blue"
                           >
                             {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                         <div className="flex justify-between text-xs text-gray-600"><span>Price:</span> <span>৳{order.price}</span></div>
                         <div className="flex justify-between text-xs text-gray-600"><span>Delivery:</span> <span>৳{order.deliveryCharge || 0}</span></div>
                         <div className="flex justify-between text-sm font-bold text-brand-black border-t border-gray-100 pt-1"><span>Total:</span> <span>৳{order.total}</span></div>
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
                          className="w-full bg-white text-brand-black text-[10px] font-bold uppercase tracking-widest border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-blue"
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="flex gap-2">
                           <button onClick={() => saveEdit(order.id!, order)} className="flex-1 bg-brand-black text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-brand-blue transition-colors"><Save size={14}/> Save</button>
                           <button onClick={cancelEdit} className="px-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg"><X size={14}/></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest text-center w-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                        <button onClick={() => startEdit(order)} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-brand-blue transition-colors">
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

      {/* Activity Log Section */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-2xl font-heading font-bold text-brand-black">Activity Log</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No recent activity recorded.</div>
          ) : (
            <ul className="space-y-4">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start space-x-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="p-2 bg-brand-blue/10 rounded-full text-brand-blue mt-0.5">
                    <Activity size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-brand-black uppercase tracking-wide">{log.action.replace(/_/g, ' ')}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
