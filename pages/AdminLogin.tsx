
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem('adminSession', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-brand-gray">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-gray-100 p-10 rounded-3xl shadow-soft"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-brand-blue/10 rounded-2xl">
            <Lock className="text-brand-blue" size={32} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-brand-black mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Secure access for staff only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Username</label>
            <input 
              required 
              type="text" 
              value={formData.username} 
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Password</label>
            <input 
              required 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs text-center font-bold">{error}</motion.p>}

          <button type="submit" className="w-full bg-brand-black text-white hover:bg-brand-blue font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">
            <span>SIGN IN</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
