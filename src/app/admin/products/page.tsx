'use client';

import React, { useEffect, useState } from 'react';
import { 
  getAllProducts,
  updateProductStock, 
  addProduct,
  deleteProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct
} from '@/lib/admin';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  RotateCcw,
  Ban,
  Image as ImageIcon,
  Loader2,
  X,
  Upload,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

function ProductsContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, removed
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [inlineEditingPrice, setInlineEditingPrice] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    description: '',
    unit: 'kg',
    image_url: '',
    stock: 100,
    is_seasonal: false
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    description: '',
    unit: 'kg',
    image_url: '',
    stock: 100,
    is_seasonal: false
  });

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await getAllProducts();
    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Could not load products. Check database connection.');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function handleAddSamples() {
    setIsBulkLoading(true);
    const samples = [
      // VEGETABLES (20 items)
      { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads and stir-fry.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', stock: 100, unit: 'bundle', is_active: true },
      { name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', stock: 100, unit: 'piece', is_active: true },
      { name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', stock: 100, unit: 'bundle', is_active: true },
      { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Radish', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', stock: 100, unit: 'bundle', is_active: true },
      { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', stock: 100, unit: 'kg', is_active: true },
      
      // FRUITS (14 items)
      { name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
      { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', stock: 100, unit: 'dozen', is_active: true },
      { name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
      { name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Guava', category: 'Fruits', price: 70.00, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
      { name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Orange', category: 'Fruits', price: 110.00, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Papaya', category: 'Fruits', price: 40.00, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', stock: 100, unit: 'piece', is_active: true },
      { name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Sapota', category: 'Fruits', price: 60.00, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', stock: 100, unit: 'kg', is_active: true },
      { name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', stock: 100, unit: 'kg', is_active: true },
      { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', stock: 100, unit: 'piece', is_active: true, is_seasonal: true },
      
      // Valluvam Products (Authentic Catalog)
      { name: 'Cold Pressed Coconut Oil', category: 'Valluvam Products', price: 280, unit: '1L', stock: 50, description: 'Pure, unrefined cold pressed coconut oil.', image_url: '/Valluvam/images/coconut-1L.jpg', is_active: true },
      { name: 'Cold Pressed Groundnut Oil', category: 'Valluvam Products', price: 320, unit: '1L', stock: 50, description: 'Traditional cold pressed groundnut oil.', image_url: '/Valluvam/images/ground-1L.jpg', is_active: true },
      { name: 'Cold Pressed Sesame Oil', category: 'Valluvam Products', price: 450, unit: '1L', stock: 50, description: 'Rich and aromatic cold pressed sesame oil.', image_url: '/Valluvam/images/sesame-1L.jpg', is_active: true },
      { name: 'Natural Palm Jaggery', category: 'Valluvam Products', price: 180, unit: '500g', stock: 40, description: 'Authentic palm jaggery with no additives.', image_url: '/Valluvam/images/palm-jaggery(500).jpg', is_active: true },
      { name: 'Wild Forest Honey', category: 'Valluvam Products', price: 350, unit: '500g', stock: 30, description: 'Raw, unprocessed honey from deep forests.', image_url: '/Valluvam/images/products-naatu.jpg', is_active: true },
      { name: 'Traditional Millets Mix', category: 'Valluvam Products', price: 120, unit: '500g', stock: 100, description: 'High-fiber traditional millets breakfast mix.', image_url: '/Valluvam/images/millets.jpg', is_active: true },
      { name: 'Premium Cashew Nuts', category: 'Valluvam Products', price: 450, unit: '250g', stock: 60, description: 'Large, crunchy premium quality cashew nuts.', image_url: '/Valluvam/images/nuts.jpg', is_active: true },
      { name: 'Hand-ground Turmeric Powder', category: 'Valluvam Products', price: 85, unit: '200g', stock: 80, description: 'Pure turmeric powder with high curcumin content.', image_url: '/Valluvam/images/spieces.jpg', is_active: true },
      { name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, unit: '500g', stock: 45, description: 'Healthy alternative to white sugar.', image_url: '/Valluvam/images/products-plam.jpg', is_active: true },
      { name: 'A2 Desi Cow Ghee', category: 'Valluvam Products', price: 650, unit: '500ml', stock: 25, description: 'Pure A2 ghee made using traditional bilona method.', image_url: '/Valluvam/images/products-2.jpg', is_active: true }
    ];

    try {
      let count = 0;
      for (const sample of samples) {
        const { error } = await addProduct(sample);
        if (!error) count++;
      }
      toast.success(`Imported ${count} products successfully!`);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to add samples');
    } finally {
      setIsBulkLoading(false);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('admin_products_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function toggleStock(productId: string, inStock: boolean) {
    const { error } = await updateProductStock(productId, inStock);
    if (!error) {
      toast.success(inStock ? 'Product marked as In Stock' : 'Product marked as Out of Stock');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: inStock ? 100 : 0 } : p));
    } else {
      toast.error('Failed to update stock status');
    }
  }

  async function handleSoftDelete(productId: string) {
    const { error } = await softDeleteProduct(productId);
    if (!error) {
      toast.success('Product removed from website');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_active: false } : p));
    } else {
      toast.error('Failed to remove product');
    }
  }

  async function handleRestore(productId: string) {
    const { error } = await restoreProduct(productId);
    if (!error) {
      toast.success('Product restored to website');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_active: true } : p));
    } else {
      toast.error('Failed to restore product');
    }
  }

  async function handleHardReset() {
    if (confirm('DANGER: This will delete ALL current products and reset to the default catalog. Proceed?')) {
      setIsBulkLoading(true);
      try {
        // Clear all products first
        for (const p of products) {
          await deleteProduct(p.id);
        }
        
        // Re-fetch (should be empty now)
        setProducts([]);
        
        // Add all samples from the initial catalog
        await handleAddSamples();
        toast.success('Database has been hard reset to defaults');
      } catch (err) {
        toast.error('Hard reset failed');
      } finally {
        setIsBulkLoading(false);
      }
    }
  }

  async function handleInlinePriceUpdate(productId: string) {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;

    const { error } = await updateProduct(productId, { price });
    if (!error) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price } : p));
      setInlineEditingPrice(null);
    }
  }

  async function handleBulkAction(action: 'in_stock' | 'out_stock' | 'archive' | 'restore') {
    if (selectedProducts.length === 0) return;
    setIsBulkLoading(true);
    
    try {
      const updates = selectedProducts.map(async (id) => {
        if (action === 'in_stock') return updateProductStock(id, true);
        if (action === 'out_stock') return updateProductStock(id, false);
        if (action === 'archive') return softDeleteProduct(id);
        if (action === 'restore') return restoreProduct(id);
      });

      await Promise.all(updates);
      
      // Refresh products or update state locally
      setProducts(prev => prev.map(p => {
        if (selectedProducts.includes(p.id)) {
          if (action === 'in_stock') return { ...p, stock: 100 };
          if (action === 'out_stock') return { ...p, stock: 0 };
          if (action === 'archive') return { ...p, is_active: false };
          if (action === 'restore') return { ...p, is_active: true };
        }
        return p;
      }));
      
      setSelectedProducts([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
    } finally {
      setIsBulkLoading(false);
    }
  }

  function toggleSelectAll() {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  }

  function toggleSelectProduct(id: string) {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function openEditModal(product: any) {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description || '',
      unit: product.unit,
      image_url: product.image_url || '',
      stock: product.stock,
      is_seasonal: product.is_seasonal || false
    });
    setIsAddModalOpen(true);
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingProduct) {
      const { data, error } = await updateProduct(editingProduct.id, {
        ...editFormData,
        price: parseFloat(editFormData.price)
      });
      
      if (!error && data) {
        toast.success('Product updated successfully!');
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
        setIsAddModalOpen(false);
        setEditingProduct(null);
      } else {
        toast.error('Failed to update product');
      }
    } else {
      const { data, error } = await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price)
      });
      
      if (!error && data) {
        toast.success('New product added!');
        setProducts([data, ...products]);
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          category: 'Vegetables',
          price: '',
          description: '',
          unit: 'kg',
          image_url: '',
          stock: 100,
          is_seasonal: false
        });
      } else {
        toast.error('Failed to add product');
      }
    }
  }

  async function handleDeleteProduct(productId: string, name: string) {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const { error } = await deleteProduct(productId);
      if (!error) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? product.is_active !== false :
      statusFilter === 'removed' ? product.is_active === false : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select 
                className="pl-12 pr-10 py-3 rounded-2xl border border-border bg-white appearance-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Valluvam Products">Valluvam Products</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select 
                className="pl-12 pr-10 py-3 rounded-2xl border border-border bg-white appearance-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="removed">Removed Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            ADD NEW PRODUCT
          </button>

          <button 
            onClick={handleHardReset}
            disabled={isBulkLoading}
            className="bg-red-50 text-red-600 px-6 py-4 rounded-[1.5rem] font-black flex items-center gap-2 hover:bg-red-100 transition-all active:scale-95 border border-red-100"
            title="Reset to Default Catalog"
          >
            <RotateCcw size={18} className={isBulkLoading ? 'animate-spin' : ''} />
            RESET CATALOG
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 text-white p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-30 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-2 rounded-xl text-primary">
                <Check size={20} />
              </div>
              <span className="font-bold">{selectedProducts.length} products selected</span>
              <button 
                onClick={() => setSelectedProducts([])}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Deselect All
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                disabled={isBulkLoading}
                onClick={() => handleBulkAction('in_stock')}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Set In Stock
              </button>
              <button 
                disabled={isBulkLoading}
                onClick={() => handleBulkAction('out_stock')}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Set Out of Stock
              </button>
              <button 
                disabled={isBulkLoading}
                onClick={() => handleBulkAction('archive')}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Archive
              </button>
              <button 
                disabled={isBulkLoading}
                onClick={() => handleBulkAction('restore')}
                className="bg-primary hover:bg-primary/80 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Restore
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <input 
          type="checkbox" 
          id="select-all"
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={toggleSelectAll}
        />
        <label htmlFor="select-all" className="cursor-pointer">Select All Products ({filteredProducts.length})</label>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-[2.5rem] border-2 transition-all relative group flex flex-col ${
                selectedProducts.includes(product.id) ? 'border-primary ring-4 ring-primary/10 shadow-2xl' :
                product.is_active === false 
                  ? 'border-slate-100 opacity-75 grayscale-[0.5]' 
                  : 'border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10'
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 right-4 z-20">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleSelectProduct(product.id)}
                  className="w-6 h-6 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary bg-white/80 backdrop-blur-sm cursor-pointer transition-all"
                />
              </div>
              {/* Status Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                  product.stock > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}>
                  {product.stock > 0 ? '● In Stock' : '○ Out of Stock'}
                </div>
                {product.is_seasonal && (
                  <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg bg-accent text-accent-foreground">
                    ★ Seasonal
                  </div>
                )}
                {product.is_active === false && (
                  <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg bg-slate-800/90 text-white">
                    Archived
                  </div>
                )}
              </div>

              {/* Top Action Buttons (Edit/Delete) */}
              <div className="absolute top-4 right-4 z-10 flex gap-2 transition-all">
                <button 
                  onClick={() => openEditModal(product)}
                  className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-foreground hover:bg-primary hover:text-white transition-all shadow-xl border border-border"
                  title="Edit Product"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl border border-border"
                  title="Permanently Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Image Section */}
              <div className="aspect-[4/3] bg-muted rounded-t-[2.5rem] overflow-hidden relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-50">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Section */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1 block">{product.category}</span>
                    <h3 className="text-2xl font-black tracking-tight leading-tight">{product.name}</h3>
                  </div>
                  <div className="text-right">
                    {inlineEditingPrice === product.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          className="w-24 px-3 py-2 rounded-xl border-2 border-primary outline-none text-right font-black text-lg"
                          value={newPrice}
                          autoFocus
                          onChange={(e) => setNewPrice(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleInlinePriceUpdate(product.id);
                            if (e.key === 'Escape') setInlineEditingPrice(null);
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer group/price"
                        onClick={() => {
                          setInlineEditingPrice(product.id);
                          setNewPrice(product.price.toString());
                        }}
                      >
                        <p className="text-3xl font-black text-primary tracking-tighter">₹{product.price}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-right">per {product.unit}</p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-medium leading-relaxed">
                  {product.description || 'Premium quality farm fresh product delivered straight to your door.'}
                </p>

                <button 
                  onClick={() => openEditModal(product)}
                  className="w-full mb-8 py-3 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/edit"
                >
                  <Edit size={14} className="group-hover/edit:scale-125 transition-transform" />
                  Edit Full Details
                </button>

                {/* Advanced Controls Section */}
                <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inventory Status</span>
                    <div className="flex items-center gap-1">
                      <Package size={14} className="text-muted-foreground" />
                      <span className="text-xs font-bold">{product.stock} Units Available</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Stock Toggles */}
                    <button 
                      onClick={() => toggleStock(product.id, true)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        product.stock > 0 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200 hover:text-emerald-500'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      In Stock
                    </button>
                    <button 
                      onClick={() => toggleStock(product.id, false)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        product.stock === 0 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-white text-slate-400 border border-slate-100 hover:border-red-200 hover:text-red-500'
                      }`}
                    >
                      <XCircle size={16} />
                      Out of Stock
                    </button>
                  </div>

                  {/* Archive/Restore Toggle */}
                  <button 
                    onClick={() => product.is_active !== false ? handleSoftDelete(product.id) : handleRestore(product.id)}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all ${
                      product.is_active !== false
                        ? 'bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {product.is_active !== false ? (
                      <>
                        <Ban size={18} />
                        Remove from Website
                      </>
                    ) : (
                      <>
                        <RotateCcw size={18} />
                        Restore to Website
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8">
            <Package size={48} />
          </div>
          <h3 className="text-2xl font-black mb-2">No products found</h3>
          <p className="text-muted-foreground font-medium mb-8 max-w-sm text-center">
            Your inventory is currently empty. Start by adding a new product or use the sample products below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Add Your First Product
            </button>
            <button 
              onClick={handleAddSamples}
              disabled={isBulkLoading}
              className="bg-white border-2 border-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              {isBulkLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Load Sample Products
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Sidebar - Image Preview */}
              <div className="w-full md:w-80 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="w-full aspect-square bg-white rounded-3xl shadow-inner border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-6 relative group">
                  {(editingProduct ? editFormData.image_url : newProduct.image_url) ? (
                    <img 
                      src={editingProduct ? editFormData.image_url : newProduct.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon size={48} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Image Uploaded</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          if (editingProduct) {
                            setEditFormData({...editFormData, image_url: base64String});
                          } else {
                            setNewProduct({...newProduct, image_url: base64String});
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-3 rounded-2xl shadow-xl text-primary">
                      <Upload size={20} />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Live Preview</h4>
                <p className="text-center text-[10px] text-slate-500 font-medium px-4">This is how your product image will appear to customers.</p>
                
                <div className="mt-8 w-full space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Or Paste Image URL</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all text-sm"
                    placeholder="https://images.unsplash.com/..."
                    value={editingProduct ? editFormData.image_url : newProduct.image_url}
                    onChange={(e) => editingProduct 
                      ? setEditFormData({...editFormData, image_url: e.target.value})
                      : setNewProduct({...newProduct, image_url: e.target.value})}
                  />
                </div>
              </div>

              {/* Modal Body - Form */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight leading-none mb-1">
                      {editingProduct ? 'EDIT PRODUCT' : 'NEW HARVEST'}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Update your store inventory</p>
                  </div>
                  <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Product Identity</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all text-lg"
                        placeholder="e.g. Alphonso Mangoes"
                        value={editingProduct ? editFormData.name : newProduct.name}
                        onChange={(e) => editingProduct 
                          ? setEditFormData({...editFormData, name: e.target.value})
                          : setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Store Category</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-bold appearance-none bg-white transition-all text-lg"
                        value={editingProduct ? editFormData.category : newProduct.category}
                        onChange={(e) => editingProduct
                          ? setEditFormData({...editFormData, category: e.target.value})
                          : setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Valluvam Products">Valluvam Products</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Price (INR ₹)</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">₹</span>
                        <input 
                          required
                          type="number" 
                          className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-black transition-all text-lg"
                          placeholder="0.00"
                          value={editingProduct ? editFormData.price : newProduct.price}
                          onChange={(e) => editingProduct
                            ? setEditFormData({...editFormData, price: e.target.value})
                            : setNewProduct({...newProduct, price: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Selling Unit</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all text-lg"
                        placeholder="e.g. 1 kg / Box / Bunch"
                        value={editingProduct ? editFormData.unit : newProduct.unit}
                        onChange={(e) => editingProduct
                          ? setEditFormData({...editFormData, unit: e.target.value})
                          : setNewProduct({...newProduct, unit: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current Stock Level</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">
                          <Package size={20} />
                        </span>
                        <input 
                          required
                          type="number" 
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-black transition-all text-lg"
                          placeholder="0"
                          value={editingProduct ? editFormData.stock : newProduct.stock}
                          onChange={(e) => editingProduct
                            ? setEditFormData({...editFormData, stock: parseInt(e.target.value) || 0})
                            : setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Special status</label>
                      <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 cursor-pointer hover:border-primary/30 transition-all">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                          checked={editingProduct ? editFormData.is_seasonal : newProduct.is_seasonal}
                          onChange={(e) => editingProduct
                            ? setEditFormData({...editFormData, is_seasonal: e.target.checked})
                            : setNewProduct({...newProduct, is_seasonal: e.target.checked})}
                        />
                        <span className="font-bold text-slate-700">Mark as Seasonal Product</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Product Story / Description</label>
                    <textarea 
                      rows={4}
                      className="w-full px-6 py-5 rounded-3xl border-2 border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none font-bold resize-none transition-all text-base leading-relaxed"
                      placeholder="Share some details about the freshness and source of this product..."
                      value={editingProduct ? editFormData.description : newProduct.description}
                      onChange={(e) => editingProduct
                        ? setEditFormData({...editFormData, description: e.target.value})
                        : setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex gap-4 sticky bottom-0 bg-white pb-2">
                    <button 
                      type="button"
                      onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                      className="flex-1 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.1em] text-slate-500 border-2 border-slate-100 hover:bg-slate-50 transition-all text-xs"
                    >
                      Discard Changes
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] text-xs shadow-xl shadow-primary/10"
                    >
                      {editingProduct ? 'Update Product Details' : 'Launch New Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading products...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
