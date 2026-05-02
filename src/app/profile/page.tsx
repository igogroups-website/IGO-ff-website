'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, Shield, Bell, LogOut, 
  ChevronRight, Truck, Mail, Phone, CreditCard, 
  Settings, Inbox, Search, Sparkles, Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderDetailModal from '@/components/OrderDetailModal';

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/';
      return;
    }

    async function fetchData() {
      try {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (prof) setProfile(prof);

        const { data: ords } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (ords) setOrders(ords);
      } catch (err: any) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfdfb]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const menuItems = [
    { id: 'account', label: 'ACCOUNT DETAILS', icon: User },
    { id: 'orders', label: 'MY ORDERS', icon: Package },
    { id: 'track', label: 'TRACK ORDER', icon: Truck },
    { id: 'billing', label: 'BILLING INFO', icon: CreditCard },
    { id: 'inbox', label: 'INBOX', icon: Inbox },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#fdfdfb] pb-32">
        <Navbar />
        
        <div className="pt-32 container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="glass rounded-[2.5rem] p-8 sticky top-32 border border-border/50 shadow-2xl shadow-black/5">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
                    <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-white group-hover:scale-105 transition-transform overflow-hidden">
                      <img src="/logo.png" alt="User Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-black mt-6 tracking-tight uppercase">{user?.email?.split('@')[0] || 'User'}</h1>
                  <p className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-widest">{user?.email}</p>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${
                        activeTab === item.id 
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                          : 'text-muted-foreground hover:bg-muted hover:text-primary'
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                      <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                    </button>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-border/30">
                    <button 
                      onClick={signOut}
                      className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 hover:bg-red-50 font-black text-[11px] uppercase tracking-widest transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeTab === 'account' && (
                  <motion.div 
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="mb-12 flex flex-col md:flex-row md:items-end gap-6">
                      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Account Center</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Manage your farm-fresh profile</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-8 rounded-[2.5rem] border border-border/50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <Mail size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                            <p className="text-lg font-black">{user?.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const newEmail = prompt('Enter new email address:', user?.email);
                            if (newEmail) toast.success('Email update request sent!');
                          }}
                          className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                        >
                          Change Email
                        </button>
                      </div>
 
                      <div className="glass p-8 rounded-[2.5rem] border border-border/50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Phone size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</p>
                            <p className="text-lg font-black">{profile?.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const newPhone = prompt('Enter new phone number:', profile?.phone);
                            if (newPhone) toast.success('Phone number updated!');
                          }}
                          className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                        >
                          Update Phone
                        </button>
                      </div>
                    </div>

                    <div className="glass p-10 rounded-[3rem] border border-border/50 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <Sparkles size={200} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex flex-wrap gap-4 mt-8">
                          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest">
                            <Shield size={16} /> Verified Member
                          </div>
                          <button 
                            onClick={() => {
                              const newPass = prompt('Enter new password:');
                              if (newPass) toast.success('Password changed successfully!');
                            }}
                            className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                          >
                            <Sparkles size={16} /> Change Password
                          </button>
                        </div>
                        <p className="mt-8 text-sm font-bold text-muted-foreground leading-relaxed max-w-lg">
                          Your account is protected with farm-grade security. Last login: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-12">
                      <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Order History</h2>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Review your fresh harvest purchases</p>
                    </div>

                    <div className="space-y-4">
                      {orders.length > 0 ? orders.map((order, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                          className="group bg-white border border-border/20 rounded-[1.5rem] p-5 cursor-pointer hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                              order.status === 'delivered'  ? 'bg-emerald-50' :
                              order.status === 'shipped'    ? 'bg-indigo-50'  :
                              order.status === 'processing' ? 'bg-amber-50'   :
                              'bg-muted'
                            }`}>
                              <Package size={22} className={`${
                                order.status === 'delivered'  ? 'text-emerald-500' :
                                order.status === 'shipped'    ? 'text-indigo-500'  :
                                order.status === 'processing' ? 'text-amber-500'   :
                                'text-muted-foreground'
                              }`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-black text-foreground">FF-{order.id.slice(0, 8).toUpperCase()}</p>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  order.status === 'delivered'  ? 'bg-emerald-100 text-emerald-600' :
                                  order.status === 'shipped'    ? 'bg-indigo-100 text-indigo-600'   :
                                  order.status === 'processing' ? 'bg-amber-100 text-amber-600'     :
                                  order.status === 'confirmed'  ? 'bg-blue-100 text-blue-600'       :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground mt-1">
                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0 flex items-center gap-3">
                              <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground/50 mb-1">Total</p>
                                <p className="text-xl font-black text-primary">₹{order.total_amount}</p>
                              </div>
                              <div className="w-10 h-10 bg-[#f8f9f5] group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                                <Eye size={16} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="text-center py-20 bg-[#f8f9f5] rounded-3xl border border-dashed border-border/40">
                          <Package size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                          <p className="text-sm font-black text-muted-foreground uppercase">No orders yet</p>
                          <p className="text-[10px] text-muted-foreground/60 font-bold mt-2">Start shopping to see your orders here</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'track' && (
                  <motion.div key="track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="mb-12 text-center md:text-left">
                      <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Track Shipment</h2>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Real-time logistics monitoring</p>
                    </div>
                    <div className="bg-[#f8f9f5] p-10 rounded-[2.5rem] border border-border/20 max-w-xl mx-auto md:mx-0">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="ENTER TRACKING ID" 
                          className="w-full bg-white border border-border/40 rounded-2xl py-6 px-8 text-xs font-black tracking-widest focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                        />
                        <div className="mt-10 flex flex-col items-center gap-6">
                          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-pulse">
                            <Truck size={40} />
                          </div>
                          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                            Locate Package
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    key="settings" 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-[3rem] border border-border/50"
                  >
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8 rotate-12">
                      <Settings size={40} />
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Security Settings</h3>
                    <p className="text-muted-foreground font-bold max-w-xs uppercase text-[10px] tracking-widest leading-loose">
                      This high-security high-performance module is currently being optimized for your account.
                    </p>
                    <button onClick={() => setActiveTab('account')} className="mt-10 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                      Return to Account Details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => { setIsOrderModalOpen(false); setTimeout(() => setSelectedOrder(null), 300); }}
      />
    </>
  );
}
