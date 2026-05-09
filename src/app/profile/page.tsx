'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, Shield, Bell, LogOut, 
  ChevronRight, Truck, Mail, Phone, CreditCard, 
  Settings, Inbox, Search, Sparkles, Eye, Leaf, Users, Zap, ShoppingBag
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderDetailModal from '@/components/OrderDetailModal';
import SustainabilityDashboard from '@/components/SustainabilityDashboard';
import GroupBuyingSection from '@/components/GroupBuyingSection';

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
    if (!user) { window.location.href = '/'; return; }
    async function fetchData() {
      try {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (prof) setProfile(prof);
        const { data: ords } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (ords) setOrders(ords);
      } catch (err: any) { toast.error('Failed to load profile data'); } finally { setLoading(false); }
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfdfb]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const menuItems = [
    { id: 'account', label: 'ACCOUNT DETAILS', icon: User },
    { id: 'impact', label: 'GREEN IMPACT', icon: Leaf },
    { id: 'community', label: 'COMMUNITY', icon: Users },
    { id: 'orders', label: 'MY ORDERS', icon: Package },
    { id: 'track', label: 'TRACK ORDER', icon: Truck },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#fdfdfb] pb-32">
        <Navbar />
        <div className="pt-32 container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <div className="glass rounded-[2.5rem] p-8 sticky top-32 border border-border/50 shadow-2xl shadow-black/5">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-white overflow-hidden"><img src="/logo.png" alt="User Logo" className="w-full h-full object-cover" /></div>
                  <h1 className="text-3xl font-black mt-6 tracking-tight uppercase">{user?.email?.split('@')[0] || 'User'}</h1>
                  <p className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-widest">{user?.email}</p>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${activeTab === item.id ? 'bg-primary text-white shadow-xl scale-105' : 'text-muted-foreground hover:bg-muted'}`}><item.icon size={20} />{item.label}<ChevronRight size={14} className="ml-auto" /></button>
                  ))}
                  <div className="pt-4 mt-4 border-t border-border/30"><button onClick={signOut} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 hover:bg-red-50 font-black text-[11px] uppercase tracking-widest transition-all"><LogOut size={18} />Sign Out</button></div>
                </nav>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeTab === 'impact' && <motion.div key="impact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><SustainabilityDashboard stats={profile?.impact_stats} /></motion.div>}
                {activeTab === 'community' && <motion.div key="community" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><GroupBuyingSection /></motion.div>}
                {activeTab === 'account' && <motion.div key="account" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8"><div className="mb-12 flex flex-col md:flex-row md:items-end gap-6"><div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white"><img src="/logo.png" alt="Logo" className="w-full h-full object-cover" /></div><div><h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Account Center</h2><p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Manage your farm-fresh profile</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="glass p-8 rounded-[2.5rem] border border-border/50"><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><Mail size={22} /></div><div><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p><p className="text-lg font-black">{user?.email}</p></div></div></div><div className="glass p-8 rounded-[2.5rem] border border-border/50"><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Phone size={22} /></div><div><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</p><p className="text-lg font-black">{profile?.phone || 'Not provided'}</p></div></div></div></div></motion.div>}
                
                {activeTab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden group mb-12">
                      <div className="absolute -right-10 -top-10 opacity-10 group-hover:rotate-12 transition-transform duration-700"><Zap size={200} className="text-primary" /></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.3em] mb-4"><Sparkles size={16} /><span>AI Basket Auto-Pilot</span></div>
                        <h3 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight uppercase tracking-tighter">Smart Replenishment <span className="text-primary italic font-serif lowercase">Activated</span>.</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-10 max-w-lg leading-relaxed">Based on your consumption velocity, we've identified that these household staples are running low. Add them to your basket now to ensure uninterrupted supply.</p>
                        <div className="flex flex-wrap gap-4 mb-10">{['Organic Milk', 'Farm Eggs', 'Red Onions'].map((item, i) => (<div key={i} className="bg-white px-5 py-3 rounded-2xl border border-primary/20 flex items-center gap-3 shadow-sm"><div className="w-2 h-2 bg-primary rounded-full animate-pulse" /><span className="font-bold text-sm">{item}</span></div>))}</div>
                        <button onClick={() => toast.success("Auto-Pilot Basket added to cart!", { icon: '🤖' })} className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-2xl">Approve & Add to Cart</button>
                      </div>
                    </div>
                    <div className="mb-12"><h2 className="text-4xl font-black uppercase tracking-tight mb-2">Order History</h2><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Review your fresh harvest purchases</p></div>
                    <div className="space-y-4">{orders.length > 0 ? orders.map((order) => (<div key={order.id} onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }} className="group bg-white border border-border/20 rounded-[1.5rem] p-5 cursor-pointer hover:shadow-xl transition-all flex items-center gap-4"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-500' : 'bg-muted'}`}><Package size={22} /></div><div className="flex-1"><div className="flex items-center gap-2"><p className="text-sm font-black uppercase">FF-{order.id.slice(0, 8)}</p><span className="px-2 py-0.5 bg-muted rounded-full text-[8px] font-black uppercase">{order.status}</span></div></div><p className="text-xl font-black text-primary">₹{order.total_amount}</p></div>)) : <div className="text-center py-20 bg-muted/20 rounded-[2rem]">No orders yet</div>}</div>
                  </motion.div>
                )}

                {(activeTab === 'track' || activeTab === 'settings') && (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6"><Settings size={40} className="text-muted-foreground animate-spin-slow" /></div>
                    <h3 className="text-2xl font-black uppercase">Feature Under Maintenance</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">We are currently upgrading this module to provide a more seamless experience. Please check back shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <OrderDetailModal order={selectedOrder} isOpen={isOrderModalOpen} onClose={() => { setIsOrderModalOpen(false); }} />
    </>
  );
}
