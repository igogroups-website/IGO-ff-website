'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Globe, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: 'We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This may include your name, email address, phone number, and delivery address.'
    },
    {
      title: 'How We Use Your Data',
      icon: Eye,
      content: 'We use the information we collect to process your orders, provide customer support, and improve our services. This includes sending order confirmations, delivery updates, and personalized recommendations via our AI Guru.'
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: 'We implement state-of-the-art security measures to protect your personal information. Your data is encrypted and stored securely on our production servers, accessible only by authorized personnel.'
    },
    {
      title: 'Cookies and Tracking',
      icon: Globe,
      content: 'We use cookies to enhance your browsing experience, remember your cart items, and analyze website traffic. You can manage your cookie preferences through your browser settings.'
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
            <Shield size={20} />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none">
            Privacy <span className="text-primary italic font-serif lowercase">Policy</span>
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
              Last Updated: May 9, 2026 • Farmers Factory Legal Dept.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
