'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, ShieldCheck, Heart } from 'lucide-react';

const FEATURES = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "100% Organic",
    description: "Grown using traditional Vedic methods without any synthetic pesticides or fertilizers."
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "24h Farm-to-Home",
    description: "Harvested at dawn and delivered to your kitchen by dusk for maximum nutrient retention."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Traceable Origin",
    description: "Scan any product to see exactly which farm it came from and when it was harvested."
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Farmer First",
    description: "Direct-to-consumer model ensuring fair pricing for our farmers and better value for you."
  }
];

export default function WhyChooseUs() {
  return (
    <section>
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">The Farmers Factory Difference</span>
        <h2 className="text-5xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-8">
          Why We Are <span className="text-primary">Better</span>
        </h2>
        <p className="text-muted-foreground font-medium text-lg">
          We are not just a marketplace; we are a direct bridge between the soil and your soul.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-10 bg-[#fdfdfb] rounded-[3rem] border border-border/50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg border border-border/50 mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{feature.title}</h3>
            <p className="text-muted-foreground font-medium leading-relaxed text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
