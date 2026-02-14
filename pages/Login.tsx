// @ts-nocheck
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, user, profile, loading } = useAuth();
  const location = useLocation();
  
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        await signUpWithEmail(formData.email, formData.password, formData.name);
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    // If user came from a specific page (state.from), go there
    const from = (location.state as any)?.from?.pathname;
    if (from) return <Navigate to={from} replace />;
    
    // Otherwise route based on role
    if (profile?.role === 'admin' || profile?.role === 'staff') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-brand-bg relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-card border border-brand-border p-8 md:p-10 rounded-[2rem] shadow-xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-brand-primary mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-brand-secondary text-sm">
            {isSignUp ? 'Join our community of vintage enthusiasts.' : 'Sign in to manage your orders and account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Full Name</label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                     <input 
                       name="name"
                       required={isSignUp}
                       value={formData.name}
                       onChange={handleChange}
                       type="text" 
                       placeholder="Jane Doe"
                       className="w-full bg-brand-bg border border-brand-border rounded-xl pl-12 pr-4 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all"
                     />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Email Address</label>
             <div className="relative">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
               <input 
                 name="email"
                 required
                 value={formData.email}
                 onChange={handleChange}
                 type="email" 
                 placeholder="jane@example.com"
                 className="w-full bg-brand-bg border border-brand-border rounded-xl pl-12 pr-4 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all"
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Password</label>
             <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
               <input 
                 name="password"
                 required
                 value={formData.password}
                 onChange={handleChange}
                 type="password" 
                 placeholder="••••••••"
                 className="w-full bg-brand-bg border border-brand-border rounded-xl pl-12 pr-4 py-4 text-brand-primary focus:outline-none focus:border-brand-accent transition-all"
               />
             </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex items-start space-x-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100"
            >
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={formLoading}
            className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-accent transition-all shadow-lg flex items-center justify-center space-x-2 mt-4"
          >
            {formLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-sm text-brand-secondary hover:text-brand-primary font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;