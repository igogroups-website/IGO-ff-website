'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { FileText, ShoppingCart, Truck, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditions() {
  const sections = [
    {
      title: 'Agreement to Terms',
      icon: Scale,
      content: 'By accessing or using the Farmers Factory platform, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use the website.'
    },
    {
      title: 'Orders and Payments',
      icon: ShoppingCart,
      content: 'All orders placed through our platform are subject to availability and acceptance. Prices are in INR and include all applicable taxes. We reserve the right to modify prices without prior notice.'
    },
    {
      title: 'Delivery and Returns',
      icon: Truck,
      content: 'We strive to deliver your harvest within 24 hours. Due to the perishable nature of organic produce, returns are only accepted if the items are damaged or incorrect upon delivery.'
    },
    {
      title: 'User Responsibilities',
      icon: ShieldAlert,
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 pb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 md:p-20 border border-border shadow-2xl"
        >
          <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.4em] mb-6">
            <FileText size={20} />
            <span>Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none">
            Terms & <span className="text-primary italic font-serif lowercase">Conditions</span>
          </h1>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">{section.title}</h2>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-border">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest text-center">
              Copyright © 2026 Farmers Factory. All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
