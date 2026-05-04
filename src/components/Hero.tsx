'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  greeting?: string;
}

export default function Hero({ greeting = 'Welcome' }: HeroProps) {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-36 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" 
          alt="Farm Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 backdrop-blur-md rounded-2xl text-xs font-black text-primary uppercase tracking-[0.4em] mb-10 border border-primary/20 shadow-xl shadow-primary/5">
              <Sparkles size={16} className="animate-pulse" />
              <span>{greeting} • FRESH FROM FARM</span>
            </div>

            
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tight">
              Fresh from our <span className="text-primary italic font-serif">Farm</span> <br /> to your <span className="text-primary italic font-serif">Kitchen</span>.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed font-medium">
              Experience the true taste of nature with our farm-fresh products. 
              Grown with care, delivered within 24 hours.
            </p>

            <div className="flex flex-wrap gap-5 mb-14">
              <Link href="/products" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl shadow-primary/30 text-lg group">
                Shop Now
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="bg-white/50 backdrop-blur-md text-foreground px-10 py-5 rounded-[2rem] font-black border border-border hover:bg-white transition-all transform hover:scale-105 text-lg shadow-xl shadow-black/5">
                View Categories
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-lg shadow-accent/10">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">24h Delivery</p>
                  <p className="text-xs text-muted-foreground font-bold">Fast & Reliable</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Pure Quality</p>
                  <p className="text-xs text-muted-foreground font-bold">Zero Pesticides</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Floating Elements - Professional Images */}
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          rotate: [0, 15, 0],
          x: [0, 10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[15%] top-[15%] w-48 h-48 opacity-40 hidden lg:block pointer-events-none drop-shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=300&auto=format&fit=crop" 
          alt="Floating Mango"
          className="w-full h-full object-contain rotate-12"
        />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          rotate: [0, -20, 0],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[8%] bottom-[25%] w-40 h-40 opacity-30 hidden lg:block pointer-events-none drop-shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=300&auto=format&fit=crop" 
          alt="Floating Carrot"
          className="w-full h-full object-contain -rotate-12"
        />
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[5%] top-[25%] opacity-20"
      >
        <Sparkles size={60} className="text-primary" />
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 animate-bounce">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-0.5 h-10 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
      </div>
    </section>
  );
}
