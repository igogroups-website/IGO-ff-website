'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HarvestTicker from '@/components/HarvestTicker';
import FeaturedCategories from '@/components/FeaturedCategories';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseUs from '@/components/WhyChooseUs';
import FarmStories from '@/components/FarmStories';
import LiveFarmStream from '@/components/LiveFarmStream';
import Footer from '@/components/Footer';
import AIRecipeAssistant from '@/components/AIRecipeAssistant';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero greeting="Directly from the Soil" />
      <HarvestTicker />
      
      <div className="container mx-auto px-6 md:px-10 py-20">
        <FeaturedCategories />
      </div>

      <div className="bg-[#f9f9f7] py-20">
        <div className="container mx-auto px-6 md:px-10">
          <FeaturedProducts />
        </div>
      </div>

      <div className="py-20">
        <FarmStories />
      </div>

      {/* NEW: Elite Live Transparency Section */}
      <LiveFarmStream />

      <div className="bg-white py-20">
        <WhyChooseUs />
      </div>

      <Footer />
      <AIRecipeAssistant />
    </main>
  );
}
