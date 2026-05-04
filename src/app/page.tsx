'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Truck, ShieldCheck, ShoppingBag, Star } from 'lucide-react';
import QuickAddCarousel from '@/components/QuickAddCarousel';
import { FALLBACK_PRODUCTS } from '@/lib/constants';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [seasonalProducts, setSeasonalProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    async function fetchProducts() {
      // Fetch featured products from DB but filter strictly
      const { data: featuredData } = await supabase
        .from('products')
        .select('*')
        .or('is_active.eq.true,is_active.is.null')
        .order('created_at', { ascending: false });
      
      // Strict Catalog Policy: Only show items that have valid images and clear names
      const verifiedFeatured = (featuredData || []).filter(p => 
        p.image_url && 
        !p.image_url.includes('unsplash') && 
        p.name.length > 2
      );

      // Supplement with Fallbacks to ensure a full grid
      let finalFeatured = [...verifiedFeatured];
      FALLBACK_PRODUCTS.slice(0, 8).forEach(p => {
        if (!finalFeatured.some(f => f.name === p.name)) {
          finalFeatured.push(p);
        }
      });
      setProducts(finalFeatured.slice(0, 8));

      // Fetch seasonal products strictly
      const { data: seasonalData } = await supabase
        .from('products')
        .select('*')
        .eq('is_seasonal', true)
        .or('is_active.eq.true,is_active.is.null');
      
      const verifiedSeasonal = (seasonalData || []).filter(p => 
        p.image_url && !p.image_url.includes('unsplash')
      );

      let finalSeasonal = [...verifiedSeasonal];
      FALLBACK_PRODUCTS.filter(p => p.is_seasonal).forEach(p => {
        if (!finalSeasonal.some(f => f.name === p.name)) {
          finalSeasonal.push(p);
        }
      });
      setSeasonalProducts(finalSeasonal.slice(0, 4));
      
      setLoading(false);
    }
    fetchProducts();

    const channel = supabase
      .channel('home_products')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        setProducts(current => current.map(p => p.id === payload.new.id ? payload.new : p));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
        setProducts(current => [payload.new, ...current].slice(0, 8));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'products' }, (payload) => {
        setProducts(current => current.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = [
    { name: 'Fruits', count: '12+ Items', image: '/category_fruits.png', color: 'from-orange-500/20 to-red-500/20' },
    { name: 'Vegetables', count: '24+ Items', image: '/category_vegetables.png', color: 'from-green-500/20 to-emerald-500/20' },
    { name: 'Valluvam Products', count: '18+ Items', image: '/category_valluvam.png', color: 'from-amber-500/20 to-orange-500/20' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero greeting={greeting} />

      {/* Categories Section */}
      <section className="py-32 container mx-auto px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-primary font-black text-sm mb-3 uppercase tracking-[0.3em]">
              <Sparkles size={16} />
              <span>Browse Categories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
              OUR FRESH <br /> <span className="text-primary italic font-serif lowercase">Collections</span>
            </h2>
          </div>
          <Link href="/products" className="bg-white px-8 py-4 rounded-2xl border border-border flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5 group">
            View All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <CategoryCard {...cat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seasonal Harvest Section - High Impact */}
      {seasonalProducts.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-white">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-[#1a1a1a] rounded-[3rem] p-8 md:p-20 overflow-hidden relative group">
              {/* Background Image/Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/40 to-black/80 z-0" />
              <img 
                src="/seasonal_harvest_bg.png" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
              />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                  <div className="max-w-2xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-md rounded-full text-xs font-black text-accent uppercase tracking-[0.3em] mb-6 border border-accent/20">
                      <Star size={14} className="fill-accent" />
                      <span>Limited Time Only</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                      SEASONAL <br /> <span className="text-accent italic font-serif">HARVEST</span>
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                      Hand-picked at the peak of perfection. These limited-time items are fresh from our farms and packed with seasonal flavor.
                    </p>
                  </div>
                  
                  <div className="hidden lg:flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center animate-spin-slow">
                      <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white">
                        <Leaf size={40} />
                      </div>
                    </div>
                    <p className="text-white font-black uppercase tracking-widest text-[10px]">100% Organic</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {seasonalProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-16 flex justify-center">
                  <Link 
                    href="/products?category=Seasonal"
                    className="bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-accent hover:text-white transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
                  >
                    View All Seasonal Items
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section - Professional Trust Building */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">
              <Leaf size={12} />
              Our Core Values
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6 uppercase">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              We bridge the gap between the farm and your kitchen, ensuring purity, freshness, and sustainability in every harvest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <Leaf className="text-primary" size={32} />, title: 'Purely Organic', desc: '100% pesticide-free produce grown with natural fertilizers.' },
              { icon: <Truck className="text-primary" size={32} />, title: '24h Delivery', desc: 'Harvested in the morning, on your table by the evening.' },
              { icon: <ShieldCheck className="text-primary" size={32} />, title: 'Quality Assured', desc: 'Every product undergoes a 5-step quality check process.' },
              { icon: <ShoppingBag className="text-primary" size={32} />, title: 'Direct from Farm', desc: 'No middlemen. Better prices for you, better pay for farmers.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 bg-[#f9f9f7] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:items-center text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">
              <Sparkles size={14} />
              <span>Freshly Harvested</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-foreground mb-6 tracking-tighter uppercase leading-none">
              TODAY'S <span className="text-primary italic font-serif lowercase">Highlights</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl font-medium text-lg leading-relaxed">
              Hand-picked from our farms today, these products are our customers' favorites for a reason. Experience purity in every bite.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-border p-4 animate-pulse h-64" />
              ))
            ) : products.length > 0 ? (
              products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <ShoppingBag size={64} />
                  <div>
                    <p className="font-black text-2xl uppercase tracking-widest">No products found</p>
                    <p className="text-sm font-bold">Try refreshing or check back later!</p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-black uppercase tracking-widest text-xs hover:shadow-lg transition-all"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <div className="mt-32">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-black/5 border border-border/40">
                <QuickAddCarousel 
                  products={products.length > 0 ? products : FALLBACK_PRODUCTS.slice(0, 8)} 
                  title="Recommendations for you" 
                  subtitle="Based on today's fresh harvest"
                />
              </div>
            </div>
          )}

          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/products" className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary/10">
              Explore All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">Join our Green Community</h2>
              <p className="text-muted-foreground font-medium">Subscribe to get weekly fresh farm updates, exclusive recipes, and 10% off your first order!</p>
            </div>
            <div className="flex-1 w-full">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full pl-6 pr-32 py-5 rounded-full border-2 border-muted focus:border-primary outline-none font-bold transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 px-8 bg-primary text-white rounded-full font-black uppercase tracking-widest text-xs hover:shadow-lg transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
