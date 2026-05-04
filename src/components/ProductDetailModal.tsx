'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, Plus, Minus, Check, AlertCircle, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import QuickAddCarousel from './QuickAddCarousel';
import { FALLBACK_PRODUCTS, getSmartRecommendations, getTrendingProducts } from '@/lib/constants';
import ProductReviews from './ProductReviews';
import SmartMealBundling from './SmartMealBundling';
import SustainabilityMeter from './SustainabilityMeter';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    unit: string;
    category?: string;
    description?: string;
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
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
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

    try {
      // Professional Recommendation Logic:
      // 1. Try to get smart pairings from our verified catalog first - Increased limit to 24
      const smartRecs = getSmartRecommendations(currentProduct, 24);
      
      // 2. Supplement with DB products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', currentProduct.category)
        .neq('id', currentProduct.id)
        .limit(24);
      
      let dbRelated = data || [];
      
      // Strict Catalog Policy
      const verifiedDbRelated = dbRelated.filter(p => 
        p.image_url && 
        !p.image_url.includes('unsplash') && 
        p.name.length > 2
      );

      // Merge and prioritize smart recommendations
      let finalRelated = [...smartRecs];
      
      // Add unique verified items from DB
      verifiedDbRelated.forEach(p => {
        if (!finalRelated.some(r => r.name === p.name)) {
          finalRelated.push(p);
        }
      });
      
      setRelatedProducts(finalRelated.slice(0, 24));

      // 3. Get Trending Products for extra discovery
      const excludeIds = [currentProduct.id, ...finalRelated.map(p => p.id)];
      const trending = getTrendingProducts(12, excludeIds);
      setTrendingProducts(trending);

    } catch (err) {
      console.error('Error fetching related:', err);
      // Direct fallback - more items
      setRelatedProducts(FALLBACK_PRODUCTS.filter(p => p.category === currentProduct?.category).slice(0, 12));
      setTrendingProducts(FALLBACK_PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 8));
    }
  }

  if (!currentProduct) return null;

  const triggerAddedOverlay = () => {
    setShowAddedOverlay(true);
    setTimeout(() => {
      setShowAddedOverlay(false);
      onClose();
    }, 2000);
  };

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
      const productWithSub = {
        ...currentProduct,
        is_subscription: isSubscribed,
        frequency: isSubscribed ? frequency : null
      };
      const success = await addToCart(currentProduct.id, quantity, productWithSub);
      if (!success) throw new Error('Failed to add to cart');

      if (isBuyNow) {
        toast.success('Proceeding to checkout...');
        router.push('/checkout');
      } else {
        triggerAddedOverlay();
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
                    (currentProduct.stock ?? 0) === 0 ? 'grayscale opacity-60' : ''
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

                {/* Scarcity & Social Proof */}
                <div className="mt-8 flex flex-col gap-3">
                  {(currentProduct.stock ?? 0) > 0 && (currentProduct.stock ?? 0) <= 10 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-700"
                    >
                      <AlertCircle size={20} className="animate-pulse" />
                      <p className="text-xs font-black uppercase tracking-tight">Hurry! Only {currentProduct.stock} items left in stock</p>
                    </motion.div>
                  )}
                  
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden">
                            <User size={12} className="text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {Math.floor(Math.random() * 15) + 5} people are viewing this harvest
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  </div>
                </div>

                {(currentProduct.stock ?? 0) === 0 && (
                  <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-600">
                    <AlertCircle size={24} />
                    <p className="font-black uppercase tracking-tight">This product is currently out of stock</p>
                  </div>
                )}

                {/* Smart Meal Bundling Suggestions */}
                <SmartMealBundling currentProduct={currentProduct} onAddSuccess={triggerAddedOverlay} />

                {/* Sustainability & Impact Meter */}
                <SustainabilityMeter productName={currentProduct.name} category={currentProduct.category || 'General'} />

                {/* Subscribe & Save Option */}
                <div className="mt-8 space-y-4">
                  <div 
                    onClick={() => setIsSubscribed(false)}
                    className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all ${!isSubscribed ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-white hover:border-primary/30'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!isSubscribed ? 'border-primary' : 'border-muted'}`}>
                          {!isSubscribed && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <span className="font-black text-lg">One-time Purchase</span>
                      </div>
                      <span className="font-black text-xl text-foreground">₹{currentProduct.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium pl-9 italic">Standard farm-to-door delivery</p>
                  </div>

                  <div 
                    onClick={() => setIsSubscribed(true)}
                    className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all relative overflow-hidden ${isSubscribed ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-white hover:border-primary/30'}`}
                  >
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                      Save 10%
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSubscribed ? 'border-primary' : 'border-muted'}`}>
                          {isSubscribed && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <span className="font-black text-lg">Subscribe & Save</span>
                      </div>
                      <span className="font-black text-xl text-primary">₹{Math.round(currentProduct.price * 0.9)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium pl-9 italic">Automated fresh harvest every {frequency}</p>
                    
                    <AnimatePresence>
                      {isSubscribed && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-9 mt-4 pt-4 border-t border-primary/10 flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {['daily', 'weekly', 'monthly'].map((f) => (
                            <button
                              key={f}
                              onClick={() => setFrequency(f)}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${frequency === f ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:border-primary'}`}
                            >
                              {f}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
                    disabled={loading || (currentProduct.stock ?? 0) === 0}
                    className={`flex-1 border-2 py-5 rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm ${
                      (currentProduct.stock ?? 0) === 0 
                        ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-white border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    <ShoppingBag size={24} />
                    {(currentProduct.stock ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => handleAction(true)}
                    disabled={loading || (currentProduct.stock ?? 0) === 0}
                    className={`flex-1 py-5 rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${
                      (currentProduct.stock ?? 0) === 0 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
                        : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                    }`}
                  >
                    Buy It Now
                  </button>
                </div>
              </div>

                {relatedProducts.length > 0 && (
                  <div className="border-t border-border/60 pt-12 mt-12">
                    <QuickAddCarousel 
                      products={relatedProducts} 
                      title="Similar Harvest" 
                      subtitle="Customers also explored these fresh picks"
                      onAddSuccess={triggerAddedOverlay}
                      onProductClick={(p) => {
                        setCurrentProduct(p);
                        setQuantity(1);
                        setImageError(false);
                        const modalContent = document.querySelector('.custom-scrollbar');
                        if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}

                {trendingProducts.length > 0 && (
                  <div className="pt-8">
                    <QuickAddCarousel 
                      products={trendingProducts} 
                      title="Trending Harvest" 
                      subtitle="Top picks from other categories"
                      onAddSuccess={triggerAddedOverlay}
                      onProductClick={(p) => {
                        setCurrentProduct(p);
                        setQuantity(1);
                        setImageError(false);
                        const modalContent = document.querySelector('.custom-scrollbar');
                        if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}

                <ProductReviews productId={currentProduct.id} />
                
                <div className="h-12" /> {/* Extra spacer for bottom scroll */}
                
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
