'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Loader2, Eye, Check, ShoppingCart, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { AnimatePresence } from 'framer-motion';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    unit: string;
    category: string;
    description: string;
    stock?: number;
    is_seasonal?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, cartItems, updateQuantity, removeItem } = useCart();
  const [showAddedOverlay, setShowAddedOverlay] = useState(false);

  const cartItem = cartItems.find(item => item.product_id === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;

    setLoading(true);
    try {
      const success = await addToCart(product.id, 1, product);
      if (success) {
        setShowAddedOverlay(true);
        setTimeout(() => setShowAddedOverlay(false), 3000);
      }
    } catch (error: any) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (!cartItem) return;
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      await removeItem(cartItem.id);
    } else {
      await updateQuantity(cartItem.id, newQty);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => setIsDetailOpen(true)}
        className="group bg-white rounded-[2rem] border border-border/50 p-5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer flex flex-col h-full"
      >
        <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 bg-muted/20">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              product.stock === 0 ? 'grayscale opacity-60' : ''
            }`}
          />

          {product.is_seasonal && (
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg z-10">
              Seasonal
            </div>
          )}

          {/* Big Added Overlay */}
          <AnimatePresence>
            {showAddedOverlay && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-30 bg-primary/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mb-4 shadow-2xl">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <h4 className="text-2xl font-black mb-1">ADDED!</h4>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-6">to your harvest basket</p>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push('/cart'); }}
                    className="bg-white text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                  >
                    View Cart
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col flex-1 px-1">
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-2 opacity-70">
              {product.category}
            </p>
            <h3 className="text-xl font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
            <p className="text-sm font-bold text-muted-foreground mt-1">1 {product.unit}</p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-bold line-through opacity-50">₹{Math.round(product.price * 1.2)}</span>
              <span className="text-2xl font-black text-primary">₹{product.price}</span>
            </div>

            {cartItem ? (
              <div className="flex items-center gap-3 bg-primary/10 rounded-2xl p-1 pr-4 border border-primary/20" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => handleUpdateQty(e, -1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-black text-lg text-primary">{cartItem.quantity}</span>
                  <button 
                    onClick={(e) => handleUpdateQty(e, 1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform active:scale-[0.85] shadow-xl relative overflow-hidden group/btn ${
                  product.stock === 0 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                {loading ? (
                  <Loader2 size={20} className="animate-spin relative z-10" />
                ) : (
                  <Plus size={24} className="relative z-10" />
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        product={product}
      />
    </>
  );
}
