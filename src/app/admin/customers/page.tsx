'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, Search, Filter, Mail, Phone, ShoppingBag, 
  Leaf, Trophy, ChevronRight, MoreVertical, 
  ArrowUpRight, ArrowDownRight, UserCheck, Shield, Trash2, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Fetch profiles with a count of their orders
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          orders (
            id,
            total_amount
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process data for CRM
      const processed = (data || []).map(c => {
        const userOrders = c.orders || [];
        const totalSpend = userOrders.reduce((acc: number, o: any) => acc + (Number(o.total_amount) || 0), 0);
        return {
          ...c,
          order_count: userOrders.length,
          ltv: totalSpend,
          impact: userOrders.length * 1.5 // Mock impact based on real order count (1.5kg per order)
        };
      });

      setCustomers(processed);
    } catch (err: any) {
      console.error('CRM Fetch Error:', err.message);
      toast.error('Failed to load real customer data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-primary' },
    { label: 'Total Revenue (LTV)', value: `₹${customers.reduce((acc, c) => acc + (c.ltv || 0), 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Average LTV', value: `₹${Math.round(customers.reduce((acc, c) => acc + (c.ltv || 0), 0) / (customers.length || 1)).toLocaleString()}`, icon: ArrowUpRight, color: 'text-emerald-500' },
    { label: 'Loyalty Points', value: customers.reduce((acc, c) => acc + (c.points || 0), 0).toLocaleString(), icon: Trophy, color: 'text-amber-500' },
  ];

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-2 flex items-center gap-3">
              <Users size={40} className="text-primary" />
              Customer <span className="text-primary italic font-serif lowercase">CRM</span>
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={14} /> {customers.length} Total Customers Joined
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-border/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none min-w-[300px] font-medium"
              />
            </div>
            <button className="p-3 bg-white border border-border/50 rounded-2xl shadow-sm hover:bg-muted transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all cursor-default">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} bg-current/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F3F5]/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50">
                <th className="px-8 py-5">Customer Identity</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5">Green Impact</th>
                <th className="px-8 py-5">Loyalty Tier</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-lg">
                        {customer.full_name?.[0] || customer.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-[#1A1A1A] group-hover:text-primary transition-colors">{customer.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-primary">
                        <ShoppingBag size={12} /> 
                        {customer.order_count} Orders
                      </div>
                      <div className="text-[11px] font-black text-foreground">
                        ₹{customer.ltv?.toLocaleString()} Total Spend
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Leaf size={16} />
                      </div>
                      <span className="text-sm font-black">{customer.impact?.toFixed(1)}kg <span className="text-[10px] text-muted-foreground font-medium uppercase">Saved</span></span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit border border-amber-100 flex items-center gap-1">
                        {customer.points || 0} Points
                        <button 
                          onClick={() => {
                            const newPoints = prompt('Enter new points balance:', customer.points || 0);
                            if (newPoints !== null) {
                              supabase.from('profiles').update({ points: parseInt(newPoints) }).eq('id', customer.id)
                                .then(() => {
                                  toast.success('Points updated');
                                  fetchCustomers();
                                });
                            }
                          }}
                          className="ml-1 hover:text-amber-800"
                        >
                          <Edit size={10} />
                        </button>
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Tier: {customer.ltv > 5000 ? 'Platinum' : customer.ltv > 1000 ? 'Gold' : 'Silver'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-all">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 hover:bg-muted text-muted-foreground rounded-xl transition-all">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Search size={32} />
              </div>
              <p className="font-bold text-muted-foreground">No customers found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
