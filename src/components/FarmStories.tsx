'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MessageCircle, Share2, Sparkles, User } from 'lucide-react';

export default function FarmStories() {
  const stories = [
    { id: 1, farmer: 'Arjun', title: 'Morning Harvest', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400&auto=format&fit=crop' },
    { id: 2, farmer: 'Meera', title: 'Organic Secrets', image: 'https://images.unsplash.com/photo-1592919016381-f07ecd5a244a?q=80&w=400&auto=format&fit=crop' },
    { id: 3, farmer: 'Senthil', title: 'Oil Extraction', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop' },
    { id: 4, farmer: 'Kiran', title: 'Soil Quality', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-3">
              <Sparkles size={16} />
              <span>Live from the farm</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
              Farm <span className="text-primary italic font-serif lowercase">Stories</span>
            </h2>
          </div>
          <p className="text-muted-foreground font-medium max-w-xs md:text-right">
            Watch authentic moments directly from our farmers' fields.
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide px-2">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-72 h-[480px] rounded-[2.5rem] relative overflow-hidden group cursor-pointer shadow-2xl shadow-black/10"
            >
              <img 
                src={story.image} 
                alt={story.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-black">
                    {story.farmer[0]}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{story.farmer}</span>
                </div>
                <h4 className="text-xl font-black mb-4">{story.title}</h4>
                
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                   <div className="flex items-center gap-4">
                      <Heart size={20} className="hover:text-red-500 transition-colors" />
                      <MessageCircle size={20} className="hover:text-primary transition-colors" />
                   </div>
                   <Share2 size={20} className="hover:text-primary transition-colors" />
                </div>
              </div>
              
              <div className="absolute top-6 right-6">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                   LIVE
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
