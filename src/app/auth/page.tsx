'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, Leaf, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const redirectPath = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) {
        if (error.message.includes('rate limit exceeded')) {
          throw new Error('Security code limit reached. Please wait a moment before requesting a new one.');
        }
        throw error;
      }
      setOtpSent(true);
      toast.success('Security code sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === 'otp') {
      if (!otp) {
        toast.error('Please enter the security code');
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otp.trim(),
          type: 'email'
        });
        if (error) throw error;
        toast.success('Identity verified! Welcome back.');
        setTimeout(() => {
          router.push(redirectPath);
          router.refresh();
        }, 1000);
      } catch (error: any) {
        toast.error(error.message || 'Invalid security code');
      } finally {
        setLoading(false);
      }
      return;
    }

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
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Your email is not verified yet. Please check your inbox for the confirmation link.');
          }
          if (error.message.includes('rate limit exceeded')) {
            throw new Error('For security reasons, too many requests have been made. Please wait a few minutes and try again.');
          }
          throw error;
        }
        
        toast.success('Welcome back to Farmers Factory!');
      } else {
        // SIGNUP FLOW
        const { data, error } = await supabase.auth.signUp({
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

        if (data?.user && data?.session) {
          toast.success('Account created and logged in!');
        } else {
          toast.success('Account created! Please check your email for verification.');
          setMode('login');
          return;
        }
      }

      // Shared success redirection
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh();
      }, 1000);

    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background with Premium Image and Blur */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.1] scale-105"
          style={{ backgroundImage: 'url("/auth-bg.png")' }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} />
          Back to Farm
        </Link>

        <div className="bg-transparent text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
              <Leaf size={28} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              FARMERS FACTORY
            </span>
          </div>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/10">
              <Sparkles size={12} className="text-orange-500" />
              Premium Organic Access
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Join the Farm'}
            </h1>
            <p className="text-white font-bold text-xl drop-shadow-md">
              {authMethod === 'otp' 
                ? (otpSent ? 'Enter the security code sent to your email.' : 'Sign in securely using a one-time code.')
                : (mode === 'login' 
                    ? 'Enter your credentials to access your secure profile.' 
                    : 'Create your account to start your fresh harvest journey.')}
            </p>
          </div>

          <div className="mb-10 flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
            <button 
              onClick={() => { setAuthMethod('password'); setOtpSent(false); }}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMethod === 'password' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
            >
              Password
            </button>
            <button 
              onClick={() => setAuthMethod('otp')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMethod === 'otp' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
            >
              Secure OTP
            </button>
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
                        placeholder="John Doe"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold placeholder:text-white/20 text-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold placeholder:text-white/20 text-white"
                />
              </div>
            </div>

            {authMethod === 'password' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required={authMethod === 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold placeholder:text-white/20 text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {otpSent && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Security Code (OTP)</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        required={authMethod === 'otp' && otpSent}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-bold tracking-[0.5em] text-center text-white"
                      />
                    </div>
                  </div>
                )}
                
                {!otpSent ? (
                  <button 
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full bg-white/10 border border-white/10 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95"
                  >
                    {loading ? 'Sending...' : 'Send Security Code'}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={handleSendOTP}
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors w-full text-center"
                  >
                    Didn't receive code? Resend
                  </button>
                )}
              </div>
            )}

            {(authMethod === 'password' || otpSent) && (
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#E75129] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#ff613b] transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-orange-500/20 mt-10 group"
              >
                {loading ? 'Processing...' : (authMethod === 'otp' ? 'Verify & Enter' : mode === 'login' ? 'Enter Storefront' : 'Create Account')}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            )}
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-lg font-bold text-white/40 hover:text-white transition-colors"
            >
              {mode === 'login' ? "New customer? " : 'Already have an account? '}
              <span className="text-white hover:underline decoration-primary decoration-2 underline-offset-8">
                {mode === 'login' ? 'Sign up here' : 'Log in here'}
              </span>
            </button>
          </div>

          <p className="mt-16 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
            Authorized Secure Authentication Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <AuthContent />
    </Suspense>
  );
}
