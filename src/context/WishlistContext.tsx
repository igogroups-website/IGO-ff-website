'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    unit: string;
    category: string;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  isWishlistOpen: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select('*, products(*)')
          .eq('user_id', user.id);
        
        if (error) throw error;
        setWishlistItems(data as WishlistItem[] || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest wishlist from localStorage
      const saved = localStorage.getItem('farmers_factory_wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      } else {
        setWishlistItems([]);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (user) {
      const existing = wishlistItems.find(item => item.product_id === productId);
      if (existing) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', existing.id);
        if (error) {
          toast.error('Failed to remove from wishlist');
          return;
        }
        toast.success('Removed from wishlist');
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });
        if (error) {
          toast.error('Failed to add to wishlist');
          return;
        }
        toast.success('Added to wishlist');
      }
      await fetchWishlist();
    } else {
      // Guest Wishlist
      const existingIndex = wishlistItems.findIndex(item => item.product_id === productId);
      let newWishlist = [...wishlistItems];

      if (existingIndex > -1) {
        newWishlist.splice(existingIndex, 1);
        toast.success('Removed from wishlist');
      } else {
        // Fetch product data for the item
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error || !product) {
          toast.error('Failed to fetch product data');
          return;
        }

        newWishlist.push({
          id: Math.random().toString(36).substring(7),
          product_id: productId,
          products: product
        });
        toast.success('Added to wishlist');
      }

      setWishlistItems(newWishlist);
      localStorage.setItem('farmers_factory_wishlist', JSON.stringify(newWishlist));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      isWishlistOpen,
      toggleWishlist,
      isInWishlist,
      openWishlist: () => setIsWishlistOpen(true),
      closeWishlist: () => setIsWishlistOpen(false),
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
