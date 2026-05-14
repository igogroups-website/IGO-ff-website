'use client';

import React from 'react';
import CategoryCard from './CategoryCard';

const CATEGORIES = [
  {
    name: 'Vegetables',
    image: '/category_vegetables.png',
    count: '20+ Varieties',
    color: 'bg-green-50'
  },
  {
    name: 'Fruits',
    image: '/category_fruits.png',
    count: '15+ Varieties',
    color: 'bg-orange-50'
  },
  {
    name: 'Valluvam Products',
    image: '/category_valluvam.png',
    count: '10+ Essentials',
    color: 'bg-yellow-50'
  }
];

export default function FeaturedCategories() {
  return (
    <section>
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Curated Collections</span>
          <h2 className="text-5xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.9]">
            The Best of <br />
            <span className="text-primary">Nature's Harvest</span>
          </h2>
        </div>
        <p className="text-muted-foreground font-medium max-w-sm text-sm leading-relaxed">
          Sustainably grown, hand-picked, and delivered with love from our farms to your doorstep within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} {...cat} />
        ))}
      </div>
    </section>
  );
}
