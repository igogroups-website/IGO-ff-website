'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

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
    // Wait for auth to settle
    if (authLoading) return;

    setLoading(true);
    try {
      if (user?.id) {
        // Logged in user: fetch from Supabase
        const { data, error } = await supabase
          .from('cart')
          .select('*, products(*)')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Handle guest cart migration on login
        const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('farmers_factory_guest_cart') : null;
        if (savedGuest) {
          const guestItems = JSON.parse(savedGuest);
          if (guestItems.length > 0) {
            // Migrate each guest item to DB
            for (const item of guestItems) {
              await supabase.from('cart').insert({
                user_id: user.id,
                product_id: item.product_id,
                quantity: item.quantity
              });
            }
            localStorage.removeItem('farmers_factory_guest_cart');
            // Refetch to get newly migrated items
            return fetchCart();
          }
        }
        
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
        // Guest user: fetch from LocalStorage
        const saved = typeof window !== 'undefined' ? localStorage.getItem('farmers_factory_guest_cart') : null;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Ensure product images are mapped for guest items too
            const guestNormalized = parsed.map((item: any) => ({
              ...item,
              products: {
                ...item.products,
                image_url: item.products?.image_url || (Array.isArray(item.products?.image_urls) ? item.products?.image_urls[0] : null) || ''
              }
            }));
            setCartItems(guestNormalized);
          } catch (e) {
            console.error('Failed to parse guest cart:', e);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.warn('Cart Fetch Notice:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Refetch cart whenever user or auth loading state changes
  useEffect(() => {
    fetchCart();
    
    // Listen for custom cart updates to sync across components
    if (typeof window !== 'undefined') {
      window.addEventListener('cart-updated', fetchCart);
      window.addEventListener('storage', fetchCart);
      return () => {
        window.removeEventListener('cart-updated', fetchCart);
        window.removeEventListener('storage', fetchCart);
      };
    }
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
          if (error) {
            console.error('[Cart] Update error:', error);
            // RLS policy violation — most common cause on live deployment
            if (error.code === '42501' || error.message?.includes('policy')) {
              toast.error('Basket access denied. Please logout and login again.', { duration: 5000 });
            } else {
              toast.error(`Basket error: ${error.message}`, { duration: 5000 });
            }
            throw error;
          }
        } else {
          const { error } = await supabase
            .from('cart')
            .insert({ user_id: user.id, product_id: productId, quantity });
          if (error) {
            console.error('[Cart] Insert error:', error);
            if (error.code === '42501' || error.message?.includes('policy')) {
              toast.error('Basket access denied. Please logout and login again.', { duration: 5000 });
            } else {
              toast.error(`Basket error: ${error.message}`, { duration: 5000 });
            }
            throw error;
          }
        }
        await fetchCart();
      } else {
        // Handle Guest Cart
        const existingIndex = cartItems.findIndex(item => item.product_id === productId);
        let newCart = [...cartItems];
        
        // Normalize product data for guest cart consistency
        const normalizedProduct = productData ? {
          ...productData,
          image_url: productData.image_url || (Array.isArray(productData.image_urls) ? productData.image_urls[0] : null) || ''
        } : null;

        if (existingIndex > -1) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity
          };
        } else {
          let product = normalizedProduct;
          
          if (!product) {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();
            
            if (error || !data) {
              console.error('Failed to fetch product for guest cart:', error);
              toast.error('Failed to load product details. Please refresh.');
              return false;
            }
            product = {
              ...data,
              image_url: data.image_url || (Array.isArray(data.image_urls) ? data.image_urls[0] : null) || ''
            };
          }

          newCart.push({
            id: Math.random().toString(36).substring(7),
            product_id: productId,
            quantity,
            products: product
          });
        }
        
        setCartItems(newCart);
        if (typeof window !== 'undefined') {
          localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
          window.dispatchEvent(new Event('cart-updated'));
          window.dispatchEvent(new Event('storage'));
        }
      }
      // Force explicit UI sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      return true;
    } catch (error: any) {
      console.error('[Cart] addToCart failed:', error);
      // Only show generic toast if a specific one wasn't already shown above
      if (!error?.code && !error?.message?.includes('policy')) {
        toast.error('Could not add to basket. Check your connection and try again.');
      }
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty < 0) return;
    
    if (user) {
      try {
        if (newQty === 0) {
          const { error } = await supabase.from('cart').delete().eq('id', cartItemId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('cart').update({ quantity: newQty }).eq('id', cartItemId);
          if (error) throw error;
        }
        await fetchCart();
      } catch (error: any) {
        console.error('[Cart] updateQuantity failed:', error);
        toast.error('Could not update quantity. Please try again.');
      }
    } else {
      let newCart;
      if (newQty === 0) {
        newCart = cartItems.filter(item => item.id !== cartItemId);
      } else {
        newCart = cartItems.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item);
      }
      setCartItems(newCart);
      localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (user) {
      try {
        const { error } = await supabase.from('cart').delete().eq('id', cartItemId);
        if (error) throw error;
        await fetchCart();
      } catch (error: any) {
        console.error('[Cart] removeItem failed:', error);
        toast.error('Could not remove item. Please try again.');
      }
    } else {
      const newCart = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(newCart);
      localStorage.setItem('farmers_factory_guest_cart', JSON.stringify(newCart));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart-updated'));
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
