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
import { getAdminStats, getAllOrders, getRecentVisitors, getAllProducts } from '@/lib/admin';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LiveVisitorHub from '@/components/LiveVisitorHub';
import ProductMediaManager from '@/components/ProductMediaManager';
import AdminAnalytics from '@/components/AdminAnalytics';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, ordersData, visitorsData, productsData] = await Promise.all([
          getAdminStats(),
          getAllOrders(),
          getRecentVisitors(),
          getAllProducts()
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
        setRecentVisitors(visitorsData);
        setProducts(productsData.data?.slice(0, 3) || []);
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
    <div className="space-y-12">
      <AdminAnalytics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Media Lab and Orders */}
        <div className="lg:col-span-2 space-y-12">
          {/* Professional Media Lab */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Product Media Lab</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Manage high-resolution harvest imagery</p>
              </div>
              <Link href="/admin/products" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All Inventory</Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {products.map(product => (
                <ProductMediaManager 
                  key={product.id} 
                  product={product} 
                  onUpdate={() => getAllProducts().then(res => setProducts(res.data?.slice(0, 3) || []))}
                />
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
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
        </div>

        {/* Sidebar: Quick Actions and Live Tracking */}
        <div className="space-y-12">
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

          <LiveVisitorHub />
        </div>
      </div>
    </div>
  );
}
