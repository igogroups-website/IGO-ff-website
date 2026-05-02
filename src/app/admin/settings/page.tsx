'use client';

import React from 'react';
import { 
  Settings, 
  Store, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <Store className="text-primary" size={24} />
            <h3 className="text-xl font-black uppercase tracking-tight">Store Profile</h3>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Manage your public store information and contact details.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Store Name</label>
              <input 
                type="text" 
                defaultValue="Farmers Factory"
                className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@farmersfactory.com"
                className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 outline-none font-bold"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Store Address</label>
            <textarea 
              rows={3}
              defaultValue="No. 123, Organic Street, Valluvam City, Tamil Nadu, India"
              className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 outline-none font-bold resize-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-border shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="text-amber-500" size={20} />
            <h3 className="text-lg font-black uppercase tracking-tight">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all">
              <span className="font-bold">Email for new orders</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl cursor-pointer hover:bg-muted/50 transition-all">
              <span className="font-bold">Low stock alerts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-border shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500" size={20} />
            <h3 className="text-lg font-black uppercase tracking-tight">Security</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-muted/30 rounded-2xl font-bold hover:bg-muted/50 transition-all">
              Change Admin Password
            </button>
            <button className="w-full text-left p-4 bg-muted/30 rounded-2xl font-bold hover:bg-muted/50 transition-all">
              Manage API Keys
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 shadow-lg shadow-primary/10">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
