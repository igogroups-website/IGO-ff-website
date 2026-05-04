'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, ChevronDown, Leaf, Loader2, Plus, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addProduct, deleteAllProducts } from '@/lib/admin';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [isSeeding, setIsSeeding] = useState(false);

  const categories = ['All', 'Seasonal', 'Fruits', 'Vegetables', 'Valluvam Products'];

  const normalizeProduct = (p: any) => {
    // Better image normalization
    let img = p.image_url || (Array.isArray(p.image_urls) ? p.image_urls[0] : null);
    
    // If it's a relative path and doesn't start with /, add it
    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('/')) {
      img = '/' + img;
    }

    return {
      ...p,
      category: p.category || 
               (p.category_id === 'cat-veg' ? 'Vegetables' : 
                p.category_id === 'cat-fruit' ? 'Fruits' : 
                p.category_id === 'cat-val' ? 'Valluvam Products' : 
                p.category_id) || '',
      image_url: img || '/placeholder_product.png',
      stock: p.stock !== undefined ? p.stock : (p.in_stock ? 100 : 0)
    };
  };

  const SAMPLES = [
    // VEGETABLES (20)
    { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', unit: 'kg' },
    { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', unit: 'kg' },
    { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', unit: 'kg' },
    { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', unit: 'kg' },
    { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', unit: 'kg' },
    { name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads.', unit: 'kg' },
    { name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', unit: 'kg' },
    { name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', unit: 'kg' },
    { name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', unit: 'bundle' },
    { name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', unit: 'piece' },
    { name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', unit: 'kg' },
    { name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', unit: 'kg' },
    { name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', unit: 'bundle' },
    { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', unit: 'kg' },
    { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', unit: 'kg' },
    { name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', unit: 'kg' },
    { name: 'Radish', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', unit: 'kg' },
    { name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', unit: 'kg' },
    { name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', unit: 'bundle' },
    { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', unit: 'kg' },
    
    // FRUITS (14)
    { name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', unit: 'kg', is_seasonal: true },
    { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', unit: 'dozen' },
    { name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', unit: 'kg', is_seasonal: true },
    { name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', unit: 'kg' },
    { name: 'Guava', category: 'Fruits', price: 70.00, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', unit: 'kg' },
    { name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', unit: 'kg', is_seasonal: true },
    { name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', unit: 'kg', is_seasonal: true },
    { name: 'Orange', category: 'Fruits', price: 110.00, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', unit: 'kg' },
    { name: 'Papaya', category: 'Fruits', price: 40.00, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', unit: 'kg' },
    { name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', unit: 'piece' },
    { name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', unit: 'kg' },
    { name: 'Sapota', category: 'Fruits', price: 60.00, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', unit: 'kg' },
    { name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', unit: 'kg' },
    { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', unit: 'piece', is_seasonal: true },
    
    // VALLUVAM PRODUCTS (10)
    { name: 'Coconut Oil', category: 'Valluvam Products', price: 280, image_url: '/Valluvam/coconut-1L.jpg', description: 'Pure, unrefined cold pressed coconut oil.', unit: '1L' },
    { name: 'Groundnut Oil', category: 'Valluvam Products', price: 320, image_url: '/Valluvam/ground-1L.jpg', description: 'Traditional cold pressed groundnut oil.', unit: '1L' },
    { name: 'Sesame Oil', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/sesame-1L.jpg', description: 'Rich and aromatic cold pressed sesame oil.', unit: '1L' },
    { name: 'Palm Jaggery', category: 'Valluvam Products', price: 180, image_url: '/Valluvam/products-plam.jpg', description: 'Authentic palm jaggery with no additives.', unit: '500g' },
    { name: 'Forest Honey', category: 'Valluvam Products', price: 350, image_url: '/Valluvam/products-naatu.jpg', description: 'Raw, unprocessed honey from deep forests.', unit: '500g' },
    { name: 'Traditional Millets', category: 'Valluvam Products', price: 120, image_url: '/Valluvam/millets.jpg', description: 'High-fiber traditional millets breakfast mix.', unit: '500g' },
    { name: 'Cashew Nuts', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/nuts.jpg', description: 'Large, crunchy premium quality cashew nuts.', unit: '250g' },
    { name: 'Turmeric Powder', category: 'Valluvam Products', price: 85, image_url: '/Valluvam/spieces.jpg', description: 'Pure turmeric powder with high curcumin content.', unit: '200g' },
    { name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, image_url: '/Valluvam/products-pine.jpg', description: 'Healthy alternative to white sugar.', unit: '500g' },
    { name: 'Pure Desi Ghee', category: 'Valluvam Products', price: 650, image_url: '/Valluvam/products-18.jpg', description: 'Pure A2 ghee made using traditional bilona method.', unit: '500ml' }
  ].map((p, idx) => ({ ...p, id: `local-${idx}`, stock: 100, is_active: true }));

  async function fetchProducts() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('is_active.eq.true,is_active.is.null');
      
      let dbProducts = (data || []).map(normalizeProduct);
      
      // Strict Catalog Policy: Only show items that have valid images and clear names
      const verifiedDbProducts = dbProducts.filter(p => 
        p.image_url && 
        !p.image_url.includes('unsplash') && 
        p.name.length > 2
      );

      // Combine DB products with local SAMPLES
      const allProductsMap = new Map();
      
      // Add local samples first (Source of Truth)
      SAMPLES.forEach(p => allProductsMap.set(p.name, p));
      
      // Overwrite/Add with verified DB products
      verifiedDbProducts.forEach(p => allProductsMap.set(p.name, p));
      
      const finalProducts = Array.from(allProductsMap.values());
      setProducts(finalProducts);
      setFilteredProducts(finalProducts);

      if (error && verifiedDbProducts.length === 0) {
        console.warn('Database fetch restricted, using local catalog only.');
      }
    } catch (err) {
      console.error('Fetch Failure, using local only:', err);
      setProducts(SAMPLES);
      setFilteredProducts(SAMPLES);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    
    const channel = supabase
      .channel('products_listing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleEmergencySeed() {
    setIsSeeding(true);
    const samples = [
      // VEGETABLES (20)
      { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', unit: 'kg' },
      { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', unit: 'kg' },
      { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', unit: 'kg' },
      { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', unit: 'kg' },
      { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', unit: 'kg' },
      { name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads.', unit: 'kg' },
      { name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', unit: 'kg' },
      { name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', unit: 'kg' },
      { name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', unit: 'bundle' },
      { name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', unit: 'piece' },
      { name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', unit: 'kg' },
      { name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', unit: 'kg' },
      { name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', unit: 'bundle' },
      { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', unit: 'kg' },
      { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', unit: 'kg' },
      { name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', unit: 'kg' },
      { name: 'Radish', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', unit: 'kg' },
      { name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', unit: 'kg' },
      { name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', unit: 'bundle' },
      { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', unit: 'kg' },
      
      // FRUITS (14)
      { name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', unit: 'kg', is_seasonal: true },
      { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', unit: 'dozen' },
      { name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', unit: 'kg', is_seasonal: true },
      { name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', unit: 'kg' },
      { name: 'Guava', category: 'Fruits', price: 70.00, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', unit: 'kg' },
      { name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', unit: 'kg', is_seasonal: true },
      { name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', unit: 'kg', is_seasonal: true },
      { name: 'Orange', category: 'Fruits', price: 110.00, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', unit: 'kg' },
      { name: 'Papaya', category: 'Fruits', price: 40.00, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', unit: 'kg' },
      { name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', unit: 'piece' },
      { name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', unit: 'kg' },
      { name: 'Sapota', category: 'Fruits', price: 60.00, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', unit: 'kg' },
      { name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', unit: 'kg' },
      { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', unit: 'piece', is_seasonal: true },
      
      // VALLUVAM PRODUCTS (10)
      { name: 'Cold Pressed Coconut Oil', category: 'Valluvam Products', price: 280, image_url: '/Valluvam/coconut-1L.jpg', description: 'Pure, unrefined cold pressed coconut oil.', unit: '1L' },
      { name: 'Cold Pressed Groundnut Oil', category: 'Valluvam Products', price: 320, image_url: '/Valluvam/ground-1L.jpg', description: 'Traditional cold pressed groundnut oil.', unit: '1L' },
      { name: 'Cold Pressed Sesame Oil', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/sesame-1L.jpg', description: 'Rich and aromatic cold pressed sesame oil.', unit: '1L' },
      { name: 'Natural Palm Jaggery', category: 'Valluvam Products', price: 180, image_url: '/Valluvam/products-plam.jpg', description: 'Authentic palm jaggery with no additives.', unit: '500g' },
      { name: 'Wild Forest Honey', category: 'Valluvam Products', price: 350, image_url: '/Valluvam/products-naatu.jpg', description: 'Raw, unprocessed honey from deep forests.', unit: '500g' },
      { name: 'Traditional Millets Mix', category: 'Valluvam Products', price: 120, image_url: '/Valluvam/millets.jpg', description: 'High-fiber traditional millets breakfast mix.', unit: '500g' },
      { name: 'Premium Cashew Nuts', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/nuts.jpg', description: 'Large, crunchy premium quality cashew nuts.', unit: '250g' },
      { name: 'Hand-ground Turmeric Powder', category: 'Valluvam Products', price: 85, image_url: '/Valluvam/spieces.jpg', description: 'Pure turmeric powder with high curcumin content.', unit: '200g' },
      { name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, image_url: '/Valluvam/products-pine.jpg', description: 'Healthy alternative to white sugar.', unit: '500g' },
      { name: 'A2 Desi Cow Ghee', category: 'Valluvam Products', price: 650, image_url: '/Valluvam/products-2.jpg', description: 'Pure A2 ghee made using traditional bilona method.', unit: '500ml' }
    ];

    try {
      // CLEAR DATABASE FIRST to ensure ONLY these products exist
      const { error: clearError } = await deleteAllProducts();
      if (clearError) {
        console.warn('Could not clear database, adding to existing:', clearError);
      }

      let count = 0;
      for (const sample of samples) {
        // Map to ACTUAL SCHEMA ONLY (remove 'category' and 'image_url' string fields)
        const productData: any = {
          name: sample.name,
          description: sample.description,
          price: sample.price,
          mrp: Math.round(sample.price * 1.2),
          unit: sample.unit,
          category_id: sample.category === 'Fruits' ? 'cat-fruit' : sample.category === 'Vegetables' ? 'cat-veg' : 'cat-val',
          category_slug: sample.category.toLowerCase().replace(/\s+/g, '-'),
          image_urls: [sample.image_url],
          in_stock: true,
          is_active: true,
          is_seasonal: (sample as any).is_seasonal || false
        };
        
        const { error } = await addProduct(productData);
        if (!error) count++;
        else console.error('Seed error for', sample.name, ':', error);
      }
      if (count > 0) {
        toast.success(`Successfully added ${count} products!`);
        fetchProducts();
      } else {
        toast.error('Failed to add products.');
      }
    } catch (err) {
      console.error('Seeding error:', err);
      toast.error('Seeding failed');
    } finally {
      setIsSeeding(false);
    }
  }

  useEffect(() => {
    let filtered = products;

    if (category === 'Seasonal') {
      filtered = filtered.filter(p => p.is_seasonal);
    } else if (category !== 'All') {
      filtered = filtered.filter(p => {
        const productCategory = (p.category || '').toString().trim().toLowerCase();
        const activeCategory = category.trim().toLowerCase();
        return productCategory === activeCategory;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => Number(p.price) <= priceRange);

    setFilteredProducts(filtered);
  }, [category, searchQuery, priceRange, products]);


  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-[#f9f9f7] pt-40 pb-12">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs mb-3 uppercase tracking-[0.3em]">
                <Leaf size={14} />
                <span>Harvest Catalog</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
                Explore Our <span className="text-primary italic font-serif lowercase">Freshness</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-xs md:text-right">
              Discover {products.length} organic products harvested directly from our farms.
            </p>
          </div>

          {/* Quick Category Chips - Blinkit Style */}
          <div className="mt-12 flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                  category === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-white text-muted-foreground hover:bg-muted border border-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-12 h-fit lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Filter size={18} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Categories</h3>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-between group ${
                      category === cat 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cat === 'Seasonal' && <Star size={16} className={category === 'Seasonal' ? 'text-white' : 'text-accent'} />}
                      {cat}
                    </div>
                    {category === cat && <motion.div layoutId="cat-indicator" className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
              <h3 className="text-lg font-black mb-6">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer mb-4"
              />
              <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-widest">
                <span>₹0</span>
                <span className="text-primary">Up to ₹{priceRange}</span>
              </div>
            </div>

            <div className="p-8 organic-gradient rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Leaf size={120} />
              </div>
              <h4 className="text-xl font-black mb-3 relative z-10">Organic Promise</h4>
              <p className="text-sm opacity-90 leading-relaxed relative z-10 font-medium">
                All our products are 100% pesticide-free and sustainably grown on our local farms.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Professional Search Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center mb-12">
              <div className="relative flex-1 w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                  <Search size={22} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search fresh products..."
                  className="w-full bg-white border border-border/60 rounded-[1.5rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-lg shadow-sm placeholder:text-muted-foreground/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-6 px-4">
                <p className="text-sm font-bold text-muted-foreground/60 whitespace-nowrap">
                  Showing <span className="text-foreground">{filteredProducts.length}</span> products
                </p>
                <div className="h-8 w-px bg-border/60" />
                <button className="flex items-center gap-2 text-sm font-black text-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  Sort <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2">No matching products</h3>
                <p className="text-muted-foreground text-center max-w-xs font-medium mb-8">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => { setCategory('All'); setSearchQuery(''); setPriceRange(2000); }}
                    className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                  >
                    Show All Products
                  </button>
                  
                  <Link 
                    href="/admin/products"
                    className="text-primary font-bold text-xs uppercase tracking-widest hover:underline text-center"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
export default function ProductListing() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#fdfdfb]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}
