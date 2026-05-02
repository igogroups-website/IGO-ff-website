'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Package, MapPin, CreditCard, Clock, CheckCircle2,
  Truck, ShoppingBag, Star, ChevronRight, Copy, Check,
  Banknote, Smartphone, AlertCircle, Loader2, Leaf,
  RotateCcw, PhoneCall, MessageSquare, ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
    image_url: string;
    unit?: string;
    category?: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  payment_method: string;
  delivery_promise?: string;
  created_at: string;
  updated_at?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',       icon: ShoppingBag, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Order Confirmed',     icon: CheckCircle2, desc: 'Farmers have confirmed your order' },
  { key: 'processing',label: 'Being Prepared',      icon: Package,      desc: 'Fresh produce is being packed' },
  { key: 'shipped',   label: 'Out for Delivery',    icon: Truck,        desc: 'On the way to your doorstep' },
  { key: 'delivered', label: 'Delivered',           icon: CheckCircle2, desc: 'Delivered successfully!' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function getStepIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status.toLowerCase());
  return idx === -1 ? 0 : idx;
}

function getPaymentIcon(method: string) {
  const m = method?.toLowerCase() || '';
  if (m.includes('upi') || m.includes('gpay') || m.includes('phonepe'))
    return <Smartphone size={20} className="text-purple-500" />;
  if (m.includes('card') || m.includes('credit') || m.includes('debit'))
    return <CreditCard size={20} className="text-blue-500" />;
  if (m.includes('cod') || m.includes('cash'))
    return <Banknote size={20} className="text-amber-500" />;
  return <CreditCard size={20} className="text-primary" />;
}

