'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAdminStats, getAllOrders, getRecentVisitors } from '@/lib/admin';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, ordersData, visitorsData] = await Promise.all([
          getAdminStats(),
          getAllOrders(),
          getRecentVisitors()
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
        setRecentVisitors(visitorsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();

    // Set up real-time subscriptions for live updates
    const productsChannel = supabase
      .channel('admin_dashboard_products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        // Refresh stats when products change
        getAdminStats().then(data => setStats(data));
      })
      .subscribe();

    const ordersChannel = supabase
      .channel('admin_dashboard_orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        // Add new order to list and refresh stats
        setRecentOrders(prev => [payload.new, ...prev].slice(0, 5));
        getAdminStats().then(data => setStats(data));
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('admin_dashboard_profiles')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
        // Refresh visitors when profiles are updated (e.g., last_visited_at)
        getRecentVisitors().then(data => setRecentVisitors(data));
      })
      .subscribe();

    // Polling as fallback for visitor status (online/offline)
    const visitorInterval = setInterval(() => {
      getRecentVisitors().then(data => setRecentVisitors(data));
    }, 60000); // Every minute

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(profilesChannel);
      clearInterval(visitorInterval);
    };
  }, []);

  const statCards = [
    { name: 'Total Revenue', value: stats?.totalRevenue || '₹0', icon: <TrendingUp className="text-emerald-500" />, change: '+12%', trend: 'up' },
    { name: 'Total Orders', value: stats?.totalOrders || '0', icon: <ShoppingBag className="text-blue-500" />, change: '+5%', trend: 'up' },
    { name: 'Stock Health', value: `${stats?.activeProducts || 0} items`, icon: <Package className="text-amber-500" />, change: `${stats?.outOfStockCount || 0} Out`, trend: stats?.outOfStockCount > 0 ? 'down' : 'up' },
    { name: 'Live Visitors', value: recentVisitors.filter(v => new Date().getTime() - new Date(v.last_visited_at || 0).getTime() < 300000).length.toString(), icon: <Users className="text-primary" />, change: 'Real-time', trend: 'up' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${
                stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-black">Recent Orders</h3>
            <Link href="/admin/orders" className="text-primary font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-5 font-bold">#{order.id?.slice(0, 8) || 'N/A'}</td>
                      <td className="px-8 py-5 font-bold">{order.customer?.full_name || 'Guest'}</td>
                      <td className="px-8 py-5 font-black text-primary">₹{Number(order.total_amount || 0).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                          order.status === 'processing' ? 'bg-amber-100 text-amber-600' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-xs text-muted-foreground flex items-center justify-end gap-1 font-bold">
                        <Clock size={12} />
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-muted-foreground italic">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Recent Visitors */}
        <div className="space-y-8">
          <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 flex flex-col">
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Quick Actions</h3>
            <div className="space-y-4 flex-1">
              <Link href="/admin/products" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-4 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
                Add New Product
                <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link href="/admin/products" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-4 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
                Manage Inventory
                <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link href="/admin/orders" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-4 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
                Track Orders
                <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>

          {/* Live Visitor Tracking */}
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black tracking-tight">Live Visitors</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Real-time status</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Live Now</span>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {recentVisitors.length > 0 ? (
                recentVisitors.map((visitor, idx) => {
                  const isOnline = new Date().getTime() - new Date(visitor.last_visited_at || 0).getTime() < 300000;
                  return (
                    <motion.div 
                      key={visitor.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 group/item p-2 rounded-2xl hover:bg-slate-50 transition-all"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-primary font-black overflow-hidden border border-slate-200 group-hover/item:scale-110 transition-transform">
                          {visitor.avatar_url ? (
                            <img src={visitor.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{visitor.full_name?.[0] || 'G'}</span>
                          )}
                        </div>
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm text-slate-800 truncate">{visitor.full_name || 'Guest Explorer'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {isOnline ? 'Browsing storefront' : (
                            visitor.last_visited_at ? 
                              new Date(visitor.last_visited_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Offline'
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-md ${
                          isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isOnline ? 'Active' : 'Away'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-10 text-center">
                  <Users size={32} className="mx-auto text-slate-200 mb-2" strokeWidth={1} />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Awaiting visitors...</p>
                </div>
              )}
            </div>

            <Link href="/admin/customers" className="block w-full mt-8 py-4 bg-slate-50 hover:bg-primary hover:text-white transition-all rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-inner">
              View All Customer Insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
