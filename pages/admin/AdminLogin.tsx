// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../../constants';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('adminSession') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Fake loading for smooth UX

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
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.05),transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-12 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e63946]/10 text-[#e63946] mb-6">
            <Lock size={20} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Amar Thrift</h1>
          <p className="text-white/40 text-sm tracking-wide">Secure Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Admin ID</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-[#141414] border border-white/5 rounded-lg px-5 py-4 text-white focus:outline-none focus:border-[#e63946] transition-all duration-300 placeholder:text-white/10"
              placeholder="Enter ID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Passkey</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#141414] border border-white/5 rounded-lg px-5 py-4 text-white focus:outline-none focus:border-[#e63946] transition-all duration-300 placeholder:text-white/10"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[#e63946] text-xs font-medium text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-[#e63946] hover:text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-white/20 text-xs">Protected by Amar Thrift Enterprise Security</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;