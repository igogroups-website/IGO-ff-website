'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { getTrendingProducts } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedProducts() {
  const products = getTrendingProducts(8);

  return (
    <section>
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div>
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Today's Selection</span>
          <h2 className="text-5xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.9]">
            Freshly <br />
            <span className="text-primary">Harvested</span>
          </h2>
        </div>
        
        <Link 
          href="/products" 
          className="group flex items-center gap-3 bg-white border-2 border-border/50 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all shadow-sm"
        >
          View Full Catalog
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
