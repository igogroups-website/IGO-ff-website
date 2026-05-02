'use client';

import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '@/lib/admin';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  User as UserIcon,
  ChevronRight,
  Loader2,
  Calendar,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const data = await getAllCustomers();
    setCustomers(data);
    setLoading(false);
  }

  const filteredCustomers = customers.filter(customer => 
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or address..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-border flex items-center gap-3">
            <Users className="text-primary" size={20} />
            <span className="font-black text-foreground">{customers.length} Total Customers</span>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer, idx) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[2.5rem] border border-border p-8 hover:shadow-xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center text-primary font-black overflow-hidden group-hover:scale-110 transition-transform">
                  {customer.avatar_url ? (
                    <img src={customer.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={32} />
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <ShoppingBag size={14} />
                    <span className="text-sm font-black">{customer.orderCount || 0} Orders</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Customer</span>
                </div>
              </div>

              <h3 className="text-xl font-black mb-4">{customer.full_name || 'Guest User'}</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground group/info">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover/info:text-primary transition-colors">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm font-bold">{customer.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground group/info">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover/info:text-primary transition-colors">
                    <MapPin size={14} />
                  </div>
                  <span className="text-sm font-bold line-clamp-1">{customer.address || 'No address saved'}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground group/info">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover/info:text-primary transition-colors">
                    <Calendar size={14} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Joined {customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : 'Long ago'}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground group/info">
                  <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover/info:text-primary transition-colors">
                    <Eye size={14} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    Last Seen: {customer.last_visited_at ? new Date(customer.last_visited_at).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <Link 
                href={`/admin/orders?search=${customer.full_name}`}
                className="w-full mt-8 py-4 rounded-2xl bg-muted hover:bg-primary hover:text-white transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                View History
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-border">
            <Users className="mx-auto w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <p className="font-black text-xl text-muted-foreground uppercase tracking-widest">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
