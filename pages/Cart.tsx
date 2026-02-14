// @ts-nocheck
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-brand-bg px-4">
        <div className="p-8 bg-brand-card rounded-full shadow-soft text-brand-border">
          <ShoppingBag size={64} strokeWidth={1} />
        </div>
        <h2 className="text-3xl font-heading font-bold text-brand-primary text-center">Your cart is currently empty.</h2>
        <Link to="/shop" className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-accent transition-all shadow-lg hover:shadow-xl">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-brand-primary mb-12">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-card p-6 rounded-2xl shadow-soft border border-brand-border/50 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-full sm:w-28 h-28 bg-brand-bg rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="font-heading font-bold text-brand-primary text-lg">{item.name}</h3>
                  <p className="text-brand-secondary text-sm mt-1">৳ {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-4 bg-brand-bg rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-2 rounded-md hover:bg-white text-brand-secondary transition-colors shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center text-brand-primary">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="p-2 rounded-md hover:bg-white text-brand-secondary transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-brand-primary text-lg">৳ {(item.price * item.quantity).toLocaleString()}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-brand-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-brand-card p-8 rounded-3xl shadow-soft border border-brand-border sticky top-28">
              <h3 className="text-xl font-heading font-bold text-brand-primary mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-brand-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-primary">৳ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brand-muted text-xs">
                  <span>Delivery charges calculated at checkout</span>
                </div>
                <div className="pt-6 border-t border-brand-border flex justify-between items-end">
                  <span className="font-bold text-lg text-brand-primary">Total</span>
                  <span className="text-3xl font-heading font-bold text-brand-accent">৳ {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/order')}
                className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg flex items-center justify-center space-x-2"
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