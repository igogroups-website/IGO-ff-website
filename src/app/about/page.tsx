'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Leaf, Heart, ShieldCheck, Users, MapPin, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#f9f9f7]">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop" alt="Farm" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.4em] mb-6">
              <Leaf size={16} />
              <span>Our Roots & Values</span>
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black text-foreground tracking-tighter uppercase leading-[0.85] mb-12">
              Purely <br /> <span className="text-primary italic font-serif lowercase">Organic</span> <br /> Legacy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Farmers Factory was born from a simple promise: to reconnect people with the purity of nature. We bridge the gap between organic fields and your home, ensuring every harvest reaches you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-border bg-white">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-black text-primary mb-2">500+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Farmers</p>
            </div>
            <div>
              <p className="text-5xl font-black text-primary mb-2">10k+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Happy Families</p>
            </div>
            <div>
              <p className="text-5xl font-black text-primary mb-2">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Organic Certified</p>
            </div>
            <div>
              <p className="text-5xl font-black text-primary mb-2">24h</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Farm to Home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2072&auto=format&fit=crop" alt="Farmers" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary text-white p-12 rounded-[3rem] shadow-2xl max-w-xs">
                <p className="text-lg font-bold italic">"We don't just sell vegetables; we cultivate a healthier generation."</p>
              </div>
            </div>
            
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Our <span className="text-primary italic font-serif lowercase">Mission</span></h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Heart size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Transparency</h4>
                    <p className="text-muted-foreground font-medium">Watch your harvest grow through our 24/7 live farm streams. No secrets, just nature.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Quality Control</h4>
                    <p className="text-muted-foreground font-medium">Every product undergoes 15 rigorous purity tests before it is packed into your basket.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Users size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Empowering Farmers</h4>
                    <p className="text-muted-foreground font-medium">By eliminating middlemen, we ensure our farmers get 70% more than the market rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
