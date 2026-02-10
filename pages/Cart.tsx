
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 bg-brand-gray">
        <div className="p-6 bg-white rounded-full shadow-soft text-gray-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-brand-black">Your cart is empty</h2>
        <Link to="/shop" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-black transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-brand-black mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-2xl shadow-soft flex items-center space-x-6"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="font-bold text-brand-black text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">৳ {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-brand-black">৳ {(item.price * item.quantity).toLocaleString()}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-2xl shadow-soft sticky top-28">
              <h3 className="text-xl font-heading font-bold text-brand-black mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-black">৳ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Delivery charges calculated at checkout</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-3xl font-heading font-bold text-brand-blue">৳ {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/order')}
                className="w-full bg-brand-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
