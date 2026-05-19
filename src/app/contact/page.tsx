'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! Our Farm Guru will respond within 2 hours.", { icon: '🌱' });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-24 bg-[#f9f9f7]">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.4em] mb-6">
                  <MessageCircle size={16} />
                  <span>Connect with the farm</span>
                </div>
                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85] mb-12">
                  Get in <br /> <span className="text-primary italic font-serif lowercase">Touch</span>
                </h1>
                
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-primary border border-border">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Line</p>
                      <p className="text-xl font-black text-foreground">+91 89258 78327</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="w-14 h-14 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-primary border border-border">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email Support</p>
                      <p className="text-xl font-black text-foreground">info.thefarmersfactory@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="w-14 h-14 shrink-0 bg-white shadow-lg rounded-2xl flex items-center justify-center text-primary border border-border">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Main Hub</p>
                      <p className="text-xl font-black text-foreground">No 17 , Kovalan street, 2nd main road,<br />Uthandi kanathur, Chennai 600119</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-10 md:p-16 border border-border shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={120} className="text-primary" />
              </div>
              
              <h3 className="text-2xl font-black uppercase mb-8">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-muted/20 border border-border rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                    <input type="email" required placeholder="john@example.com" className="w-full bg-muted/20 border border-border rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                  <select className="w-full bg-muted/20 border border-border rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Farmer Partnership</option>
                    <option>Bulk/Business Orders</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                  <textarea required rows={4} placeholder="How can we help you?" className="w-full bg-muted/20 border border-border rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none" />
                </div>
                
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
