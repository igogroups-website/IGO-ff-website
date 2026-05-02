'use client';

import React, { useEffect, useState } from 'react';
import { 
  getAllOrders, 
  updateOrderStatus,
  getCustomerStats,
  getOrderDetails
} from '@/lib/admin';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  User, 
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Loader2,
  Mail,
  ArrowRight,
  TrendingUp,
  History,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';

function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerStats, setCustomerStats] = useState<any>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchOrders();
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('admin_orders_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
        // Fetch full order data (including customer profile) for the new order
        const { data: orders } = await supabase.from('orders').select('*').eq('id', payload.new.id);
        if (orders && orders[0]) {
          const { data: profile } = await supabase.from('profiles').select('id, full_name, avatar_url, email').eq('id', orders[0].user_id).single();
          const newOrder = { ...orders[0], customer: profile || { full_name: 'Unknown Customer' } };
          setOrders(prev => [newOrder, ...prev]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    const { error } = await updateOrderStatus(orderId, newStatus);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  }

  async function viewCustomerDetails(customer: any) {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
    const stats = await getCustomerStats(customer.id);
    setCustomerStats(stats);
  }

  async function viewOrderDetails(order: any) {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
    const details = await getOrderDetails(order.id);
    setOrderDetails(details);
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'processing': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, Address..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select 
              className="pl-12 pr-10 py-3 rounded-2xl border border-border bg-white appearance-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
          </div>
          <button 
            onClick={fetchOrders}
            className="p-3 rounded-2xl border border-border bg-white hover:bg-muted transition-all"
            title="Refresh"
          >
            <Clock size={20} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <th className="px-8 py-6">Order</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Placed At</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-foreground">#{order.id.slice(0, 8)}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">{order.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-primary font-black overflow-hidden">
                          {order.customer?.avatar_url ? (
                            <img src={order.customer.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <button 
                            onClick={() => viewCustomerDetails(order.customer)}
                            className="text-left font-bold text-sm hover:text-primary transition-colors flex items-center gap-1 group"
                          >
                            {order.customer?.full_name || 'Guest User'}
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin size={10} />
                            {order.delivery_address.slice(0, 30)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-primary">₹{Number(order.total_amount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative group/status">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          className="text-xs font-bold bg-muted/50 hover:bg-muted border-none rounded-lg px-2 py-1 outline-none transition-all cursor-pointer"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="pending">Set Pending</option>
                          <option value="processing">Set Processing</option>
                          <option value="shipped">Set Shipped</option>
                          <option value="delivered">Set Delivered</option>
                          <option value="cancelled">Set Cancelled</option>
                        </select>
                        <button 
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 text-muted-foreground hover:text-primary transition-all"
                          title="View Order Summary"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <ShoppingBag size={48} />
                      <p className="font-black text-xl uppercase tracking-widest">No orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-primary text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-black text-2xl overflow-hidden border-2 border-white/30">
                    {selectedCustomer?.avatar_url ? (
                      <img src={selectedCustomer.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{selectedCustomer?.full_name || 'Guest User'}</h2>
                    <p className="flex items-center gap-1.5 opacity-80 font-bold text-sm">
                      <Mail size={14} />
                      {selectedCustomer?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsCustomerModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {customerStats ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/40 p-6 rounded-3xl border border-border">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <ShoppingBag size={18} />
                          <span className="text-xs font-black uppercase tracking-widest">Total Orders</span>
                        </div>
                        <p className="text-3xl font-black">{customerStats.totalOrders}</p>
                      </div>
                      <div className="bg-muted/40 p-6 rounded-3xl border border-border">
                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                          <TrendingUp size={18} />
                          <span className="text-xs font-black uppercase tracking-widest">Total Spent</span>
                        </div>
                        <p className="text-3xl font-black">₹{customerStats.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <History size={16} />
                        Order History
                      </h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {customerStats.orders.map((o: any) => (
                          <div key={o.id} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all">
                            <div>
                              <p className="font-black">#{o.id.slice(0, 8)}</p>
                              <p className="text-xs text-muted-foreground font-bold">{new Date(o.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-primary">₹{Number(o.total_amount).toLocaleString()}</p>
                              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${getStatusColor(o.status)}`}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold italic">Loading customer stats...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Order Summary</h2>
                  <p className="text-sm text-muted-foreground font-bold">#{selectedOrder?.id.slice(0, 8)} • {new Date(selectedOrder?.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {orderDetails.length > 0 ? (
                  <div className="space-y-6">
                    <div className="divide-y divide-border">
                      {orderDetails.map((item, idx) => (
                        <div key={idx} className="py-4 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden border border-border">
                              {item.products?.image_url ? (
                                <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ShoppingBag size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-black text-lg">{item.products?.name || 'Unknown Product'}</h4>
                              <p className="text-sm text-muted-foreground font-bold">
                                {item.quantity} {item.products?.unit || 'unit'}(s) × ₹{item.price_at_purchase}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xl text-primary">₹{(item.quantity * item.price_at_purchase).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-border space-y-4">
                      <div className="flex justify-between text-muted-foreground font-bold">
                        <span>Delivery Fee</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-black uppercase tracking-widest">Total Amount</span>
                        <span className="text-3xl font-black text-primary">₹{Number(selectedOrder?.total_amount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Delivery Information</h5>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-primary mt-1" />
                          <p className="text-sm font-bold leading-relaxed">{selectedOrder?.delivery_address}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <History size={16} className="text-primary" />
                          <p className="text-sm font-bold">Payment via <span className="uppercase">{selectedOrder?.payment_method}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold italic">Loading order items...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading orders...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
