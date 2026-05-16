'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Filter,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }

  const toggleStock = async (product: any) => {
    const newStock = product.stock > 0 ? 0 : 50; // Simple toggle
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);
      if (error) throw error;
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
      toast.success(`${product.name} is now ${newStock > 0 ? 'In Stock' : 'Out of Stock'}`);
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'instock') return matchesSearch && p.stock > 0;
    if (filter === 'outofstock') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase mb-2">Inventory <span className="text-primary italic font-serif lowercase">Control</span></h1>
        <p className="text-muted-foreground font-bold text-sm">Real-time stock management and availability toggles.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-2xl pl-16 pr-6 py-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 md:w-48 bg-white border border-border rounded-2xl px-6 py-4 font-black uppercase text-[10px] tracking-widest focus:ring-4 focus:ring-primary/10 appearance-none shadow-sm"
          >
            <option value="all">All Products</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <div className="bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
             <Zap size={20} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">{products.length} Items</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-black text-primary uppercase tracking-[0.3em] text-xs">Syncing Warehouse...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                <th className="px-10 py-6">Product</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Current Stock</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-primary/5 transition-all group font-bold">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/20 overflow-hidden border border-border/50">
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-muted-foreground uppercase text-[10px] tracking-widest">{p.category}</td>
                  <td className="px-10 py-6">
                    <span className={`text-lg font-black ${p.stock <= 5 ? 'text-red-500' : 'text-foreground'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    {p.stock > 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <XCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => toggleStock(p)}
                      className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        p.stock > 0 
                          ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' 
                          : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      {p.stock > 0 ? 'SET OUT OF STOCK' : 'SET IN STOCK'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-muted-foreground font-bold">No items found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
}
