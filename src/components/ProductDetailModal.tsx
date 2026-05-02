'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    unit: string;
    category: string;
    description: string;
    stock?: number;
    original_price?: number;
    is_seasonal?: boolean;
  } | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showAddedOverlay, setShowAddedOverlay] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen && product) {
      setCurrentProduct(product);
      setQuantity(1);
      setImageError(false);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (isOpen && currentProduct) {
      fetchRelatedProducts();
    }
  }, [isOpen, currentProduct]);

  async function fetchRelatedProducts() {
    if (!currentProduct) return;
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', currentProduct.category)
      .neq('id', currentProduct.id)
      .limit(4);
    setRelatedProducts(data || []);
  }

  if (!currentProduct) return null;

  const handleAction = async (isBuyNow: boolean = false) => {
    if (isBuyNow && !user) {
      toast.error("Please sign in to buy now", { icon: '🔐' });
      onClose();
      setTimeout(() => {
        router.push(`/auth?mode=signup&redirect=/checkout`);
      }, 300);
      return;
    }

    setLoading(true);
    try {
      const success = await addToCart(currentProduct.id, quantity, currentProduct);
      if (!success) throw new Error('Failed to add to cart');

      if (isBuyNow) {
        toast.success('Proceeding to checkout...');
        router.push('/checkout');
      } else {
        setShowAddedOverlay(true);
        setTimeout(() => {
          setShowAddedOverlay(false);
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-white/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-4 bg-white/90 hover:bg-red-500 hover:text-white text-foreground rounded-full transition-all z-20 shadow-xl border border-border group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* Product Image Area */}
            <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-muted/20 relative overflow-hidden flex items-center justify-center">
              {!imageError ? (
                <img 
                  src={currentProduct.image_url} 
                  alt={currentProduct.name} 
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover transition-transform duration-1000 hover:scale-110 ${
                    currentProduct.stock === 0 ? 'grayscale opacity-60' : ''
                  }`}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-8 text-center">
                  <AlertCircle size={48} className="opacity-20" />
                  <p className="font-bold">Image not available</p>
                </div>
              )}
              
              <div className="absolute top-6 left-6 md:top-10 md:left-10">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-border">
                  <Star size={18} className="fill-primary text-primary" />
                  <span className="font-black text-lg">5.0</span>
                </div>
              </div>
            </div>

            {/* Product Info Area */}
            <div className="w-full md:w-1/2 p-8 md:p-14 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col bg-white">
              <div className="mb-10">
                <p className="text-primary font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-3">
                  {currentProduct.category}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight tracking-tight">
                  {currentProduct.name}
                </h2>
                
                <div className="flex items-center gap-6 mb-10">
                  <span className="text-2xl md:text-3xl text-muted-foreground line-through font-bold">
                    ₹{currentProduct.original_price || Math.round(currentProduct.price * 1.2)}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-primary">
                    ₹{currentProduct.price}
                  </span>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-black">
                    SAVE 20%
                  </div>
                </div>
                
                <p className="text-muted-foreground text-lg mb-8 font-medium leading-relaxed">
                  {currentProduct.description}
                </p>

                <div className="space-y-3 bg-muted/30 p-6 rounded-[1.5rem] border border-primary/5">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Weight / Quantity:</p>
                  <p className="text-2xl font-black text-foreground">{currentProduct.unit}</p>
                </div>

                {currentProduct.stock === 0 && (
                  <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-600">
                    <AlertCircle size={24} />
                    <p className="font-black uppercase tracking-tight">This product is currently out of stock</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-8 bg-muted/40 rounded-2xl px-8 py-4 border border-border shadow-inner">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={24} />
                    </button>
                    <span className="text-3xl font-black min-w-[2rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border-2 ${
                      isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-500 shadow-lg shadow-red-100' 
                        : 'bg-white border-border text-muted-foreground hover:border-red-200 hover:text-red-500'
                    }`}
                  >
                    <Heart size={28} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAction(false)}
                    disabled={loading || currentProduct.stock === 0}
                    className={`flex-1 border-2 py-5 rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm ${
                      currentProduct.stock === 0 
                        ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-white border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    <ShoppingBag size={24} />
                    {currentProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => handleAction(true)}
                    disabled={loading || currentProduct.stock === 0}
                    className={`flex-1 py-5 rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${
                      currentProduct.stock === 0 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
                        : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                    }`}
                  >
                    Buy It Now
                  </button>
                </div>
              </div>

                {relatedProducts.length > 0 && (
                  <div className="border-t border-border pt-10">
                    <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-accent rounded-full" />
                      Related Harvest
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {relatedProducts.map((rp) => (
                        <div 
                          key={rp.id}
                          onClick={() => {
                            setCurrentProduct(rp);
                            setQuantity(1);
                            setImageError(false);
                            toast.success(`Viewing ${rp.name}`, { duration: 1000 });
                            // Scroll to top of modal content
                            const modalContent = document.querySelector('.custom-scrollbar');
                            if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group/item flex flex-col gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50 cursor-pointer hover:bg-white hover:shadow-xl transition-all"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden">
                            <img src={rp.image_url} alt={rp.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{rp.category}</p>
                            <h4 className="font-bold text-sm line-clamp-1">{rp.name}</h4>
                            <p className="font-black text-primary">₹{rp.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="h-4" /> {/* Spacer for bottom scroll */}
              </div>

              {/* Added Overlay for Modal */}
              <AnimatePresence>
                {showAddedOverlay && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-10"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <div className="w-32 h-32 bg-white text-primary rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl">
                        <Check size={64} strokeWidth={4} />
                      </div>
                      <h2 className="text-5xl font-black mb-4">ADDED!</h2>
                      <p className="text-xl font-bold opacity-80 mb-12">Successfully added to your harvest</p>
                      <div className="flex flex-col gap-4 max-w-xs mx-auto">
                        <button 
                          onClick={() => router.push('/cart')}
                          className="bg-white text-primary px-10 py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Checkout Now
                        </button>
                        <button 
                          onClick={() => setShowAddedOverlay(false)}
                          className="text-white/80 font-bold uppercase tracking-widest text-sm hover:text-white"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
