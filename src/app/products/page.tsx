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

const PREMIUM_SAMPLES = [
  // VEGETABLES (Updated with Live Premium Images)
  { name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop', description: 'Sweet and crunchy farm carrots.', unit: 'kg' },
  { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=600&auto=format&fit=crop', description: 'Juicy red farm tomatoes.', unit: 'kg' },
  { name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop', description: 'Nutritious green spinach leaves.', unit: 'bundle' },
  { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', unit: 'kg' },
  { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', unit: 'kg' },
  { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', unit: 'kg' },
  { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', unit: 'kg' },
  { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', unit: 'kg' },
  { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', unit: 'kg' },
  { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', unit: 'kg' },
  { name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads.', unit: 'kg' },
  { name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', unit: 'kg' },
  { name: 'Cucumber', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Cucumber.png', description: 'Cool and hydrating fresh cucumbers.', unit: 'kg' },
  
  // FRUITS (Updated with Live Premium Images)
  { name: 'Apple', category: 'Fruits', price: 180.00, image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?q=80&w=600&auto=format&fit=crop', description: 'Sweet and crunchy premium apples.', unit: 'kg', is_seasonal: true },
  { name: 'Mango', category: 'Fruits', price: 150.00, image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop', description: 'Premium Alphonso mangoes.', unit: 'kg', is_seasonal: true },
  { name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop', description: 'Premium red pomegranates.', unit: 'kg' },
  { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', unit: 'dozen' },
  { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', unit: 'piece', is_seasonal: true },
  { name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', unit: 'kg' },
  
  // VALLUVAM PRODUCTS
  { name: 'Coconut Oil', category: 'Valluvam Products', price: 280, image_url: '/Valluvam/coconut-1L.jpg', description: 'Pure, unrefined cold pressed coconut oil.', unit: '1L' },
  { name: 'Groundnut Oil', category: 'Valluvam Products', price: 320, image_url: '/Valluvam/ground-1L.jpg', description: 'Traditional cold pressed groundnut oil.', unit: '1L' },
  { name: 'Sesame Oil', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/sesame-1L.jpg', description: 'Rich and aromatic cold pressed sesame oil.', unit: '1L' },
  { name: 'Palm Jaggery', category: 'Valluvam Products', price: 180, image_url: '/Valluvam/products-plam.jpg', description: 'Authentic palm jaggery with no additives.', unit: '500g' },
  { name: 'Forest Honey', category: 'Valluvam Products', price: 350, image_url: '/Valluvam/products-naatu.jpg', description: 'Raw, unprocessed honey from deep forests.', unit: '500g' },
].map((p, idx) => ({ ...p, id: `live-${idx}`, stock: 100, is_active: true }));

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);

  const categories = ['All', 'Seasonal', 'Fruits', 'Vegetables', 'Valluvam Products'];

  const normalizeProduct = (p: any) => {
    let img = p.image_url || (Array.isArray(p.image_urls) ? p.image_urls[0] : null);
    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('/')) {
      img = '/' + img;
    }
    return {
      ...p,
      category: p.category || (p.category_id === 'cat-veg' ? 'Vegetables' : p.category_id === 'cat-fruit' ? 'Fruits' : p.category_id === 'cat-val' ? 'Valluvam Products' : p.category_id) || '',
      image_url: img || '/placeholder_product.png',
      stock: p.stock !== undefined ? p.stock : (p.in_stock ? 100 : 0)
    };
  };

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').or('is_active.eq.true,is_active.is.null');
      let dbProducts = (data || []).map(normalizeProduct);
      
      const allProductsMap = new Map();
      PREMIUM_SAMPLES.forEach(p => allProductsMap.set(p.name, p));
      dbProducts.forEach(p => allProductsMap.set(p.name, p));
      
      const finalProducts = Array.from(allProductsMap.values());
      setProducts(finalProducts);
      setFilteredProducts(finalProducts);
    } catch (err) {
      setProducts(PREMIUM_SAMPLES);
      setFilteredProducts(PREMIUM_SAMPLES);
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
    let filtered = products;
    if (category === 'Seasonal') filtered = filtered.filter(p => p.is_seasonal);
    else if (category !== 'All') filtered = filtered.filter(p => (p.category || '').toString().toLowerCase() === category.toLowerCase());
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()));
    filtered = filtered.filter(p => Number(p.price) <= priceRange);
    setFilteredProducts(filtered);
  }, [category, searchQuery, priceRange, products]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="bg-[#f9f9f7] pt-40 pb-12">
        <div className="container mx-auto px-6 md:px-10">
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
                <input type="text" placeholder="Search fresh products..." className="w-full bg-white border border-border/60 rounded-[1.5rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-lg shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">{Array(6).fill(0).map((_, i) => (<div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />))}</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}><ProductCard product={product} /></motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50"><h3 className="text-2xl font-black mb-2">No matching products</h3><button onClick={() => { setCategory('All'); setSearchQuery(''); }} className="mt-6 bg-primary text-white px-10 py-4 rounded-full font-black uppercase text-xs">Show All</button></div>}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductListing() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}><ProductsContent /></Suspense>
  );
}
