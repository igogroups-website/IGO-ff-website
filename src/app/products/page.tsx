'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, ChevronDown, Leaf, Loader2, Plus, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { VERIFIED_INVENTORY } from '@/lib/constants';
import Footer from '@/components/Footer';
import ThreeHero from '@/components/ThreeHero';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);

  const categories = ['All', 'Seasonal', 'Fruits', 'Vegetables', 'Valluvam Products'];

  // Sync category and search state with URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const matched = categories.find(c => c.toLowerCase() === catParam.toLowerCase());
      setCategory(matched || 'All');
    } else {
      setCategory('All');
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const normalizeProduct = (p: any) => {
    let img = p.image_url || (Array.isArray(p.image_urls) ? p.image_urls[0] : null);
    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('/')) {
      img = '/' + img;
    }
    
    // Robust category mapping
    let cat = p.category || '';
    if (!cat && p.category_id) {
      if (p.category_id === 'cat-fruit') cat = 'Fruits';
      else if (p.category_id === 'cat-veg') cat = 'Vegetables';
      else if (p.category_id === 'cat-trad' || p.category_id === 'cat-val') cat = 'Valluvam Products';
      else cat = p.category_id;
    }

    // Ensure a unique ID exists
    const id = p.id || `temp-${p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Math.random().toString(36).substr(2, 9)}`;

    return {
      ...p,
      id,
      category: cat,
      image_url: img || '/placeholder_product.png',
      stock: p.stock !== undefined ? p.stock : (p.in_stock ? 100 : 0),
      is_seasonal: p.is_seasonal === true || p.is_seasonal === 'true'
    };
  };

  async function fetchProducts() {
    try {
      setLoading(true);
      // Fetch all products to handle active/inactive states correctly during merge
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      const dbProducts = (data || []).map(normalizeProduct);
      
      const allProductsMap = new Map();
      
      // 1. Seed with Local Inventory
      VERIFIED_INVENTORY.forEach(p => {
        allProductsMap.set(p.name.toLowerCase().trim(), normalizeProduct(p));
      });
      
      // 2. Merge with Database items
      dbProducts.forEach(p => {
        const key = p.name.toLowerCase().trim();
        if (p.is_active === false) {
          // Explicitly remove if marked as inactive in DB
          allProductsMap.delete(key);
        } else {
          // Overwrite with DB version
          allProductsMap.set(key, p);
        }
      });
      
      const finalProducts = Array.from(allProductsMap.values())
        .sort((a, b) => {
          const orderA = a.order_index ?? 999;
          const orderB = b.order_index ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      setProducts(finalProducts);
    } catch (err) {
      console.error('Fetch failed, using fallbacks:', err);
      setProducts(VERIFIED_INVENTORY.map(normalizeProduct));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    const channel = supabase.channel('products_live').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    // 1. Category Filter
    if (category === 'Seasonal') {
      filtered = filtered.filter(p => p.is_seasonal === true);
    } else if (category !== 'All') {
      filtered = filtered.filter(p => 
        (p.category || '').toString().toLowerCase().trim() === category.toLowerCase().trim()
      );
    }
    
    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.category || '').toLowerCase().includes(q)
      );
    }
    
    // 3. Price Filter
    filtered = filtered.filter(p => Number(p.price) <= priceRange);
    
    setFilteredProducts(filtered);
  }, [category, searchQuery, priceRange, products]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="relative bg-[#f9f9f7] pt-48 pb-20 overflow-hidden">
        <ThreeHero />
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs mb-3 uppercase tracking-[0.3em]"><Leaf size={14} /><span>Harvest Catalog</span></div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">Explore Our <span className="text-primary italic font-serif lowercase">Freshness</span></h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-xs md:text-right">Discover {products.length} live organic products harvested directly from our farms.</p>
          </div>
          <div className="mt-12 flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`flex-shrink-0 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${category === cat ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white text-muted-foreground border border-border/50'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="w-full lg:w-72 space-y-12 h-fit lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-3 mb-8"><div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><Filter size={18} /></div><h3 className="text-xl font-black tracking-tight">Categories</h3></div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-between group ${category === cat ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <div className="flex items-center gap-3">{cat === 'Seasonal' && <Star size={16} className={category === 'Seasonal' ? 'text-white' : 'text-accent'} />}{cat}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
              <h3 className="text-lg font-black mb-6">Price Range</h3>
              <input type="range" min="0" max="2000" step="10" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer mb-4" />
              <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-widest"><span>₹0</span><span className="text-primary">Up to ₹{priceRange}</span></div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-6 items-center mb-12">
              <div className="relative flex-1 w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60"><Search size={22} /></div>
                <input type="text" placeholder="Search fresh products..." className="w-full bg-white border border-border/60 rounded-[1.5rem] py-5 pl-16 pr-16 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-lg shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">{Array(6).fill(0).map((_, i) => (<div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />))}</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id || product.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}><ProductCard product={product} /></motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50"><h3 className="text-2xl font-black mb-2">No matching products</h3><button onClick={() => { setCategory('All'); setSearchQuery(''); }} className="mt-6 bg-primary text-white px-10 py-4 rounded-full font-black uppercase text-xs">Show All</button></div>}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ProductListing() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}><ProductsContent /></Suspense>
  );
}
