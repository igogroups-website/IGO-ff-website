'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, Shield, Bell, LogOut, 
  ChevronRight, Truck, Mail, Phone, CreditCard, 
  Settings, Inbox, Search, Sparkles, Eye, Leaf, Users, Zap, ShoppingBag, Heart,
  Trophy, Share2, ExternalLink, Clock, CheckCircle2, AlertCircle, HelpCircle, Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderDetailModal from '@/components/OrderDetailModal';
import LoyaltyWallet from '@/components/profile/LoyaltyWallet';
import AddressManager from '@/components/profile/AddressManager';
import Footer from '@/components/Footer';

function OrderCard({ order, onViewDetails }: { order: any, onViewDetails: (order: any) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'processing': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(order)}
      className="bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group mb-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Order #{ (order.order_number || String(order.id).slice(0, 8)).toUpperCase() }</h4>
            <p className="text-sm text-slate-500 font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <div className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
          {order.status}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">Items:</span>
          <span className="font-bold text-slate-700">Multi-item harvest</span>
        </div>
        <div className="text-right">
          <span className="text-primary font-black text-xl">₹{order.total_amount}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'inbox', label: 'Inbox', icon: Bell },
    { id: 'wallet', label: 'FF Wallet', icon: Wallet },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Handle tab switching via URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    
    // Safety check: Redirect if no user
    if (!user) {
      const timer = setTimeout(() => {
        if (!user) window.location.href = '/auth';
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    async function fetchData() {
      try {
        setLoading(true);
        
        // Parallel fetch for speed
        const [profileRes, ordersRes, notifRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user?.id).single(),
          supabase.from('orders').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('notifications').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
        ]);
        
        if (profileRes.error && profileRes.error.code !== 'PGRST116') {
          console.warn('Profile fetch notice:', profileRes.error.message);
        }
        
        const normalizedOrders = (ordersRes.data || []).map((order: any) => ({
          ...order,
          status: order.status?.toLowerCase() === 'placed' ? 'pending' : (order.status?.toLowerCase() || 'pending')
        }));
        setProfile(profileRes.data || null);
        setOrders(normalizedOrders);
        setNotifications(notifRes.data || []);
      } catch (err) {
        console.error('Data sync error:', err);
        toast.error('Failed to sync your profile data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;



  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 selection:text-primary pb-20">
      <Navbar />
      
      {/* Header Section - Blinkit Style */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden border-4 border-white shadow-xl">
              <User size={48} />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">{profile?.full_name || user?.email?.split('@')[0]}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium text-sm">
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-primary" /> {profile?.phone || 'Add phone number'}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-primary" /> {user?.email}</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('settings')}
              className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Settings size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <nav className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-32">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-8 py-5 text-sm font-bold transition-all border-l-4 ${
                    activeTab === tab.id 
                      ? 'bg-primary/5 text-primary border-primary' 
                      : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                  {tab.label}
                  <ChevronRight size={16} className={`ml-auto opacity-40 ${activeTab === tab.id ? 'translate-x-1 opacity-100' : ''}`} />
                </button>
              ))}
              <div className="h-[1px] bg-slate-100 mx-6" />
              <button
                onClick={signOut}
                className="w-full flex items-center gap-4 px-8 py-5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-l-4 border-transparent"
              >
                <LogOut size={20} strokeWidth={1.5} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Orders</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage your recent farm-fresh deliveries</p>
                  </div>
                  
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <OrderCard key={order.id} order={order} onViewDetails={(o) => { setSelectedOrder(o); setIsOrderModalOpen(true); }} />
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <ShoppingBag size={40} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800">No orders yet</h3>
                      <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-medium">When you shop from our farm, your orders will appear here.</p>
                      <button className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20">Start Shopping</button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Inbox Tab */}
              {activeTab === 'inbox' && (
                <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Inbox</h2>
                    <p className="text-slate-500 text-sm font-medium">Updates, order status, and farm news</p>
                  </div>
                  
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`bg-white border p-6 rounded-2xl transition-all ${notif.is_read ? 'border-slate-100' : 'border-primary/30 shadow-md shadow-primary/5'}`}>
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.is_read ? 'bg-slate-50 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                              <Bell size={24} />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900">{notif.title}</h4>
                                <span className="text-xs text-slate-400 font-medium">{new Date(notif.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed">{notif.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Inbox size={40} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800">Inbox is empty</h3>
                      <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-medium">You will receive order updates and important notifications here.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Wallet Tab */}
              {activeTab === 'wallet' && (
                <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">FF Wallet</h2>
                    <p className="text-slate-500 text-sm font-medium">Your rewards and loyalty earnings</p>
                  </div>
                  <div className="bg-white rounded-3xl p-2 border border-slate-100 shadow-sm">
                    <LoyaltyWallet coins={profile?.points || 0} referralCode={profile?.referral_code || 'FF-123'} memberStatus="Gold Member" />
                  </div>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage your delivery locations</p>
                  </div>
                  <AddressManager />
                </motion.div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8 text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Heart size={48} className="mx-auto mb-6 text-slate-200" />
                    <h3 className="text-xl font-black text-slate-800">No favorites found</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-medium">Tap the heart on products to save them for later.</p>
                  </div>
                </motion.div>
              )}

              {/* Help Tab */}
              {activeTab === 'help' && (
                <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Help & Support</h2>
                    <p className="text-slate-500 text-sm font-medium">We're here to help you 24/7</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6"><Inbox size={28} /></div>
                      <h4 className="font-bold text-lg mb-2">Chat with us</h4>
                      <p className="text-slate-500 text-sm mb-6">Our farm experts are online to help you.</p>
                      <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all">Start Chat</button>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><Phone size={28} /></div>
                      <h4 className="font-bold text-lg mb-2">Call Support</h4>
                      <p className="text-slate-500 text-sm mb-6">Give us a call for urgent issues.</p>
                      <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all">Request Call</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
                    <p className="text-slate-500 text-sm font-medium">Update your identity and preferences</p>
                  </div>
                  <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" defaultValue={profile?.full_name} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input type="tel" defaultValue={profile?.phone} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input type="email" value={user?.email} disabled className="w-full bg-slate-100 border border-slate-100 rounded-xl py-3 px-6 text-sm font-bold text-slate-400 cursor-not-allowed" />
                      </div>
                    </div>
                    <button className="bg-primary text-white px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">Save Changes</button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <Footer />
      <OrderDetailModal order={selectedOrder} isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </main>
  );
}
