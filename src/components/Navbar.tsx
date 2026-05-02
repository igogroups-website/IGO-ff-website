'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Leaf, X, Bell, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { user, openAuthModal, signOut } = useAuth();
  const { isCartOpen, openCart, closeCart, cartCount } = useCart();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (user) {
      const trackVisit = async () => {
        await supabase
          .from('profiles')
          .update({ last_visited_at: new Date().toISOString() })
          .eq('id', user.id);
      };
      trackVisit();
    }
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass py-1' : 'bg-transparent py-4'
    }`}>
      {/* Premium Top Banner */}
      {!scrolled && (
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] py-2 text-center mb-4 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
          <span className="relative z-10">✨ Free Delivery on all orders above ₹499 ✨</span>
        </motion.div>
      )}
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 overflow-hidden shadow-sm">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover transform scale-110" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary uppercase">
            FARMERS FACTORY
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search for fresh harvest..."
              className="w-full bg-white/50 backdrop-blur-md border border-border/50 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer shadow-sm placeholder:text-muted-foreground/60"
              readOnly
              onClick={() => window.location.href = '/products'}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-hover:text-primary transition-colors" size={20} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all relative group active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={26} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative p-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group"
            aria-label="Open cart"
          >
            <ShoppingCart size={26} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-6 h-6 bg-accent text-accent-foreground text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-accent/20"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-bold text-sm"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                {(user.email?.includes('admin') || user.id === 'mock-user-id') && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-sm font-black uppercase tracking-wider mb-1">
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-sm font-bold text-foreground">
                  <User size={18} className="text-primary" />
                  My Profile
                </Link>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-bold text-red-500 mt-1"
                >
                  <X size={18} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 font-black text-sm active:scale-95 overflow-hidden group/btn relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <User size={20} className="relative z-10" />
              <span className="hidden sm:inline relative z-10">Login</span>
            </Link>
          )}
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </nav>
  );
}

// Separate component for Notifications Drawer
function NotificationsDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const notifications = [
    { id: 1, title: 'Fresh Harvest Arrived!', message: 'Our organic beetroots have just reached the warehouse. Shop now for maximum freshness.', time: '2 min ago', type: 'info', link: '/products' },
    { id: 2, title: 'Order Confirmed', message: 'Your order #FF-12345 has been confirmed and is being prepared for delivery.', time: '1 hour ago', type: 'success', link: '/profile' },
    { id: 3, title: 'Flash Sale Tomorrow', message: 'Get 20% off on all leafy greens starting tomorrow 6 AM.', time: '5 hours ago', type: 'promo', link: '/products' },
  ];

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
          <div>
            <h2 className="text-2xl font-black text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground font-medium">Stay updated with Farmers Factory</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.map((notif) => (
            <Link 
              key={notif.id} 
              href={notif.link}
              onClick={onClose}
              className="block p-5 rounded-2xl border border-border hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  notif.type === 'success' ? 'bg-green-100 text-green-700' : 
                  notif.type === 'promo' ? 'bg-amber-100 text-amber-700' : 
                  'bg-primary/10 text-primary'
                }`}>
                  {notif.type}
                </span>
                <span className="text-xs text-muted-foreground font-medium">{notif.time}</span>
              </div>
              <h3 className="text-base font-black text-foreground mb-1 group-hover:text-primary transition-colors">{notif.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{notif.message}</p>
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-border bg-muted/30">
          <button className="w-full py-4 rounded-2xl bg-white border border-border text-foreground font-black text-sm hover:bg-primary hover:text-white hover:border-primary transition-all">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
