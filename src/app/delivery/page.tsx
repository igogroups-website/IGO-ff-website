'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, ShieldCheck, Zap } from 'lucide-react';

export default function DeliveryPage() {
  const regions = [
    { name: 'Chennai Central', status: 'Live: 90min Delivery', color: 'bg-emerald-500' },
    { name: 'OMR & ECR', status: 'Active: 4h Delivery', color: 'bg-emerald-500' },
    { name: 'Anna Nagar', status: 'Live: 60min Delivery', color: 'bg-emerald-500' },
    { name: 'Tambaram', status: 'Next Day Slots Only', color: 'bg-amber-500' },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-24 bg-[#0A0A0A] text-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.4em] mb-6">
                <Truck size={16} />
                <span>Logistics & Fulfillment</span>
              </div>
              <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85]">
                Hyper <br /> <span className="text-primary italic font-serif lowercase">Fresh</span> <br /> Protocol
              </h1>
            </motion.div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[3rem] max-w-sm">
               <Zap className="text-primary mb-4" size={32} />
               <h4 className="text-xl font-black uppercase mb-2">24h Farm-to-Fork</h4>
               <p className="text-white/60 font-medium leading-relaxed">Our proprietary logistics engine ensures produce harvested at 4 AM reaches your kitchen by 4 PM.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20">
               <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock size={28} className="text-white" />
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 text-white">Delivery Slots</h3>
               <ul className="space-y-4 text-white/80 font-bold uppercase text-[10px] tracking-widest">
                  <li className="flex items-center justify-between border-b border-white/10 pb-2"><span>Early Bird</span> <span>6 AM - 9 AM</span></li>
                  <li className="flex items-center justify-between border-b border-white/10 pb-2"><span>Mid Day</span> <span>11 AM - 2 PM</span></li>
                  <li className="flex items-center justify-between border-b border-white/10 pb-2"><span>Sunset</span> <span>5 PM - 8 PM</span></li>
               </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin size={28} className="text-primary" />
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 text-white">Coverage</h3>
               <div className="space-y-4">
                  {regions.map((region, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                       <span className="text-sm font-bold text-white/80">{region.name}</span>
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${region.color} animate-pulse`} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{region.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck size={28} className="text-primary" />
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 text-white">Purity Lock</h3>
               <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">All deliveries are made in temperature-controlled electric vehicles to maintain nutritional integrity.</p>
               <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                  <Package size={14} /> Zero Plastic Packaging
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-10">
           <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Frequently Asked <span className="text-primary italic font-serif lowercase">Questions</span></h2>
              <div className="space-y-6 text-left">
                 <div className="p-8 bg-muted/20 rounded-[2rem] border border-border">
                    <h5 className="text-lg font-black uppercase mb-2">What is the delivery charge?</h5>
                    <p className="text-muted-foreground font-medium">Free delivery on orders above ₹499. For smaller baskets, a flat convenience fee of ₹29 applies.</p>
                 </div>
                 <div className="p-8 bg-muted/20 rounded-[2rem] border border-border">
                    <h5 className="text-lg font-black uppercase mb-2">Do you deliver on Sundays?</h5>
                    <p className="text-muted-foreground font-medium">Yes! Our farm doesn't stop, and neither do we. Sunday deliveries are active for all major regions.</p>
                 </div>
                 <div className="p-8 bg-muted/20 rounded-[2rem] border border-border">
                    <h5 className="text-lg font-black uppercase mb-2">How can I track my order?</h5>
                    <p className="text-muted-foreground font-medium">Once your harvest is dispatched, you'll receive a WhatsApp update with a live tracking link to our electric delivery fleet.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
