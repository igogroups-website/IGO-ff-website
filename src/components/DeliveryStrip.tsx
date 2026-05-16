'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Timer, ShieldCheck, Sparkles } from 'lucide-react';

export default function DeliveryStrip() {
  return (
    <div className="bg-primary overflow-hidden py-3">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-16 items-center"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-16">
            <div className="flex items-center gap-3 text-white">
              <Truck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Free Delivery on orders above ₹499</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Timer size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Delivered from Farm to Table in 24h</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Chemical Ripening • Pure Organic</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Zero Waste Packaging</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
