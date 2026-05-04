'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Leaf, Star, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import ProductDetailModal from './ProductDetailModal';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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
    if (query.length > 1) {
      const filtered = FALLBACK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleProductClick(results[selectedIndex]);
      } else {
        router.push(`/products?search=${query}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for fresh harvest..."
          className="w-full bg-white/50 backdrop-blur-md border border-border/50 rounded-2xl py-3 pl-12 pr-10 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/60 text-sm font-medium"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" size={18} />
        
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden z-[100] max-h-[480px] flex flex-col"
          >
            <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Star size={12} className="fill-current" />
                Quick Results
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {results.length} found
              </span>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-2">
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                    index === selectedIndex ? 'bg-primary/5 translate-x-1' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-lg bg-muted/20 overflow-hidden flex-shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black text-foreground line-clamp-1">{product.name}</span>
                      <span className="text-[8px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-tighter">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground font-medium">{product.unit}</p>
                      <p className="text-xs font-black text-primary">₹{product.price}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className={`text-primary transition-opacity ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                router.push(`/products?search=${query}`);
                setIsOpen(false);
              }}
              className="p-4 bg-muted/30 border-t border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              View all matching products
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
