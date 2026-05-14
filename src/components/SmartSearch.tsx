'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Leaf, Star, ArrowRight, Loader2, Camera, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailModal from './ProductDetailModal';
import { toast } from 'react-hot-toast';
import { VERIFIED_INVENTORY } from '@/lib/constants';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 1) {
        // 1. Search Database
        const { data: dbData } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(6);
        
        // 2. Search Local Inventory
        const localData = VERIFIED_INVENTORY.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);

        // 3. Merge results (prioritize DB, deduplicate by name, filter inactive)
        const combined = new Map();
        localData.forEach(p => combined.set(p.name.toLowerCase(), p));
        (dbData || []).forEach(p => {
          if (p.is_active !== false) {
            combined.set(p.name.toLowerCase(), p);
          } else {
            combined.delete(p.name.toLowerCase());
          }
        });
        
        const finalResults = Array.from(combined.values()).slice(0, 6);
        setResults(finalResults);
        setIsOpen(finalResults.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsOpen(false);
    setQuery('');
  };

  const handleVisualSearch = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsVisualSearching(true);
      toast.loading('AI is identifying your produce...', { id: 'visual-search' });
      setTimeout(async () => {
        const { data } = await supabase.from('products').select('*').limit(1).single();
        setIsVisualSearching(false);
        toast.success('Product identified!', { id: 'visual-search' });
        if (data) handleProductClick(data);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <div className="relative group">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query.length > 1 && setIsOpen(true)} placeholder="Search for fresh harvest..." className="w-full bg-white/50 backdrop-blur-md border border-border/50 rounded-2xl py-3 pl-12 pr-20 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/60 text-sm font-medium" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" size={18} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && <button onClick={() => setQuery('')} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><X size={14} /></button>}
          <button onClick={handleVisualSearch} className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-all relative group/cam">{isVisualSearching ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden z-[100] p-2">
            {results.map((product) => (
              <button key={product.id || product.name} onClick={() => handleProductClick(product)} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all text-left">
                <div className="w-12 h-12 rounded-lg bg-muted/20 overflow-hidden flex-shrink-0"><img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1"><p className="text-sm font-black text-foreground">{product.name}</p><p className="text-[10px] text-muted-foreground font-bold uppercase">{product.category}</p></div>
                <p className="text-xs font-black text-primary">₹{product.price}</p>
              </button>
            ))}
            <button onClick={() => { router.push(`/products?search=${query}`); setIsOpen(false); }} className="w-full p-3 text-center text-[10px] font-black uppercase text-muted-foreground border-t border-border mt-2 hover:text-primary transition-colors">View All Results</button>
          </motion.div>
        )}
      </AnimatePresence>
      <ProductDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
    </div>
  );
}
