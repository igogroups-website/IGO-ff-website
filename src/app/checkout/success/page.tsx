'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-48 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-primary/30"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-black mb-4">Order Placed!</h1>
          
          {orderId && (
            <div className="bg-primary/5 border border-primary/10 px-6 py-3 rounded-2xl inline-flex items-center gap-3 mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID:</span>
              <span className="text-lg font-black text-primary font-mono">{orderId}</span>
            </div>
          )}

          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            Thank you for choosing Farmers Factory. Your fresh farm products will be delivered 
            <span className="text-primary font-bold"> within 24 hours</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/orders" 
              className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Package size={20} />
              Track Your Order
            </Link>
            <Link 
              href="/products" 
              className="bg-white border border-border text-foreground px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-muted/50 transition-all"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* Visual Decoration */}
        <div className="mt-24 grid grid-cols-3 gap-8 opacity-20 max-w-2xl w-full">
          <div className="h-1 bg-primary rounded-full" />
          <div className="h-1 bg-primary rounded-full" />
          <div className="h-1 bg-primary rounded-full" />
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccess() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SuccessContent />
    </React.Suspense>
  );
}
