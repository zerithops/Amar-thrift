// @ts-nocheck
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_CREDENTIALS } from '../constants';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [loading, setLoading] = React.useState(false);

  // If already logged in
  if (user) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-6">
            <div className="text-center space-y-4">
                <ShieldCheck size={48} className="mx-auto text-brand-muted" />
                <h1 className="text-2xl font-bold text-brand-primary">Access Denied</h1>
                <p className="text-brand-secondary">Your account does not have administrative privileges.</p>
                <button onClick={() => navigate('/')} className="text-sm font-bold underline text-brand-primary">Return Home</button>
            </div>
        </div>
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem('adminSession', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials provided.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-soft border border-brand-border"
      >
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-bg text-brand-primary mb-6 border border-brand-border">
             <ShieldCheck size={28} />
           </div>
           <h1 className="text-3xl font-heading font-bold text-brand-primary mb-2">Staff Access</h1>
           <p className="text-brand-secondary text-sm">Secure portal for Amar Thrift management.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary ml-1">Admin ID</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-400"
              placeholder="Enter ID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary ml-1">Passkey</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white hover:opacity-90 font-bold py-5 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg"
          >
            <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-brand-muted text-[10px] uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