function getPaymentLabel(method: string) {
  const m = method?.toLowerCase() || '';
  if (m.includes('upi')) return 'UPI Payment';
  if (m.includes('gpay')) return 'Google Pay';
  if (m.includes('phonepe')) return 'PhonePe';
  if (m.includes('card') || m.includes('credit')) return 'Credit / Debit Card';
  if (m.includes('cod') || m.includes('cash')) return 'Cash on Delivery';
  return method || 'Online Payment';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getDeliveredDate(order: Order) {
  if (order.status === 'delivered') {
    const placed = new Date(order.created_at);
    placed.setHours(placed.getHours() + 24);
    return formatDate(placed.toISOString());
  }
  return null;
}

function generateOrderNumber(id: string) {
  return 'FF-' + id.slice(0, 8).toUpperCase();
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderItems();
    }
  }, [isOpen, order]);

  async function fetchOrderItems() {
    if (!order) return;
    setLoading(true);
    const { data } = await supabase
      .from('order_items')
      .select('*, products(*)')
      .eq('order_id', order.id);
    if (data) setOrderItems(data as OrderItem[]);
    setLoading(false);
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(generateOrderNumber(order?.id || ''));
    setCopied(true);
    toast.success('Order ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) return null;

  const currentStep = getStepIndex(order.status);
  const subtotal = orderItems.reduce((acc, item) => acc + item.price_at_purchase * item.quantity, 0);
  const deliveryFee = 0;
  const deliveredDate = getDeliveredDate(order);

  const statusColor = {
    pending:    'bg-slate-100 text-slate-600',
    confirmed:  'bg-blue-100 text-blue-600',
    processing: 'bg-amber-100 text-amber-600',
    shipped:    'bg-indigo-100 text-indigo-600',
    delivered:  'bg-emerald-100 text-emerald-600',
    cancelled:  'bg-red-100 text-red-600',
  }[order.status.toLowerCase()] || 'bg-slate-100 text-slate-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[92vh] border border-white/20"
          >
            {/* Header */}
            <div className="relative bg-[#111111] text-white px-8 pt-8 pb-16 flex-shrink-0 overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute -right-4 top-8 w-32 h-32 rounded-full bg-primary/20" />

              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 rounded-full transition-all z-20 backdrop-blur-md border border-white/10"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Farmers Factory</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Order Details</h2>
              <Link 
                href={`/orders/${order.id}`}
                className="inline-flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:text-white transition-colors mt-2"
              >
                Full Tracking Journey <ExternalLink size={14} />
              </Link>
              
              <div className="flex items-center gap-4 mt-8 flex-wrap">
                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
                  <div className="px-5 py-3 border-r border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-0.5">Order Number</span>
                    <span className="font-mono text-sm font-bold tracking-widest">{generateOrderNumber(order.id)}</span>
                  </div>
                  <button
                    onClick={copyOrderId}
                    className="px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                  </button>
                </div>
                
                <div className={`px-6 py-3 rounded-2xl flex flex-col justify-center ${statusColor}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-0.5">Current Status</span>
                  <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-xs text-white/50 font-bold flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  Placed on {formatDate(order.created_at)} at {formatTime(order.created_at)}
                </span>
                {deliveredDate && (
                  <span className="flex items-center gap-1.5 text-[#A3E635]">
                    <CheckCircle2 size={12} />
                    Delivered on {deliveredDate}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Order Timeline - pulled up to overlap header */}
              <div className="mx-6 -mt-8 bg-white rounded-[1.5rem] shadow-xl border border-border/20 p-6 mb-6">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-5">Order Progress</p>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border/40" />
                  <div
                    className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-700"
                    style={{ height: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />

                  <div className="space-y-5">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex items-center gap-4 relative z-10">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                              isCompleted
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-muted text-muted-foreground/40'
                            } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                          >
                            <Icon size={16} />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-black ${isCompleted ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className={`text-xs font-medium mt-0.5 ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/30'}`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-5 pb-8">
                {/* Products Ordered */}
                <div className="bg-white rounded-[1.5rem] border border-border/20 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-border/20 flex items-center gap-3">
                    <Package size={16} className="text-primary" />
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Items Ordered</p>
                    <span className="ml-auto text-xs text-muted-foreground font-bold">{orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}</span>
                  </div>

                  {loading ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  ) : orderItems.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <AlertCircle size={24} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-bold">No items found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/10">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
                            <img
                              src={item.products?.image_url || ''}
                              alt={item.products?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c'; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-foreground truncate">{item.products?.name}</p>
                            {item.products?.category && (
                              <p className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5 opacity-70">{item.products.category}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-muted-foreground font-bold">Qty: {item.quantity}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-xs text-muted-foreground font-bold">₹{item.price_at_purchase} each</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-black text-primary text-lg">₹{item.price_at_purchase * item.quantity}</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <span className="text-[10px] text-muted-foreground font-bold">5.0</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-[1.5rem] border border-border/20 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                      <MapPin size={16} className="text-blue-500" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Delivery Address</p>
                  </div>
                  <div className="bg-[#f8f9f5] rounded-xl p-4">
                    <p className="font-bold text-foreground leading-relaxed">{order.delivery_address}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-bold">
                    <Truck size={12} className="text-primary" />
                    <span>Delivery Promise: {order.delivery_promise || 'Within 24 hours'}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-[1.5rem] border border-border/20 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                      <CreditCard size={16} className="text-purple-500" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Payment Method</p>
                  </div>
                  <div className="flex items-center gap-4 bg-[#f8f9f5] rounded-xl p-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {getPaymentIcon(order.payment_method)}
                    </div>
                    <div>
                      <p className="font-black text-foreground">{getPaymentLabel(order.payment_method)}</p>
                      <p className="text-xs text-muted-foreground font-bold mt-0.5">
                        {order.status === 'delivered' ? '✓ Payment Completed' : 'Payment Pending on Delivery'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status === 'delivered' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-[1.5rem] border border-border/20 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em]">Price Summary</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-bold">Subtotal ({orderItems.length} items)</span>
                      <span className="font-bold">₹{subtotal || order.total_amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-bold">Delivery Fee</span>
                      <span className="font-bold text-primary">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-bold">Platform Fee</span>
                      <span className="font-bold text-primary">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-border/30 flex justify-between">
                      <span className="font-black text-foreground uppercase tracking-wider text-sm">Total Paid</span>
                      <span className="font-black text-primary text-xl">₹{order.total_amount}</span>
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf size={14} />
                    </div>
                    <p className="text-xs font-bold text-primary">
                      You saved <span className="font-black">₹{Math.round(order.total_amount * 0.15)}</span> on this order vs. market price! 🎉
                    </p>
                  </div>
                </div>

                {/* Help & Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: RotateCcw, label: 'Reorder', color: 'text-primary', bg: 'bg-primary/5 hover:bg-primary/10' },
                    { icon: PhoneCall, label: 'Call Support', color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100' },
                    { icon: MessageSquare, label: 'Help', color: 'text-purple-500', bg: 'bg-purple-50 hover:bg-purple-100' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => toast.success(`${action.label} coming soon!`)}
                      className={`${action.bg} ${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95`}
                    >
                      <action.icon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Order Meta */}
                <div className="bg-white rounded-[1.5rem] border border-border/20 p-6 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Order Information</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Order ID', value: generateOrderNumber(order.id) },
                      { label: 'Order Placed', value: `${formatDate(order.created_at)} · ${formatTime(order.created_at)}` },
                      { label: 'Sold by', value: 'Farmers Factory Direct Farm' },
                      { label: 'GST Invoice', value: 'Available on request' },
                      ...(deliveredDate ? [{ label: 'Delivered On', value: deliveredDate }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-bold">{row.label}</span>
                        <span className="text-xs font-black text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
