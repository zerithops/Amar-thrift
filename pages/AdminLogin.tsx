
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-dark-card border border-white/5 p-12 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-brand/10 rounded-2xl">
            <Lock className="text-brand" size={40} />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Management Login</h1>
          <p className="text-white/40 text-sm">Secure access for staff only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Username</label>
            <input required type="text" value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))} className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand"/>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Password</label>
            <input required type="password" value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand"/>
          </div>

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-brand text-xs text-center font-medium">{error}</motion.p>}

          <button type="submit" className="w-full bg-white text-dark hover:bg-brand hover:text-white font-bold py-4 rounded-xl transition-all glow-hover">
            SIGN IN
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
