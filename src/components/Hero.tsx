'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import ThreeHero from './ThreeHero';
import { useTranslation } from '@/context/TranslationContext';

interface HeroProps {
  greeting?: string;
}

export default function Hero({ greeting = 'Welcome' }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[95vh] flex items-center pt-36 overflow-hidden">
      {/* 3D Background Scene */}
      <ThreeHero />
      
      {/* Parallax Image Overlay */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
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
              <span>{greeting} • {t('nav.search')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tight uppercase">
              {t('hero.title')} <br /> 
              <span className="text-primary italic font-serif lowercase">In 24 Hours</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed font-medium">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-5 mb-14">
              <Link href="/products" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl shadow-primary/30 text-lg group uppercase tracking-widest text-sm">
                {t('hero.cta')}
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="bg-white/50 backdrop-blur-md text-foreground px-10 py-5 rounded-[2rem] font-black border border-border hover:bg-white transition-all transform hover:scale-105 text-lg shadow-xl shadow-black/5 uppercase tracking-widest text-sm">
                {t('nav.products')}
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 animate-bounce">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-0.5 h-10 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
      </div>
    </section>
  );
}
