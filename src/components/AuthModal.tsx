'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && (!fullName || !phone))) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw error;
        }
        
        toast.success('Welcome back!');
        onClose();
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            }
          }
        });
        if (error) throw error;
        toast.success('Account created successfully!');
        onClose();
      } else {
        // Forgot password mode
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) throw error;
        toast.success('Reset link sent to your email!');
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto">
          {/* Animated Blurred Background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale-[0.1]"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop")' }}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-all duration-700" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative z-10 w-full max-w-xl p-6 md:p-12 my-8"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-0 right-0 m-4 md:m-0 md:-top-12 md:-right-12 p-3 text-white/60 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="bg-transparent text-white">
              {/* Brand Logo */}
              <div className="flex justify-center md:justify-start mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all overflow-hidden shadow-2xl">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-white">
                    FARMERS FACTORY
                  </span>
                </div>
              </div>

              <div className="mb-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/10">
                  <Sparkles size={12} className="text-orange-500" />
                  Premium Organic Access
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                  {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Farm' : 'Reset Access'}
                </h2>
                <p className="text-white/60 font-medium text-sm">
                  {mode === 'login' 
                    ? 'Enter your credentials to access your secure profile.' 
                    : mode === 'signup' 
                      ? 'Create your account to start your fresh harvest journey.'
                      : 'Provide your email to receive a recovery link.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mode === 'signup' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
                          <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm font-bold placeholder:text-white/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone</label>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone"
                            className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm font-bold placeholder:text-white/20"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm font-bold placeholder:text-white/20"
                    />
                  </div>
                </div>

                {mode !== 'signup' && (
                  <div className={`space-y-2 ${mode === 'forgot' ? 'hidden' : ''}`}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm font-bold placeholder:text-white/20"
                      />
                    </div>
                    {mode === 'login' && (
                      <div className="flex justify-end pt-1">
                        <button 
                          type="button" 
                          onClick={() => setMode('forgot')}
                          className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>
                )}
 
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E75129] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#ff613b] transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-orange-500/20 mt-8 group"
                >
                  {loading ? 'Processing...' : (mode === 'login' ? 'Enter Dashboard' : mode === 'signup' ? 'Join Now' : 'Send Recovery Link')}
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
 
              <div className="mt-10 text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm font-bold text-white/40 hover:text-white transition-colors"
                >
                  {mode === 'login' ? "Don't have an account? " : mode === 'signup' ? 'Already a member? ' : 'Remember your password? '}
                  <span className="text-white hover:underline">
                    {mode === 'login' ? 'Create one here' : mode === 'signup' ? 'Login instead' : 'Back to Login'}
                  </span>
                </button>
              </div>

              <p className="mt-12 text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Protected by Biometric Security & Farmers Privacy Protocol
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

