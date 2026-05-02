'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { cartCount, cartTotal } = useCart();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="py-20 border-t border-border bg-white relative">
      <div className="container mx-auto px-4 text-center">
        {/* Dynamic Cart Action for Easy Navigation */}
        {cartCount > 0 && (
          <div className="mb-16 p-8 rounded-[3rem] bg-primary/5 border-2 border-dashed border-primary/20 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left">
                <div className="flex items-center gap-2 text-primary font-black text-sm mb-2 uppercase tracking-widest">
                  <ShoppingBag size={18} />
                  <span>Items in your basket</span>
                </div>
                <h3 className="text-3xl font-black text-foreground">You have {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for harvest</h3>
                <p className="text-muted-foreground font-medium mt-1 text-lg">Total Basket Value: <span className="text-primary font-black">₹{cartTotal}</span></p>
              </div>
              <Link 
                href="/cart"
                className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 transform hover:scale-105"
              >
                Buy Now / Checkout
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-border">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-foreground">FARMERS FACTORY</span>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto font-medium">
          Bringing the goodness of nature directly to your doorstep. Organic, fresh, and sustainable harvest for your family.
        </p>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
          <Link href="/products" className="hover:text-primary transition-colors">Shop All</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/delivery" className="hover:text-primary transition-colors">Delivery Info</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        </div>

        <div className="mt-16 pt-8 border-t border-muted/30">
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} FARMERS FACTORY. Cultivating Health, Harvesting Happiness.
          </p>
        </div>
      </div>
    </footer>
  );
}
