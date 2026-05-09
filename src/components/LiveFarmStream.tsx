'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Users, MapPin, Wind, Thermometer, Droplets, Clock } from 'lucide-react';

const STREAMS = [
  { id: 'block-a', name: 'Veggie Block A', location: 'North Field', temp: '28°C', humidity: '65%', wind: '12 km/h', viewers: 124, url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop' },
  { id: 'orchard', name: 'Fruit Orchard', location: 'East Hill', temp: '26°C', humidity: '60%', wind: '8 km/h', viewers: 89, url: 'https://images.unsplash.com/photo-1592394933243-951d39a51535?q=80&w=1200&auto=format&fit=crop' },
  { id: 'greenhouse', name: 'Smart Greenhouse', location: 'Central Hub', temp: '24°C', humidity: '75%', wind: '2 km/h', viewers: 256, url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop' }
];

export default function LiveFarmStream() {
  const [activeStream, setActiveStream] = useState(STREAMS[0]);

  return (
    <section className="py-32 bg-[#0A0A0A] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.4em] mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>24/7 Live Transparency</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Watch Your <br /> <span className="text-primary italic font-serif lowercase">Harvest</span> Grow
            </h2>
          </div>
          <p className="text-white/40 font-medium max-w-xs md:text-right">
            Real-time high-definition streams from our organic plots. Total transparency from soil to basket.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stream Player */}
          <div className="lg:col-span-3">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={activeStream.url} 
                alt={activeStream.name} 
                className="w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              {/* Overlay Info */}
              <div className="absolute top-8 left-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                   <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                   Live: {activeStream.name}
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                   <Users size={12} className="text-primary" />
                   {activeStream.viewers} Watching
                </div>
              </div>

              <div className="absolute top-8 right-8 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                 <MapPin size={12} className="text-primary" />
                 {activeStream.location}
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex flex-wrap items-center justify-between gap-6">
                 <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-white/60 uppercase text-[9px] font-black tracking-widest"><Thermometer size={12} /> Temp</div>
                       <span className="text-xl font-black">{activeStream.temp}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-white/60 uppercase text-[9px] font-black tracking-widest"><Droplets size={12} /> Humidity</div>
                       <span className="text-xl font-black">{activeStream.humidity}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-white/60 uppercase text-[9px] font-black tracking-widest"><Wind size={12} /> Wind</div>
                       <span className="text-xl font-black">{activeStream.wind}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                    <Clock size={14} />
                    Auto-Irrigation: Active
                 </div>
              </div>
            </div>
          </div>

          {/* Stream Selector */}
          <div className="flex flex-col gap-4">
            {STREAMS.map((stream) => (
              <button
                key={stream.id}
                onClick={() => setActiveStream(stream)}
                className={`flex-1 group relative rounded-[2rem] overflow-hidden border transition-all duration-500 ${
                  activeStream.id === stream.id ? 'border-primary ring-2 ring-primary/20' : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={stream.url} alt={stream.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                <div className="relative p-6 flex flex-col justify-end h-full">
                  <h4 className="text-lg font-black uppercase tracking-tight">{stream.name}</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{stream.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
