'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, ChevronDown, Leaf, Loader2, Plus, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addProduct } from '@/lib/admin';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(500);
  const [isSeeding, setIsSeeding] = useState(false);

  const categories = ['All', 'Seasonal', 'Fruits', 'Vegetables', 'Valluvam Products'];

  async function fetchProducts() {
    try {
      setLoading(true);
      
      // Try fetching with the advanced 'is_active' filter
      const { data: activeData, error: activeError } = await supabase
        .from('products')
        .select('*')
        .or('is_active.eq.true,is_active.is.null')
        .order('created_at', { ascending: false });
      
      if (!activeError) {
        setProducts(activeData || []);
        return;
      }

      // FALLBACK: If the first fetch fails (e.g., column is missing), try a basic fetch
      console.warn('Advanced fetch failed, using fallback:', activeError.message);
      const { data: allData, error: allError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('Final Supabase Error:', allError);
        throw allError;
      }
      
      setProducts(allData || []);
    } catch (err) {
      console.error('Final Fetch Failure:', err);
      toast.error('Connection issue. Please refresh or check your database.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    
    const channel = supabase
      .channel('products_listing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleEmergencySeed() {
    setIsSeeding(true);
    const samples = [
      { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
      { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', stock: 100, unit: 'dozen', is_active: true },
      { name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
      { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', stock: 100, unit: 'piece', is_active: true, is_seasonal: true }
    ];

    try {
      let count = 0;
      for (const sample of samples) {
        const { error } = await addProduct(sample);
        if (!error) count++;
      }
      if (count > 0) {
        toast.success(`Successfully added ${count} products!`);
        fetchProducts();
      } else {
        toast.error('Failed to add products.');
      }
    } catch (err) {
      toast.error('Seeding failed');
    } finally {
      setIsSeeding(false);
    }
  }

  useEffect(() => {
    let filtered = products;

    if (category === 'Seasonal') {
      filtered = filtered.filter(p => p.is_seasonal);
    } else if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price <= priceRange);

    setFilteredProducts(filtered);
  }, [category, searchQuery, priceRange, products]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-[#f9f9f7] pt-40 pb-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs mb-3 uppercase tracking-[0.3em]">
                <Leaf size={14} />
                <span>Harvest Catalog</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
                Explore Our <span className="text-primary italic font-serif lowercase">Freshness</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-xs md:text-right">
              Discover {products.length} organic products harvested directly from our farms.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-12 h-fit lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Filter size={18} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Categories</h3>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-between group ${
                      category === cat 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cat === 'Seasonal' && <Star size={16} className={category === 'Seasonal' ? 'text-white' : 'text-accent'} />}
                      {cat}
                    </div>
                    {category === cat && <motion.div layoutId="cat-indicator" className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
              <h3 className="text-lg font-black mb-6">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer mb-4"
              />
              <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-widest">
                <span>₹0</span>
                <span className="text-primary">Up to ₹{priceRange}</span>
              </div>
            </div>

            <div className="p-8 organic-gradient rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Leaf size={120} />
              </div>
              <h4 className="text-xl font-black mb-3 relative z-10">Organic Promise</h4>
              <p className="text-sm opacity-90 leading-relaxed relative z-10 font-medium">
                All our products are 100% pesticide-free and sustainably grown on our local farms.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Professional Search Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center mb-12">
              <div className="relative flex-1 w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                  <Search size={22} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search fresh products..."
                  className="w-full bg-white border border-border/60 rounded-[1.5rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-lg shadow-sm placeholder:text-muted-foreground/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-6 px-4">
                <p className="text-sm font-bold text-muted-foreground/60 whitespace-nowrap">
                  Showing <span className="text-foreground">{filteredProducts.length}</span> products
                </p>
                <div className="h-8 w-px bg-border/60" />
                <button className="flex items-center gap-2 text-sm font-black text-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  Sort <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2">No matching products</h3>
                <p className="text-muted-foreground text-center max-w-xs font-medium mb-8">
                  {products.length === 0 
                    ? "Your store's database is currently empty. Please go to the Admin panel to add products." 
                    : "Try adjusting your filters or search query to find what you're looking for."}
                </p>
                {products.length === 0 ? (
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handleEmergencySeed}
                      disabled={isSeeding}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                      Add All Products from Folder
                    </button>
                    <Link 
                      href="/admin/products"
                      className="text-primary font-bold text-xs uppercase tracking-widest hover:underline text-center"
                    >
                      Go to Admin Panel
                    </Link>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setCategory('All'); setSearchQuery(''); setPriceRange(500); }}
                    className="mt-10 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
export default function ProductListing() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#fdfdfb]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}
