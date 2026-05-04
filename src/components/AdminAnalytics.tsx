'use client';

import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, LayoutDashboard, Package, PieChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Total Revenue', value: '₹1,24,500', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Active Orders', value: '48', trend: '+5.2%', isUp: true, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Conversion Rate', value: '3.8%', trend: '-0.4%', isUp: false, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Daily Visitors', value: '1,204', trend: '+18.1%', isUp: true, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
];

const CATEGORIES = [
  { name: 'Vegetables', share: 45, color: 'bg-green-500' },
  { name: 'Fruits', share: 35, color: 'bg-amber-500' },
  { name: 'Valluvam Products', share: 20, color: 'bg-primary' },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 p-8 bg-[#f9f9fb] min-h-screen rounded-[3rem]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-black text-xs mb-1 uppercase tracking-[0.3em]">
            <Activity size={14} />
            <span>Real-time Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Executive Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm text-xs font-bold text-muted-foreground">
            Last 24 Hours
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Performance */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
              <PieChart size={20} className="text-primary" />
              Category Performance
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest underline cursor-pointer">View Detailed Breakdown</span>
          </div>
          
          <div className="space-y-6">
            {CATEGORIES.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-foreground">{cat.name}</span>
                  <span className="text-xs font-black text-primary">{cat.share}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.share}%` }}
                    className={`h-full ${cat.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg. Order</p>
              <p className="text-xl font-black">₹450</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Items/Order</p>
              <p className="text-xl font-black">4.2</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Repeat Rate</p>
              <p className="text-xl font-black text-green-500">62%</p>
            </div>
          </div>
        </div>

        {/* Live Funnel */}
        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3 mb-8">
              <TrendingUp size={20} />
              Live Funnel
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'Browsing', count: 1240, color: 'bg-white/20' },
                { label: 'Add to Cart', count: 480, color: 'bg-white/40' },
                { label: 'Checkout', count: 120, color: 'bg-white/60' },
                { label: 'Paid', count: 48, color: 'bg-white' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span>{step.label}</span>
                    <span>{step.count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${step.color}`} style={{ width: `${(step.count / 1240) * 100}%` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-xs font-bold leading-relaxed opacity-90">
              <span className="font-black">Insight:</span> Conversion is 12% higher than last Monday. Consider a flash sale to boost the current active sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Smart Stock Forecasting */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
              <Package size={20} className="text-primary" />
              Inventory Intelligence
            </h3>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-widest">3 Items Low</span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Fresh Mangoes', stock: 12, velocity: 'High', daysLeft: 2, status: 'Restock Soon', color: 'text-amber-600', bg: 'bg-amber-50' },
              { name: 'Organic Spinach', stock: 5, velocity: 'Critical', daysLeft: 1, status: 'Urgent', color: 'text-red-600', bg: 'bg-red-50' },
              { name: 'Cold Pressed Oil', stock: 45, velocity: 'Stable', daysLeft: 14, status: 'Healthy', color: 'text-green-600', bg: 'bg-green-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${item.bg} ${item.color}`}>
                    {item.stock}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground">{item.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Velocity: {item.velocity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.color}`}>{item.status}</p>
                  <p className="text-xs font-bold text-muted-foreground">{item.daysLeft} days left</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Demand Heatmap */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
              <Activity size={20} className="text-primary" />
              Hourly Demand Forecast
            </h3>
          </div>

          <div className="flex items-end justify-between h-48 gap-2">
            {[40, 65, 85, 100, 75, 45, 30, 55, 90, 80, 60, 35].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className={`w-full rounded-t-lg transition-all ${val > 80 ? 'bg-primary' : 'bg-primary/30'}`} 
                />
                <span className="text-[8px] font-black text-muted-foreground uppercase">{i * 2}h</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted/30 rounded-2xl flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Peak Hour Predicted</p>
            <span className="text-xs font-black text-primary uppercase">08:00 AM - 10:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
