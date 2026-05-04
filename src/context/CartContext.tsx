'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    unit: string;
  };
}

interface CartContextType {
  isCartOpen: boolean;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, productData?: any) => Promise<boolean>;
  updateQuantity: (cartItemId: string, newQty: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const fetchCart = useCallback(async () => {
    // Wait for auth to settle before fetching
    if (authLoading) return;

    setLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('cart')
          .select('*, products(*)')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        const normalized = (data || []).map((item: any) => ({
          ...item,
          products: item.products ? {
            ...item.products,
            category: item.products.category || (item.products.category_id === 'cat-veg' ? 'Vegetables' : item.products.category_id === 'cat-fruit' ? 'Fruits' : item.products.category_id) || '',
            image_url: item.products.image_url || (Array.isArray(item.products.image_urls) ? item.products.image_urls[0] : null) || ''
          } : item.products
        }));
        
        setCartItems(normalized as CartItem[]);
      } else {
        // Guest cart from localStorage
        const saved = localStorage.getItem('farmers_factory_guest_cart');
        if (saved) {
          setCartItems(JSON.parse(saved));
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Refetch cart whenever user or auth loading state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1, productData?: any): Promise<boolean> => {
    try {
      if (user) {
        const existing = cartItems.find(item => item.product_id === productId);
        if (existing) {
          const { error } = await supabase
            .from('cart')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart')
            .insert({ user_id: user.id, product_id: productId, quantity });
          if (error) throw error;
        }
        await fetchCart();
      } else {
        // Handle Guest Cart
        const existingIndex = cartItems.findIndex(item => item.product_id === productId);
        let newCart = [...cartItems];
        
        if (existingIndex > -1) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity
          };
        } else {
          // Use provided productData or fetch it
          let product = productData;
          
          if (!product) {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();
            
            if (error || !data) {
              console.error('Failed to fetch product for guest cart:', error);
              return false;
            }
            product = data;
          }

          newCart.push({
            id: Math.random().toString(36).substring(7),
            product_id: productId,
            quantity,
            products: product
          });
        }
        
        setCartItems(newCart);
        localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
      }
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    
    if (user) {
      await supabase.from('cart').update({ quantity: newQty }).eq('id', cartItemId);
      await fetchCart();
    } else {
      const newCart = cartItems.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item);
      setCartItems(newCart);
      localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (user) {
      await supabase.from('cart').delete().eq('id', cartItemId);
      await fetchCart();
    } else {
      const newCart = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(newCart);
      localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.products?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      isCartOpen,
      cartItems,
      cartCount,
      cartTotal,
      loading,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
