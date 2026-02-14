// @ts-nocheck
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

  // If already logged in
  if (user) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    } else {
        // Logged in but not admin
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-6">
            <div className="text-center space-y-4">
                <ShieldCheck size={48} className="mx-auto text-brand-muted" />
                <h1 className="text-2xl font-bold text-brand-primary">Access Denied</h1>
                <p className="text-brand-secondary">Your account does not have administrative privileges.</p>
                <button onClick={() => navigate('/')} className="text-sm font-bold underline">Return Home</button>
            </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div>
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e63946]/10 text-[#e63946] mb-6 border border-[#e63946]/20">
             <ShieldCheck size={28} />
           </div>
           <h1 className="text-4xl font-heading font-bold text-white mb-2">Staff Access</h1>
           <p className="text-white/40">Secure portal for Amar Thrift management.</p>
        </div>

        <button 
            onClick={() => navigate('/login')}
            className="w-full bg-white text-black hover:bg-[#e63946] hover:text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 group shadow-xl"
        >
            <span>Proceed to Login</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[10px] text-white/20 uppercase tracking-widest">Authorized Personnel Only</p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;